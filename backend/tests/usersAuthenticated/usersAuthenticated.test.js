const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const api = supertest(app)
const path = require('path')
const User = require('../../models/user')
const helper = require('./test_helper')

let token
let authenticatedUser

describe('User & login tests - authenticated routes', () => {

    beforeEach(async () => {
        await User.deleteMany({ })
        await User.create(helper.initialUser)
        const response = await api
          .post('/api/login')
          .send({ username: helper.initialUser.username, password: helper.initialUser.password })
          .expect(200)
        
        token = response.body.token
        authenticatedUser = response.body
      })
      
  // USER DETAIL TESTS

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

  // IMAGE TESTS

    describe('Upload image', () => {
        test('user cannot upload image without token', async (done) => {
          
          await api
          .patch(`/api/users/${authenticatedUser.id}/picture/add`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(401)
          .expect('Content-Type', /application\/json/)

          const user = await User.findOne({_id: authenticatedUser.id})
          expect(user.image).toBeFalsy()
      
          done()
      })

        test('user cannot upload image with invalid token', async (done) => {
            
          await api
          .patch(`/api/users/${authenticatedUser.id}/picture/add`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
          
          const user = await User.findOne({_id: authenticatedUser.id})
          expect(user.image).toBeFalsy()
      
          done()
      })

        test('user cannot upload empty image', async (done) => {
            
          await api
          .patch(`/api/users/${authenticatedUser.id}/picture/add`)
          .set('Authorization', `bearer ${token}`)
          .expect(400)
          .expect('Content-Type', /application\/json/)
          
          const user = await User.findOne({_id: authenticatedUser.id})
          expect(user.image).toBeFalsy()
      
          done()
      })

        test('user can upload image', async (done) => {
            await api
            .patch(`/api/users/${authenticatedUser.id}/picture/add`)
            .attach('image', path.join(__dirname, 'test-image.jpg'))
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
            const user = await User.findOne({_id: authenticatedUser.id})
            expect(user.image.substring(user.image.length - 14)).toBe('test-image.jpg')
        
            done()
        })
    })

    describe('Delete image', () => {

      beforeEach(async () => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/picture/add`)
        .attach('image', path.join(__dirname, 'test-image.jpg'))
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      })

      test('user cannot delete image without token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/picture/remove`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.image.substring(user.image.length - 14)).toBe('test-image.jpg')
    
        done()
      })

      test('user cannot delete image with invalid token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/picture/remove`)
        .set('Authorization', `bearer ${helper.invalidToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.image.substring(user.image.length - 14)).toBe('test-image.jpg')
    
        done()
      })

      test('user can delete image', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/picture/remove`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.image).toBeFalsy()
    
        done()
      })
    })

// LOCATION TESTS

    describe('Add location', () => {
      test('user cannot add location without token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/add`)
        .send(helper.location)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(1)

        done()
      })

      test('user cannot add location with invalid token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/add`)
        .set('Authorization', `bearer ${helper.invalidToken}`)
        .send(helper.location)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(1)

        done()
      })

      test('user cannot add empty location', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/add`)
        .set('Authorization', `bearer ${token}`)
        .send('')
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(1)

        done()
      })

      test('user can add location', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/add`)
        .set('Authorization', `bearer ${token}`)
        .send(helper.location)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(2)

        done()
      })
    })

    describe('Delete location', () => {
      test('user cannot delete location without token', async (done) => {

        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/remove`)
        .send(helper.defaultLocation)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(1)

        done()

      })

      test('user cannot delete location with invalid token', async (done) => {

        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/remove`)
        .set('Authorization', `bearer ${helper.invalidToken}`)
        .send(helper.defaultLocation)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(1)

        done()


      })
      test('user can delete location', async (done) => {

        await api
        .patch(`/api/users/${authenticatedUser.id}/locations/remove`)
        .set('Authorization', `bearer ${token}`)
        .send(helper.defaultLocation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.locations.length).toBe(0)

        done()

      })
    })

    // SALE LOCATION TESTS

    describe('Add sale location', () => {

      test('user cannot add sale location without token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/salelocations/add`)
        .send(helper.saleLocation)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.saleLocations.length).toBe(3)

        done()
    })

    test('user cannot add sale location with invalid token', async (done) => {
      await api
      .patch(`/api/users/${authenticatedUser.id}/salelocations/add`)
      .set('Authorization', `bearer ${helper.invalidToken}`)
      .send(helper.saleLocation)
      .expect(401)
      .expect('Content-Type', /application\/json/)

      const user = await User.findOne({_id: authenticatedUser.id})
      expect(user.saleLocations.length).toBe(3)

      done()
    })

    test('user cannot add empty sale location', async (done) => {
      await api
      .patch(`/api/users/${authenticatedUser.id}/salelocations/add`)
      .set('Authorization', `bearer ${token}`)
      .send('')
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const user = await User.findOne({_id: authenticatedUser.id})
      expect(user.saleLocations.length).toBe(3)

      done()
    })

    test('user can add sale location', async (done) => {
      await api
      .patch(`/api/users/${authenticatedUser.id}/salelocations/add`)
      .set('Authorization', `bearer ${token}`)
      .send(helper.saleLocation)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const user = await User.findOne({_id: authenticatedUser.id})
      expect(user.saleLocations.length).toBe(4)

      done()
    })
  })

    describe('Delete sale location', () => { 

      test('user cannot delete sale location without token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/salelocations/remove`)
        .send(helper.defaultSaleLocation)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.saleLocations.length).toBe(3)

        done()
    })

      test('user cannot delete sale location with invalid token', async (done) => {
        await api
        .patch(`/api/users/${authenticatedUser.id}/salelocations/remove`)
        .set('Authorization', `bearer ${helper.invalidToken}`)
        .send(helper.defaultSaleLocation)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.saleLocations.length).toBe(3)

        done()
    })

      test('user can delete sale location', async (done) => {

        await api
        .patch(`/api/users/${authenticatedUser.id}/salelocations/remove`)
        .set('Authorization', `bearer ${token}`)
        .send(helper.defaultSaleLocation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const user = await User.findOne({_id: authenticatedUser.id})
        expect(user.saleLocations.length).toBe(2)

        done()

      })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
