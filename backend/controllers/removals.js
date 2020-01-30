const Removal = require('../models/removal')
const User = require('../models/user')
const S3 = require('../utils/s3-config')

const getAll = async (request, response, next) => {

  try {
    const removals = await Removal.find({ user: { $in: [request.user.id] } })
    response.status(200).json(removals)

  } catch (error) {
    next(error)
  }
}

const create = async (request, response, next) => {

  try {

    const imagelink = !request.file ? null : request.file.location
    const body = { ...request.body, image: imagelink }
    const removal = new Removal(body)
    const user = await User.findById(request.user.id)

    removal.user = user.id
    await removal.save()

    user.removals = user.removals.concat(removal.id)
    await user.save()

    const createdRemoval = await Removal.findById(removal._id).populate('user')

    response.status(201).json(createdRemoval)

  } catch (error) {
    next(error)
  }
}

const edit = async (request, response, next) => {

  try {

    const removalToUpdate = await Removal.findOne({ _id: request.params.id })
    const updateObject = request.body

    if (!removalToUpdate)
      return response.status(404).json({
        error: 'Removal does not exists'
      })

    // runValidators uses mongoose model validators (minlength etc). This option is off by default
    const updatedRemoval = await Removal.findByIdAndUpdate(removalToUpdate.id, updateObject, { new: true, runValidators: true })

    response.status(200).json(updatedRemoval)

  } catch (error) {
    next(error)
  }

}

const addPicture = async (request, response, next) => {

  try {

    const imagelink = !request.file ? null : request.file.location

    if (!imagelink) {
      return response.status(400).json({
        error: 'Image is required!'
      })
    }

    const updateObject = {
      image: imagelink,
    }

    const removalToUpdate = await Removal.findOne({ _id: request.params.id })

    if (!removalToUpdate)
      return response.status(404).json({
        error: 'Removal does not exists'
      })

    const updatedRemoval = await Removal.findByIdAndUpdate(removalToUpdate.id, updateObject, { new: true })

    response.status(200).json(updatedRemoval)

  } catch (error) {
    next(error)
  }

}

const deletePicture = async (request, response, next) => {

  try {

    const removalToUpdate = await Removal.findOne({ _id: request.params.id })
    const imageExists = !removalToUpdate || !removalToUpdate.image ? false : true

    if (!imageExists)
      return response.status(404).json({
        error: 'Removal or image does not exists'
      })

    const key = removalToUpdate.image.substring(removalToUpdate.image.lastIndexOf('/') + 1)
    const updatedRemoval = await Removal.findByIdAndUpdate(removalToUpdate.id, { $set: { image: null } }, { new: true })

    await S3.deleteImage(key)

    response.status(200).json(updatedRemoval)

  } catch (error) {
    next(error)
  }

}

const deleteRemoval = async (request, response, next) => {

  try {

    const toDelete = await User.find({ _id: request.user.id, removals: { $in: [request.params.id] } })

    if (toDelete.length < 1) {
      return response.status(401).json({
        error: 'Invalid removal id or user not authenticated to delete'
      })
    }

    const deletedRemoval = await Removal.findByIdAndRemove(request.params.id)
    await User.findByIdAndUpdate(request.user.id, { $pull: { removals: deletedRemoval.id } })

    if (deletedRemoval.image) {
      const key = deletedRemoval.image.substring(deletedRemoval.image.lastIndexOf('/') + 1)
      await S3.deleteImage(key)
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  create,
  edit,
  addPicture,
  deletePicture,
  deleteRemoval
}