const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')
// For AWS S3
const S3 = require('../utils/s3-config')

router.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next()
  }
})

router.post('/', async (request, response, next) => {
  try {
    const { username, password, name, locations } = request.body

    if (!password || password.length < 3) {
      return response.status(400).send({
        error: 'password minimum length is 3'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      locations,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

// Edit personal details (username, name and description)
router.patch('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const updateObject = {
      username: request.body.username,
      name: request.body.name,
      description: request.body.description
    }

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    } else if (!updateObject) {
      return response.status(400).json({
        error: 'Update arguments are required'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateObject, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Edit profile picture
router.put('/:id/picture/add', S3.upload.single('image'), async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    let imagelink = !request.file ? null : request.file.location

    const updateObject = {
      image: imagelink,
    }

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    } else if (!imagelink) {
      return response.status(400).json({
        error: 'Image is required!'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateObject, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Delete profile picture
router.delete('/:id/picture/remove', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const key = user.image.substring(user.image.lastIndexOf('/') + 1)

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $set: { image: null } }, { new: true })
    S3.deleteImage(key)

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Add location
router.patch('/:id/locations/add', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const location = request.body.location

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { locations: location } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Delete location
router.patch('/:id/locations/remove', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const location = request.body.location
 
    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { locations: location } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Change password
router.put('/:id/password', async (request, response, next) => {

  try {

    const { password, newPassword, newPassword2 } = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const retypedCorrect = newPassword !== newPassword2 ? false : true
    const passwordCorrect = (!user || !retypedCorrect) ? false : await bcrypt.compare(password, user.passwordHash)
 
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid token, id or password'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    const updatedUser = await User.findByIdAndUpdate(user.id, { $set: { passwordHash: passwordHash } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

router.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const passwordCorrect = user === null ? false : await bcrypt.compare(request.body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid token or password'
      })
    }
    await User.findByIdAndDelete(user.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router