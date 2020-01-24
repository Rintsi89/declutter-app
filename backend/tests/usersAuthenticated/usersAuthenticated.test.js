const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const api = supertest(app)
const path = require('path')
const User = require('../../models/user')
const helper = require('./test_helper')

let token;
let authenticatedUser;

describe('User & login tests - authenticated routes', () => {

    beforeAll(async (done) => {
        await User.deleteMany({})
        await User.create(helper.initialUser)
        const response = await api
          .post('/api/login')
          .send({ username: helper.initialUser.username, password: helper.initialUser.password })
          .expect(200)
    
        token = response.body.token
        authenticatedUser = response.body
        done()
      })

    describe('Edit user details', () => {
      test('user cannot update details without token', async (done) => {

        const response = await api
        .patch(`/api/users/${authenticatedUser.id}`)
        .send(helper.editedDetails)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        expect(response.body.email).not.toBe(helper.editedDetails.email)
        expect(response.body.description).not.toBe(helper.editedDetails.description)
        expect(response.body.username).not.toBe(helper.editedDetails.username)
        expect(response.body.name).not.toBe(helper.editedDetails.name)

        done()
      })

      test('user cannot update details with invalid token', async (done) => {

        const response = await api
        .patch(`/api/users/${authenticatedUser.id}`)
        .send(helper.editedDetails)
        .set('Authorization', `bearer ${helper.invalidToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    
        expect(response.body.email).not.toBe(helper.editedDetails.email)
        expect(response.body.description).not.toBe(helper.editedDetails.description)
        expect(response.body.username).not.toBe(helper.editedDetails.username)
        expect(response.body.name).not.toBe(helper.editedDetails.name)

        done()
      })

      test('user cannot update details with empty details', async (done) => {

        await api
        .patch(`/api/users/${authenticatedUser.id}`)
        .send(helper.editedDetailsEmpty)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        done()
      })

      test('user can update details', async (done) => {

        const response = await api
        .patch(`/api/users/${authenticatedUser.id}`)
        .send(helper.editedDetails)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(response.body.email).toBe(helper.editedDetails.email)
        expect(response.body.description).toBe(helper.editedDetails.description)
        expect(response.body.username).toBe(helper.editedDetails.username)
        expect(response.body.name).toBe(helper.editedDetails.name)

        done()
      })
    })

    describe('Upload image', () => {
        test('user can upload image', async (done) => {
            await api
            .put(`/api/users/${authenticatedUser.id}/picture/add`)
            .attach('image', path.join(__dirname, 'test-image.jpg'))
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
            const user = await User.findOne({_id: authenticatedUser.id})
            expect(user.image.substring(user.image.lastIndexOf('/') + 3)).toBe('test-image.jpg')
        
            done()
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
  })