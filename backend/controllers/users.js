const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')
const Mailer = require('../utils/mailer')
const S3 = require('../utils/s3-config')

const create = async (request, response, next) => {

  try {
    const { username, password, password2, email } = request.body

    const retypedCorrect = password !== password2 ? false : true

    if(!retypedCorrect) {
      return response.status(400).send({
        error: 'Password was retyped incorrectly'
      })
    }

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
      passwordHash
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
      html: `Please click this email to confirm your email and user account: <a href="${url}">${url}</a>`
    }

    await Mailer.sendEmail(mailerOptions)

    // This is controversial approach for test!
    if (process.env.NODE_ENV === 'test') {
      return response.status(200).json({
        emailToken
      })
    }
    response.status(200).send()

  } catch (error) {
    next(error)
  }
}

const confirm = async (request, response, next) => {

  try {

    const user = jwt.verify(request.params.token, process.env.EMAILSECRET)

    if (!user) {
      return response.status(401).json({
        error: 'Invalid token'
      })
    }

    await User.findByIdAndUpdate(user.id, { $set: { confirmed: true } }, { new: true })
    response.redirect('/')

  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (request, response, next) => {

  try {

    const { email } = request.body

    if (!email) {
      response.status(400).json({
        error: 'Email is required!'
      })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      return response.status(404).json({
        error: 'No user found related to this email address'
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

    await Mailer.sendEmail(mailerOptions)

    // This is controversial approach for test!
    if (process.env.NODE_ENV === 'test') {
      return response.status(200).json({
        token,
        message: `Link to reset your password has been send to ${user.email}`
      })
    }
    response.status(200).json({ message: `Link to reset your password has been send to ${user.email}` })

  } catch (error) {
    next(error)
  }

}

const verifyPasswordToken = async (request, response, next) => {

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
}

const resetPassword = async (request, response, next) => {

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

}

const changePassword = async (request, response, next) => {

  try {

    const { password, newPassword, newPassword2 } = request.body
    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const retypedCorrect = newPassword !== newPassword2 ? false : true
    const passwordCorrect = !user ? false : await bcrypt.compare(password, user.passwordHash)

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

    if(!retypedCorrect) {
      return response.status(400).send({
        error: 'New password was retyped incorrectly'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)
    const updatedUser = await User.findByIdAndUpdate(user.id, { $set: { passwordHash: passwordHash } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const edit = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    if (!(request.body.username && request.body.email)) {
      return response.status(400).json({
        error: 'Username and email is required'
      })
    }

    const updateObject = {
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      description: request.body.description,
    }

    if (!updateObject) {
      return response.status(400).json({
        error: 'Update arguments are required'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateObject, { new: true } )

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const addPicture = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const imagelink = !request.file ? null : request.file.location

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    } else if (!imagelink) {
      return response.status(400).json({
        error: 'Image is required!'
      })
    }

    const updateObject = {
      image: imagelink,
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateObject, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const deletePicture = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    const key = user.image.substring(user.image.lastIndexOf('/') + 1)
    const updatedUser = await User.findByIdAndUpdate(user.id, { $set: { image: null } }, { new: true })
    await S3.deleteImage(key)

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const addLocation = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const location = request.body.location

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    if (!location) {
      return response.status(400).json({
        error: 'Location cannot be empty'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { locations: location } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const deleteLocation = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const location = request.body.location

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { locations: location } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const addSaleLocation = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const saleLocation = request.body

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    if (!saleLocation.value) {
      return response.status(400).json({
        error: 'Sale location cannot be empty'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { saleLocations: saleLocation } }, { new: true })
    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const deleteSaleLocation = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const saleLocation = request.body.saleLocation

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { 'saleLocations': { 'value':saleLocation  } } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const addCategory = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const category = request.body

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    if (!category.value) {
      return response.status(400).json({
        error: 'Category cannot be empty'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $addToSet: { categories: category } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const deleteCategory = async (request, response, next) => {

  try {

    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
    const category = request.body.category

    if (!user) {
      return response.status(401).json({
        error: 'Request id and user do not match'
      })
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, { $pull: { 'categories': { 'value': category  } } }, { new: true })

    response.status(200).json(updatedUser)

  } catch (error) {
    next(error)
  }

}

const deleteAccount = async (request, response, next) => {

  try {
    const user = request.params.id !== request.user.id ? null : await User.findById(request.user.id)
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
}

module.exports = {
  create,
  confirm,
  forgotPassword,
  verifyPasswordToken,
  resetPassword,
  changePassword,
  edit,
  addPicture,
  deletePicture,
  addLocation,
  deleteLocation,
  addSaleLocation,
  deleteSaleLocation,
  addCategory,
  deleteCategory,
  deleteAccount
}