import {createServer} from '../src/server'
import Hapi from '@hapi/hapi'
describe ('Status plugin',() => {
    let server:Hapi.Server
    beforeAll(async () => {
        server=await createServer()

    })
    afterAll(async () => {
        await server.stop()
    })
    
    test(`status endpoint works`, async () => {
        const response=await server.inject({
            url:'/',
            method:'GET',
        })
        expect(response.statusCode).toEqual(200)
        const payload=JSON.parse(response.payload)
        expect(payload.up).toEqual(true)
    })
})





