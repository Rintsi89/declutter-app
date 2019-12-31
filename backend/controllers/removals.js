const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Removal = require('../models/removal')
const User = require('../models/user')
// For AWS S3
const S3 = require('../utils/s3-config')

router.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const removals = await Removal.find({ user: { $in: [decodedToken.id] } })
    response.status(200).json(removals)

  } catch (error) {
    next(error)
  }
})

router.post('/', S3.upload.single('image'), async (request, response, next) => {

  try {

    let imagelink = !request.file ? null : request.file.location
    const body = { ...request.body, image: imagelink }
    const removal = new Removal(body)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    removal.user = user._id
    await removal.save()

    user.removals = user.removals.concat(removal._id)
    await user.save()

    const addedRemovalWithUser = await Removal.findById(removal._id).populate('user')
    response.status(201).json(addedRemovalWithUser)

  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const toDelete = await User.find({ _id: decodedToken.id, removals: { $in: [request.params.id] } })

    if (toDelete.length < 1) {
      return response.status(401).json({
        error: 'Invalid removal id or user not authenticated'
      })
    }

    const deletedRemoval = await Removal.findByIdAndRemove(request.params.id)
    await User.findByIdAndUpdate(decodedToken.id, { $pull: { removals: deletedRemoval.id } })

    if (deletedRemoval.image) {
      const key = deletedRemoval.image.substring(deletedRemoval.image.lastIndexOf('/') + 1)
      S3.deleteImage(key)
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router