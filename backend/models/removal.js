const mongoose = require('mongoose')

const removalSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: String,
  saleItem: Boolean,
  length: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  cbm: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  soldAt: String,
  location: String,
  note: String,
  image: String,
  removed: Boolean,
  date: String,
  dateRemoved: String,
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