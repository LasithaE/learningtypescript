import Hapi from '@hapi/hapi'
const plugin : Hapi.Plugin<undefined>={
    name:'app/satus',
    register: async function (server: Hapi.Server) {
        server.route({ 
            method:'GET',
            path:'/',
            handler: async(request: Hapi.Request,h:Hapi.ResponseToolkit)=>{ //h => helper
                return h.response({up:true}).code(200)
            },
        })
    },
}
export default plugin