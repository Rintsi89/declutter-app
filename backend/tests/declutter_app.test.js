const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('User and login tests', () => {

  beforeAll(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.dataBaseUser)
  })

  describe('GET: /api/users', () => {

    let token = null
    let user = null
  
    test('users can be found', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
        expect(response.body.length).toBe(helper.dataBaseUser.length)
    })
  })
    describe('POST: /api/users', () => { 

      test('user can be created', async () => {
        await api
            .post('/api/users')
            .send(helper.initialUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        })
    
      test('user cannot be created with short password or username', async () => {
        await api
            .post('/api/users')
            .send(helper.wrongUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        })
    })

    describe('POST: /api/login', () => { 

      test('user can log in', async () => {
  
        const response = await api
          .post('/api/login')
          .send({
            "username": helper.initialUser.username,
            "password": helper.initialUser.password
          })
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
          token = response.body.token
          user = response.body.username
      })
    
      test('user cannot log in with invalid data', async () => {
    
        await api
          .post('/api/login/')
          .send({
            "username": helper.wrongUser.username,
            "password": helper.wrongUser.password
          })
          .expect(401)
          .expect('Content-Type', /application\/json/)
          
      })
    })
  
    describe('DELETE: /api/users', () => { 
      test('user can delete own account', async () => {
  
        const userToDelete = await User.find({ username: user })
    
        await api
          .delete(`/api/users/${userToDelete[0]._id}`)
          .set('Authorization', `bearer ${token}`)
          .send({
            "password": helper.initialUser.password
          })
          .expect(204)
      })
    
      test('user cannot delete other accounts', async () => {
    
        const userToDelete = await User.find({ username: helper.dataBaseUser[0].username })
    
        await api
          .delete(`/api/users/${userToDelete[0]._id}`)
          .set('Authorization', `bearer ${token}`)
          .send({
            "password": helper.initialUser.password
          })
          .expect(401)
      })
    })
  })
  
afterAll(() => {
  mongoose.connection.close()
})