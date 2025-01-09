const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)



beforeEach(async () => {
    await User.deleteMany({})

    const testUser = {
        username: "koalaisbird",
        name: "Andrew",
        password: '12345'
    }

    await api
        .post('/api/users')
        .send(testUser)
})

test('too short name', async () => {
    const response = await api
        .post('/api/users')
        .send({
            username: "ko",
            name: "Hello",
            password: "world"
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('shorter than the minimum allowed length'))
})

test('too short password', async () => {
    const response = await api
        .post('/api/users')
        .send({
            username: "koala",
            name: "Hello",
            password: "12"
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('password must be at least 3 characters'))
})

test('username already in use', async () => {
    const response = await api
        .post('/api/users')
        .send({
            username: "koalaisbird",
            name: "Hello",
            password: "1234"
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('username already exists'))
})

after(() => {
    mongoose.connection.close()
})