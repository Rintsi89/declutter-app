const mongoose = require('mongoose')
const moment = require('moment')
const date = moment()

const removalSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  length: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  heigth: { type: Number, default: 0 },
  cbm: { type: Number, default: 0 },
  weigth: { type: Number, default: 0 },
  totalWeigth: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  soldAt: String,
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