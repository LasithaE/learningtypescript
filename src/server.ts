import Hapi from '@hapi/hapi'
import { request } from 'http'
import plugin from './plugins/status'
import StatusPlugin  from './plugins/status'
import prismaPlugin  from './plugins/prisma'
import userPlugin from './plugins/users'
const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})


export async function start(): Promise<Hapi.Server> {
    
    await server.register([ StatusPlugin,prismaPlugin,userPlugin])
    //defina a status endpoint just to know if server is working => gone to the status.ts

    //defining root before starting server
  await server.start() //starting the server
  console.log(`Server running on ${server.info.uri}`) //telling that we are running this server
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})


start()
  .catch((err) => {
    console.log(err)
  })
export default plugin
