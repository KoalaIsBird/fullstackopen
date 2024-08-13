const bcrpyt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async (request, response) => {
    if (request.body.password.length < 3) {
        return response.status(401).json({ error: 'password must be at least 3 characters long' })
    }

    const newUser = new User({
        username: request.body.username,
        name: request.body.name,
        passwordHash: await bcrpyt.hash(request.body.password, 10)
    })

    const addedUser = await newUser.save()
    response.json(addedUser)
})


usersRouter.get('/', async (request, response) => {
    response.json(await User.find({}).populate('blogs', { user: 0 }))
})

module.exports = usersRouter