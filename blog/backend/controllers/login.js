const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const attemptedUser = await User.findOne({ username: username })
    const passwordCorrect = attemptedUser === null
        ? false
        : await bcrypt.compare(password, attemptedUser.passwordHash)

    if (!passwordCorrect) {
        return response.status(401).json({ error: 'username or password is incorrect' })
    }

    const userForToken = {
        username: attemptedUser.username,
        id: attemptedUser.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .json({
            username: attemptedUser.username,
            name: attemptedUser.name,
            token: token
        })
})

module.exports = loginRouter