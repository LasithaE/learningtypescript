import Hapi from '@hapi/hapi'
import boom from '@hapi/boom'
import { PrismaClient } from '.prisma/client'
import Joi from '@hapi/joi'
import { URLSearchParams } from 'url'
import { parse } from 'path/posix'
const usersPlugin: Hapi.Plugin<undefined>={
    name:'app/users',
    dependencies:['prisma'],
    register: async function (server:Hapi.Server) {
        server.route([
            {
                method:'POST',
                path:'/users',
                handler:createUserHandler,
                options:{
                    validate:{
                        payload:userInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        }
                    }
                }
            },
            
            {
                method:'GET',
                path:'/users/{userId}',
                handler:getUserHandler,
                options: {
                    validate: {
                        
                        params:Joi.object({
                            userId: Joi.string().pattern(/^[0-9]+$/),
                        }),

                    }
                }
            },
            {
                method: 'PUT',
                path:'/users/{userId}',
                handler:UpdateUserHandler,
                options:
                {
                    validate:{
                        payload:userInputValidator,
                        params:Joi.object({
                            userId: Joi.string().pattern(/^[0-9]+$/),
                        }),
                        failAction:(request,h,err)=> {
                            //show validation errors to user 
                            throw err
                        },
                        
                    },
                },
            },
            {
                method:'DELETE',
                path:'/users/{userId}',
                handler:DeleteUserHandler,
                options:
                {
                    validate:{
                        params:Joi.object({
                            userId:Joi.string().pattern(/^[0-9']+$/),
                        }),
                        failAction:(request,h,err)=>{
                            throw err
                        },
                    },
                },
            },

        ])
    },
}
export default usersPlugin
interface UserInput {
    email: string
    
    lastName: string
    firstName: string
    social: {
        facebook?: string
        twitter?: string
        github?: string
        website?: string
        tiktok?: string
    }
}
const userInputValidator=  Joi.object({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().required(),
    social:Joi.object({
        facebook:Joi.string().optional(),
        twitter:Joi.string().optional(),
        github:Joi.string().optional(),
        website:Joi.string().uri().optional(),
        tiktok:Joi.string().optional(),
    })
})
async function createUserHandler(request:Hapi.Request,h:Hapi.ResponseToolkit) {
    const {prisma}=request.server.app
    const payload = request.payload as UserInput//payload is a runtime object that comes from the caller to API, so TS can't know the type.
    //hence we have type assertion: provides an overriding functionality that allows us to override a variable of a type
    try {
        const createdUser = await prisma.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName:payload.lastName,
                social:payload.social,
            },
        })
        return h.response({id : createdUser.id}).code(201)
    } catch (error) {
        console.log(error)
        return boom.badImplementation('Error creating')
    }

}
async function getUserHandler(request:Hapi.Request,h:Hapi.ResponseToolkit) {
    const {prisma} = request.server.app
    const userId = request.params.userId

    const user=await prisma.user.findOne({
        where:{
            id:parseInt(userId,10)
        }
    })
    if (!user) {
        return boom.notFound('User not found')

    }
    return h.response(user).code(200)
}
async function UpdateUserHandler(request:Hapi.Request,h:Hapi.ResponseToolkit) {
    const {prisma} = request.server.app
    const userId = request.params.userId
    const payload = request.payload as UserInput
    try {
        await prisma.user.update({
            where:{
                id:parseInt(userId,10),
            },
            data: payload, 
        })
        return h.response().code(204)
    } catch (error) {
        console.log(error)
        return h.response().code(500)
    }

}
async function DeleteUserHandler(request:Hapi.Request,h:Hapi.ResponseToolkit){
    const {prisma} = request.server.app
    const userId=request.params.userId as string
    try {
        await prisma.user.delete({
            where:{
                id:parseInt(userId,10),
            },
        })
        return h.response().code(204)
    } catch (err) {
        console.log(err)
        return h.response().code(500)
    }
}