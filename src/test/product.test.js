import supertest from "supertest";
import {app, server} from "../index.js"

const api = supertest(app)

test('products are returned as json', async () => {
    await api
    .get('/api/products')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    server.close()
})