const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const api = supertest(app)
const path = require('path')
const Removal = require('../../models/removal')
const User = require('../../models/user')
const helper = require('./test_helper')

let token
let removalId

describe('Removal tests - authenticated routes', () => {

    beforeEach(async () => {
        await User.deleteMany({ })
        await Removal.deleteMany({ })
        const user = await User.create(helper.initialUser)
        const removal = await Removal.create( { ...helper.initialRemoval, user: user.id })
        await User.findByIdAndUpdate(user.id, { $push: { removals: removal.id } }, { new: true })
        
        const response = await api
          .post('/api/login')
          .send({ username: helper.initialUser.username, password: helper.initialUser.password })
          .expect(200)
        
        token = response.body.token
        removalId = removal.id
      })
      
      // ALL REMOVALS TESTS

      describe('Find all removals', () => {
  
        test('removals are not returned without token', async (done) => {

        await api
          .get('/api/removals/')
          .expect(401)
          .expect('Content-Type', /application\/json/)

          done()

        })
  
        test('removals are not returned with invalid token', async (done) => {

        await api
          .get('/api/removals/')
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

          done()

        })

        test('removals are returned', async (done) => {

          const response = await api
          .get('/api/removals/')
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

          expect(response.body.length).toBe(1)
          expect(response.body[0].name).toBe(helper.initialRemoval.name)
          done()

        })
      })


      // CREATE REMOVAL TESTS

      describe('Create removal', () => {

        test('removal cannot be created without token', async (done) => {

        await api
          .post('/api/removals/')
          .type('form')
          .field('name', helper.newRemoval.name)
          .field('quantity', helper.newRemoval.quantity)
          .field('category', helper.newRemoval.category)
          .field('saleItem', helper.newRemoval.saleItem)
          .field('value', helper.newRemoval.value)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals.length).toBe(1)
        done()

        })

        test('removal cannot be created with invalid token', async (done) => {

        await api
          .post('/api/removals/')
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .type('form')
          .field('name', helper.newRemoval.name)
          .field('quantity', helper.newRemoval.quantity)
          .field('category', helper.newRemoval.category)
          .field('saleItem', helper.newRemoval.saleItem)
          .field('value', helper.newRemoval.value)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals.length).toBe(1)
        done()

        })

        test('empty removal cannot be created', async (done) => {

        await api
          .post('/api/removals/')
          .set('Authorization', `bearer ${token}`)
          .send('')
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals.length).toBe(1)
        done()

        })

        test('removal can be created', async (done) => {

        await api
          .post('/api/removals/')
          .set('Authorization', `bearer ${token}`)
          .type('form')
          .field('name', helper.newRemoval.name)
          .field('quantity', helper.newRemoval.quantity)
          .field('category', helper.newRemoval.category)
          .field('saleItem', helper.newRemoval.saleItem)
          .field('removed', helper.newRemoval.removed)
          .field('value', helper.newRemoval.value)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals.length).toBe(2)
        done()

        })
      })

      // EDIT REMOVAL TESTS

      describe('Edit removal details', () => {

        test('removal cannot be edited without token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}`)
          .send(helper.updateRemoval)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals[0].name).toBe(helper.initialRemoval.name)
        done()

        })

        test('removal cannot be edited with invalid token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}`)
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .send(helper.updateRemoval)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals[0].name).toBe(helper.initialRemoval.name)
        done()

        })

        test('removal cannot be edited with empty data', async (done) => {
          await api
          .patch(`/api/removals/${removalId}`)
          .set('Authorization', `bearer ${token}`)
          .send(helper.updateEmptyRemoval)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals[0].name).toBe(helper.initialRemoval.name)
        done()

        })

        test('removal can be edited', async (done) => {
          await api
          .patch(`/api/removals/${removalId}`)
          .set('Authorization', `bearer ${token}`)
          .send(helper.updateRemoval)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const removals = await Removal.find({ })
        expect(removals[0].name).toBe(helper.updateRemoval.name)
        done()

        })
      })

      // UPLOAD IMAGE TESTS

      describe('Upload removal image', () => {

        test('removal image cannot be uploaded without token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/add`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(401)
          .expect('Content-Type', /application\/json/)

          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image).toBeFalsy()
          done()

        })

        test('removal image cannot be uploaded with invalid token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/add`)
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(401)
          .expect('Content-Type', /application\/json/)

          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image).toBeFalsy()
          done()

        })

        test('empty removal image cannot be uploaded', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/add`)
          .set('Authorization', `bearer ${token}`)
          .expect(400)
          .expect('Content-Type', /application\/json/)

          done()

        })

        test('removal image can be uploaded', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/add`)
          .set('Authorization', `bearer ${token}`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(200)
          .expect('Content-Type', /application\/json/)

          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image.substring(removal.image.length - 14)).toBe('test-image.jpg')

          done()

        })
      })

      // DELETE IMAGE TESTS

      describe('Delete removal image', () => {

        beforeEach(async () => {
          await api
          .patch(`/api/removals/${removalId}/picture/add`)
          .set('Authorization', `bearer ${token}`)
          .attach('image', path.join(__dirname, 'test-image.jpg'))
          .expect(200)
          .expect('Content-Type', /application\/json/)
        })

        test('removal image cannot be deleted without token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/remove`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image.substring(removal.image.length - 14)).toBe('test-image.jpg')
      
          done()
        })

        test('removal image cannot be deleted with invalid token', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/remove`)
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image.substring(removal.image.length - 14)).toBe('test-image.jpg')
      
          done()
        })

        test('removal image can be deleted', async (done) => {
          await api
          .patch(`/api/removals/${removalId}/picture/remove`)
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.image).toBeFalsy()
      
          done()
        })
      })

      // DELETE REMOVAL TESTS

      describe('Delete removal', () => {

        test('removal cannot be deleted without token', async (done) => {

          await api
          .delete(`/api/removals/${removalId}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.name).toBe(helper.initialRemoval.name)
      
          done()
        })

        test('removal cannot be deleted with invalid token', async (done) => {

          await api
          .delete(`/api/removals/${removalId}`)
          .set('Authorization', `bearer ${helper.invalidToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal.name).toBe(helper.initialRemoval.name)
      
          done()
        })

        test('removal cann be deleted', async (done) => {

          await api
          .delete(`/api/removals/${removalId}`)
          .set('Authorization', `bearer ${token}`)
          .expect(204)
  
          const removal = await Removal.findOne({ _id: removalId })
          expect(removal).toBeFalsy()
      
          done()
        })
      })
})

afterAll(() => {
  mongoose.connection.close()
})
