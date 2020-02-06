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

const secondUser = {
  confirmed: true,
  active: true,
  username: 'testUser-2',
  password: 'salasana',
  passwordHash: '$2b$10$reU/XL.nd9Gf210ycVd4tO/omuRJXa.ZpAkAJF9bZdX1yxXQn4fr.', // This is 'salasana'
  email: 'testUser-2@testUser.com'
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

const initSecondUser = async (request, response, next) => {

  try {
    const user = await User.create(secondUser)
    response.status(201).json(user)
  } catch (error) {
    next(error)
  }

}

const initRemovals = async (request, response, next) => {

  const removalToCreate = { ...request.body, user: request.user.id }

  try {
    const removal = await Removal.create(removalToCreate)
    const user = await User.findById(request.user.id)
    user.removals = user.removals.concat(removal.id)
    await user.save()
    response.status(201).json(removal)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  reset,
  initUser,
  initSecondUser,
  initRemovals
}