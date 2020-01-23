const multer = require('multer')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

const checkAuth = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  if (!(decodedToken || user)) {
    return response.status(400).json({ error: 'Authentication failed' })
  }

  // eslint-disable-next-line require-atomic-updates
  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).json({ error: 'ID is not valid' })
  } else if (error.name === 'MongoError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid or missing token' })
  } else if (error instanceof multer.MulterError) {
    return response.status(400).json({ error: 'Problem during file upload. Check your file size and file type' })
  }
  next(error)
}

module.exports = {
  errorHandler,
  tokenExtractor,
  checkAuth
}