const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    logger.info(error.message)

    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error collection')) {
        return response.status(401).json({ error: 'username already exists' })
    } else if (error.name === 'ValidationError') {
        return response.status(401).json({ error: error.message })
    }

    next(error)
}

const getToken = (request, response, next) => {
    const authorization = request.get('authorization')
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.replace('Bearer ', '')
        : null

    request.token = token
    next()
}

const getUser = async (request, response, next) => {
    request.user = request.token === null
        ? null
        : jwt.verify(request.token, process.env.SECRET)

    next()
}

module.exports = { errorHandler, getToken, getUser }