const mongoose = require('mongoose')
const moment = require('moment')
const date = moment()

const removalSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  cbm: Number,
  weigth: { type: Number, default: 0 },
  value: Number,
  location: String,
  note: String,
  image: String,
  date: { type: String, default: date.format('DD.MM.YYYY') },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

removalSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Removal = mongoose.model('Removal', removalSchema)

module.exports = Removal