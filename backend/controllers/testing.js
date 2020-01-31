const Removal = require('../models/removal')
const User = require('../models/user')

const initialUser = {
  confirmed: true,
  active: true,
  username: 'testUser',
  password: 'salasana',
  passwordHash: '$2b$10$reU/XL.nd9Gf210ycVd4tO/omuRJXa.ZpAkAJF9bZdX1yxXQn4fr.', // This is 'salasana'
  email: 'testUser@testUser.com'
}

const reset = async (request, response, next) => {

  try {
    await Removal.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
  } catch (error) {
    next(error)
  }

}

const initUser = async (request, response, next) => {

  try {
    await User.create(initialUser)
    response.status(201).end()
  } catch (error) {
    next(error)
  }

}

module.exports = {
  reset,
  initUser
}