const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const api = supertest(app)
const path = require('path')
const Removal = require('../../models/removal')
const User = require('../../models/user')
const helper = require('./test_helper')

let token
let authenticatedUser

describe('Removal tests - authenticated routes', () => {

    beforeEach(async () => {
        await User.deleteMany({ })
        await Removal.deleteMany({ })
        const user = await User.create(helper.initialUser)
        const removal = await Removal.create( { ...helper.initialRemoval, user: user.id })
        const updatedUser = await User.findByIdAndUpdate(user.id, { $push: { removals: removal.id } }, { new: true })
        console.log(user);
        console.log(removal);
        console.log(updatedUser);
        
        const response = await api
          .post('/api/login')
          .send({ username: helper.initialUser.username, password: helper.initialUser.password })
          .expect(200)
        
        token = response.body.token
        authenticatedUser = response.body
      })
      
      describe('Find all removals', () => {
          // Continue from here
        test('All removals can be found', async (done) => {
            expect(1).not.toBe(2)
            done()
        })
      })
})
      