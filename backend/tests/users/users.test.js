const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const api = supertest(app)
const User = require('../../models/user')
const helper = require('./test_helper')
// User and login related tests are done here

describe('User & login tests - not authenticated routes', () => {
    
    // In the beginning database is cleared from users

    beforeAll(async () => {
      await User.deleteMany({})
    })

    describe('User creation -> confirmation -> login', () => {

        let confirmationToken = null

    test('user cannot be created with short password or username', async (done) => {
        await api
            .post('/api/users')
            .send(helper.wrongUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            done()
        })

      test('user can be created', async (done) => {
        const response = await api
            .post('/api/users')
            .send(helper.initialUser)
            .expect(200)

            const users = await User.find({})
            const user = users[0]
            
            expect(users.length).toBe(1)
            expect(user.username).toBe(helper.initialUser.username)
            expect(user.confirmed).toBeFalsy()

            confirmationToken = response.body.emailToken
            done()
      })

      test('user cannot confirm account with invalid token', async (done) => {
        await api
          .get(`/api/users/confirmation/${helper.invalidToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

          done()
      })

      test('user cannot log in before confirmation', async (done) => {
          
        await api
            .post('/api/login')
            .send({ username: helper.initialUser.username, password: helper.initialUser.password })
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
            done()
      })

      test('user can confirm account with valid token', async (done) => {
        await api
          .get(`/api/users/confirmation/${confirmationToken}`)
          .expect(302)
          
          const user = await User.findOne({ username: helper.initialUser.username })
          expect(user.confirmed).toBeTruthy()

          done()
      })

      test('user can log in after confirmation', async (done) => {
        const response = await api
          .post('/api/login')
          .send({ username: helper.initialUser.username, password: helper.initialUser.password })
          .expect(200)
          .expect('Content-Type', /application\/json/)

          expect(response.body.username).toBe(helper.initialUser.username)
          expect(response.body.token).toBeTruthy()
        
          done()
        })

    test('user cannot log in with invalid credentials', async (done) => {
        const response = await api
         .post('/api/login')
         .send({ username: helper.notExistingUser.username, password: helper.notExistingUser.password })
         .expect(401)
         .expect('Content-Type', /application\/json/)

         expect(response.body.token).toBeFalsy()
        
        done()
    })  
    })

    describe('Password reset and reset confirmation', () => {

        let passwordToken = null
        let userName = null

      test('user cannot order reset password token with invalid email', async (done) => {
        await api
          .post('/api/users/forgotPassword')
          .send({ email: helper.invalidEmail })
          .expect(404)
          .expect('Content-Type', /application\/json/)

          done()
      })  

      test('user can order reset password token', async (done) => {
        const response = await api
          .post('/api/users/forgotPassword')
          .send({ email: helper.initialUser.email })
          .expect(200)
          .expect('Content-Type', /application\/json/)

          passwordToken = response.body.token

          done()
      })

      test('user cannot reset password with invalid token', async (done) => {
        await api
          .get(`/api/users/reset/${helper.invalidToken}`)
          .expect(404)
          .expect('Content-Type', /application\/json/)

          done()
      })

      test('user can access reset password route with valid token', async (done) => {
        const response = await api
          .get(`/api/users/reset/${passwordToken}`)
          .expect(200)

          expect(response.body.username).toBe(helper.initialUser.username)
          userName = response.body.username
          done()
      })

      test('user can reset password', async (done) => {
          const userFirst = await User.findOne({ username: userName })
        
        await api
          .put('/api/users/resetPassword')
          .send({ username: userName, password: helper.newPassword.password , password2: helper.newPassword.password2 })
          .expect(200)

          const userAfter = await User.findOne({ username: userName })
          expect(userFirst.passwordHash).not.toBe(userAfter.passwordHash)

          done()
      })
    })
})

  afterAll(() => {
    mongoose.connection.close()
  })