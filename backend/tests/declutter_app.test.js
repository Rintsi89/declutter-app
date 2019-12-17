const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Removal = require('../models/removal')
const helper = require('./test_helper')

// Integration tests

describe('Declutter App test', () => {

  // Letiables for authentication routes are set to null in the beginning

  let id = null
  let token = null
  let user = null
  let userId = null

  // In the beginning database is cleared from users and removals, one initial user is inserted

  beforeAll(async () => {
    await User.deleteMany({})
    await Removal.deleteMany({})
    await User.insertMany(helper.dataBaseUser)
  })

  describe('GET: /api/users', () => {

    // This ensures that 1 user is in the database in the beginning of the tests

    test('users can be found', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(helper.dataBaseUser.length)
    })
  })

  describe('POST: /api/users - user id is set here', () => {

    // This ensures that new user can be inserted in to the database

    test('user can be created', async () => {
      await api
        .post('/api/users')
        .send(helper.initialUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const users = await User.find({})
      expect(users.length).toBe(helper.dataBaseUser.length + 1)
      const addedUser = await User.find({ name: helper.initialUser.name })
      userId = addedUser[0]._id
    })

    // This ensures that Mongoose validation works

    test('user cannot be created with short password or username', async () => {
      await api
        .post('/api/users')
        .send(helper.wrongUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('POST: /api/login - token and user are set here', () => {

    // This ensures that login works. Note: ! TOKEN and USER are set here and used in latter tests !

    test('user can log in', async () => {

      const response = await api
        .post('/api/login')
        .send({
          'username': helper.initialUser.username,
          'password': helper.initialUser.password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      token = response.body.token
      user = response.body.username
    })

    // This ensures that backend validation works

    test('user cannot log in with invalid data', async () => {
      await api
        .post('/api/login')
        .send({
          'username': helper.wrongUser.username,
          'password': helper.wrongUser.password
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })
  })

  describe('PATCH: /api/users', () => {

    // This ensures that user can update name and add location

    test('user can update name and add location', async () => {
      await api
        .patch(`/api/users/${userId}`)
        .send(helper.nameAndLocation)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedUser = await User.find({ name: helper.nameAndLocation.name })
      expect(updatedUser[0].locations).toEqual(expect.arrayContaining([helper.nameAndLocation.location]))
    })

    // This ensures that user can remove previously added location

    test('user can remove location', async () => {
      await api
        .patch(`/api/users/${userId}`)
        .send(helper.nameAndLocationPull)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedUser = await User.find({ name: helper.nameAndLocationPull.name })
      expect(updatedUser[0].locations).toEqual(expect.arrayContaining([]))
    })
  })

  describe('POST: /api/removals - removal id is set here', () => {

    // This ensures that removal can be created. Note: token is used here and ID for removal is set here!

    test('removal can be created', async () => {
      await api
        .post('/api/removals')
        .send(helper.removal)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const removals = await Removal.find({})
      id = removals[0]._id
      expect(removals.length).toBe(1)
    })
  })

  describe('GET: /api/removals', () => {

    // This ensures that removals of logged user are returned. Note: token is used here

    test('removals of user are returned', async () => {
      await api
        .get('/api/removals')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('DELETE: /api/removals', () => {

    // This ensures that user cannot delete removals with invalid token. Note: removal id is valid but token is not

    test('user cannot delete removals with invalid token', async () => {
      await api
        .delete(`/api/removals/${id}`)
        .set('Authorization', `bearer ${token} + 123 `)
        .expect(401)

      const removals = await Removal.find({})
      expect(removals.length).toBe(1)
    })

    // This ensures that user can delete own removals. Note: token and id are used here

    test('user can delete own removal', async () => {
      await api
        .delete(`/api/removals/${id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const removals = await Removal.find({})
      expect(removals.length).toBe(0)
    })
  })

  describe('DELETE: /api/users', () => {

    // This ensures that user cannot delete other users with own password and token. Note: token is used here

    test('user cannot delete other accounts', async () => {

      const userToDelete = await User.find({ username: helper.dataBaseUser[0].username })

      await api
        .delete(`/api/users/${userToDelete[0]._id}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          'password': helper.initialUser.password
        })
        .expect(401)
    })

    test('user can delete own account', async () => {

      // This ensures that user can delete own account with own password and token. Note: token and user used here

      const userToDelete = await User.find({ username: user })

      await api
        .delete(`/api/users/${userToDelete[0]._id}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          'password': helper.initialUser.password
        })
        .expect(204)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})