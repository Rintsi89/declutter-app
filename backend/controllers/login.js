const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = await User.findOne({ username: body.username, active: true })
    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid username or password'
      })
    } else if (!user.confirmed) {
      return response.status(401).json({
        error: 'User account is not confirmed, please confirm your account'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({
      token,
      username: user.username,
      name: user.name,
      locations: user.locations,
      image: user.image,
      categories: user.categories,
      description: user.description,
      id: user.id,
      saleLocations: user.saleLocations
    })

  } catch (error) {
    next(error)
  }
})

module.exports = router