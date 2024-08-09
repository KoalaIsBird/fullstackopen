const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })
    response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
    if (request.body.title === undefined || request.body.url === undefined) {
        return response.status(400).json({ error: 'no title or url' })
    }

    if (request.token === null) {
        return response.status(401).json({ error: 'no token was provided' })
    }

    const userId = request.user.id
    if (userId === null) {
        return response.json(401).json({ error: 'non-valid token' })
    }

    const user = await User.findById(userId)

    const newBlog = {
        title: request.body.title,
        url: request.body.url,
        author: request.body.author,
        likes: request.body.likes === undefined ? 0 : request.body.likes,
        user: user.id
    }
    const blog = new Blog(newBlog)
    const postedBlog = await blog.save()

    user.blogs = user.blogs.concat(postedBlog.id)
    await user.save()

    response.status(201).json(postedBlog)
})


blogRouter.delete('/:id', async (request, response) => {
    if (request.token === null) {
        return response.status(401).json({ error: "no bearer token was given" })
    }

    const tokenUserId = request.user.id

    const requestBlog = await Blog.findById(request.params.id)
    if (requestBlog === null) {
        return response.status(404).json({ error: 'no blog has the given id' })
    }

    if (!(requestBlog.user.toString() === tokenUserId)) {
        return response.status(401).json({ error: 'you cannot delete a note you did not add' })
    }


    await Blog.findByIdAndDelete(requestBlog.id)
    let user = await User.findById(tokenUserId)

    await User
        .findByIdAndUpdate(
            tokenUserId,
            { blogs: user.blogs.filter(blogId => blogId.toString() !== requestBlog.id) },
            { runValidators: true, new: true }
        )

    response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
    newBlog = await Blog.findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
    response.json(newBlog)
})


module.exports = blogRouter