const { test, beforeEach, after } = require('node:test')

const Blog = require('../models/blog')
const User = require('../models/user')

const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')

const api = supertest(app)

let koalaToken, andrewToken

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await Blog.bulkSave(helper.initialBlogs.map(blog => new Blog(blog)))
    await User.bulkSave(helper.initialUsers.map(user => new User(user)))

    koalaToken = (await api.post('/api/login').send({ username: "koala", password: "12345" })).body.token
    andrewToken = (await api.post('/api/login').send({ username: "andrew", password: "12345" })).body.token
})



test('correct amount of blog posts', async () => {
    const response = await api
        .get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


test('valid blog can be posted', async () => {
    const newBlog = {
        title: 'My cool blog post',
        url: 'example.com/johndoearticle',
        author: 'koalabird',
        likes: 12

    }

    const returnedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${koalaToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // there is one more blog than before
    assert.strictEqual((await Blog.find({})).length, helper.initialBlogs.length + 1)

    // the created blog has the title sent in the request
    const foundBlog = await Blog.findById({ _id: returnedBlog.body.id })
    assert.deepStrictEqual(foundBlog.title, returnedBlog.body.title)
})

test('blogs have the id property', async () => {
    const newBlog = {
        title: 'My cool blog post',
        url: 'example.com/johndoearticle',
        author: 'John Doe',
        likes: 12
    }

    const returnedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${andrewToken}`)
        .send(newBlog)

    assert(returnedBlog.body.id !== undefined)
})

test('if likes property is missing, a 0 is put in as its value', async () => {
    const newBlog = {
        title: 'My cool blog post',
        url: 'example.com/johndoearticle',
        author: 'John Doe'
    }

    const returnedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${koalaToken}`)
        .send(newBlog)

    assert.strictEqual(returnedBlog.body.likes, 0)
})

test('backend answers with status 400 if title or url are missing', async () => {
    const newBlog1 = {
        //title: 'My cool blog post',
        url: 'example.com/johndoearticle',
        author: 'John Doe',
        likes: 30
    }

    const newBlog2 = {
        title: 'My cool blog post',
        //url: 'example.com/johndoearticle',
        author: 'John Doe',
        likes: 30
    }

    const newBlog3 = {
        //title: 'My cool blog post',
        //url: 'example.com/johndoearticle',
        author: 'John Doe',
        likes: 30
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${koalaToken}`).send(newBlog1).expect(400)
    await api.post('/api/blogs').set('Authorization', `Bearer ${andrewToken}`).send(newBlog2).expect(400)
    await api.post('/api/blogs').set('Authorization', `Bearer ${koalaToken}`).send(newBlog3).expect(400)
})

test('blog gets deleted', async () => {
    const aBlog = await Blog.findOne({ author: "andrew" })

    await api.delete(`/api/blogs/${aBlog.id}`).set('Authorization', `Bearer ${andrewToken}`).expect(204)

    assert((await Blog.findById(aBlog.id) === null))
})


test('blog gets changed', async () => {
    const aBlog = await Blog.findOne({})
    aBlog.url = 'this url was changed'

    newBlog = await api.put(`/api/blogs/${aBlog.id}`).send(aBlog)

    assert.strictEqual(newBlog.body.url, 'this url was changed')
    assert.strictEqual((await Blog.findOne({ _id: aBlog.id })).url, 'this url was changed')
})


test('creating a blog without a token fails', async () => {
    const newBlog = {
        title: 'My cool blog post',
        url: 'example.com/johndoearticle',
        author: 'koalabird',
        likes: 12

    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})




after(async () => {
    await mongoose.connection.close()
})