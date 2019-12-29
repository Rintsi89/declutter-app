const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next()
  }
})

router.post('/', async (request, response, next) => {
  try {
    const { username, password, name, locations } = request.body

    if (!password || password.length < 3) {
      return response.status(400).send({
        error: 'password minimum length is 3'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      locations,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

// Edit personal details (username, name and description)
router.patch('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const updateObject = {
      username: request.body.username,
      name: request.body.name,
      description: request.body.description
    }

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    } else if (!updateObject) {
      return response.status(400).json({
        error: 'Update arguments are required'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateObject, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

router.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const passwordCorrect = user === null ? false : await bcrypt.compare(request.body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid token or password'
      })
    }
    await User.findByIdAndDelete(user.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router