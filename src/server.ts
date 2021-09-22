import Hapi from '@hapi/hapi'
import { request } from 'http'
import plugin from './plugins/status'
import StatusPlugin  from './plugins/status'
import prismaPlugin  from './plugins/prisma'
import userPlugin from './plugins/users'
import usersPlugin from './plugins/users'
const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export async function createServer():Promise<Hapi.Server> {
  //defining the root before starting the server
  await server.register([StatusPlugin,prismaPlugin,usersPlugin])
  await server.initialize()
  return server
}

export async function startServer(): Promise<Hapi.Server> {
    
  
  await server.start() //starting the server
  console.log(`Server running on ${server.info.uri}`) //telling that we are running this server
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})


