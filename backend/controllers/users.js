const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')
// For mailer
const Mailer = require('../utils/mailer')
// For AWS S3
const S3 = require('../utils/s3-config')

// This is not used in the application
router.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next()
  }
})

// Create user
router.post('/', async (request, response, next) => {

  try {
    const { username, password, email, locations } = request.body

    if (!password || password.length < 5) {
      return response.status(400).send({
        error: 'Password minimum length is 5'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      email,
      locations,
      passwordHash,
      image: 'https://declutter-images.s3.eu-north-1.amazonaws.com/No-image-found.jpg'
    })

    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    const emailToken = jwt.sign(userForToken, process.env.EMAILSECRET, { expiresIn: '1h' })
    const url = `${request.protocol}://${request.get('host')}/api/users/confirmation/${emailToken}`

    const mailerOptions = {
      email: savedUser.email,
      url: url,
      subject: 'Confirm your Declutter account',
      html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
    }

    Mailer.sendEmail(mailerOptions)

    response.status(200).send()

  } catch (error) {
    next(error)
  }
})

// Confirm user account via link in email
router.get('/confirmation/:token', async (request, response, next) => {
  try {

    const user = jwt.verify(request.params.token, process.env.EMAILSECRET)

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token'
      })
    }

    await User.findByIdAndUpdate(user.id, { $set: { confirmed: true } }, { new: true })
    response.status(200).redirect('/')

  } catch (error) {
    next(error)
  }
})

// Request for link to reset password
router.post('/forgotPassword', async (request, response, next) => {

  try {

    const { email } = request.body

    if (!email) {
      response.status(400).json({
        error: 'Email is needed!'
      })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      return response.status(404).json({
        error: 'Email not found'
      })
    }

    const token = crypto.randomBytes(20).toString('hex')
    await User.findByIdAndUpdate(user.id, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } } )

    const url = `${request.protocol}://${request.get('host')}/reset/${token}`

    const mailerOptions = {
      email: user.email,
      url: url,
      subject: 'Link to reset your password',
      html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
    + `<a href="${url}">${url}</a>`
    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    }

    Mailer.sendEmail(mailerOptions)
    response.status(200).json({ message: `Link to reset your password has been send to ${user.email}` })

  } catch (error) {
    next(error)
  }

})

// Verify token to change password
router.get('/reset/:token', async (request, response, next) => {
  try {

    const user = await User.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } })

    if (!user) {
      return response.status(404).json({
        error: 'User not found, authentication token might be expired'
      })
    }

    response.status(200).json(user)

  } catch (error) {
    next(error)
  }
})

// Reset password
router.put('/resetPassword', async (request, response, next) => {

  try {

    const { username, password, password2 } = request.body
    const user = await User.findOne({ username: username })
    const retypedCorrect = password !== password2 ? false : true

    if (!user) {
      return response.status(404).json({
        error: 'User not exists'
      })
    }

    if (!password || password.length < 5) {
      return response.status(400).send({
        error: 'Password minimum length is 5'
      })
    }

    if (!retypedCorrect) {
      return response.status(400).json({
        error: 'Retyped password did not match the first one'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    await User.findByIdAndUpdate(user.id, { $set: { passwordHash: passwordHash } }, { new: true })

    response.status(200).send()

  } catch (error) {
    next(error)
  }

})

// Edit personal details (username, name, email and description)
router.patch('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const updateObject = {
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      description: request.body.description,
    }

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    if (!updateObject) {
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
    let imagelink = !request.file ? 'https://declutter-images.s3.eu-north-1.amazonaws.com/No-image-found.jpg' : request.file.location

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

    const updatedUser = await User.findByIdAndUpdate(user.id, { $set: { image: 'https://declutter-images.s3.eu-north-1.amazonaws.com/No-image-found.jpg' } }, { new: true })
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

// Add sale location
router.patch('/:id/salelocations/add', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const saleLocation = request.body

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { saleLocations: saleLocation } }, { new: true })
    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Delete sale location
router.patch('/:id/salelocations/remove', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const saleLocation = request.body.saleLocation

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { 'saleLocations': { 'value':saleLocation  } } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Add category
router.patch('/:id/categories/add', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const category = request.body

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { categories: category } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

})

// Delete category
router.patch('/:id/categories/remove', async (request, response, next) => {

  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const category = request.body.category

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token or id'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { 'categories': { 'value': category  } } }, { new: true })

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

    if (!newPassword || newPassword.length < 5) {
      return response.status(400).send({
        error: 'Password minimum length is 5'
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

// Set user as inactive = delete
router.put('/:id/delete', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.params.id !== decodedToken.id ? null : await User.findById(decodedToken.id)
    const passwordCorrect = user === null ? false : await bcrypt.compare(request.body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid token, id or password'
      })
    }

    await User.findByIdAndUpdate(user.id, { $set: { active: false } })
    response.status(200).json({ message: 'Your account has been deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router