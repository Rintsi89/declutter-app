const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Removal = require('../models/removal')
const User = require('../models/user')
// For AWS S3
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

aws.config.update({
  secretAccessKey: process.env.BUCKET_ACCESSKEY,
  accessKeyId: process.env.BUCKET_KEYID,
  region: 'eu-north-1'
})

const s3 = new aws.S3()

const fileFilter = (req, file, callback) => {
  // accept a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    // reject a file
    callback(null, false)
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    key: function(req, file, callback) {
      callback(null, file.originalname)
    }
  }),
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter
})

router.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const removals = await Removal.find({ user: { $in: [decodedToken.id] } })
    response.status(200).json(removals)

  } catch (error) {
    next(error)
  }
})

router.post('/', upload.single('image'), async (request, response, next) => {

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

    await Removal.findByIdAndRemove(request.params.id)
    await User.findByIdAndUpdate(decodedToken.id, { $pull: { removals: request.params.id } })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router