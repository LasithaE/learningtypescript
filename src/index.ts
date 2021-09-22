import {createServer,startServer} from './server'

createServer().then(startServer).catch(error=>{
    console.log(console.error)
}

)