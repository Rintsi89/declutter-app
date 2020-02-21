const mongoose = require('mongoose')

const removalSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  removed: { type: Boolean, required: true },
  saleItem: { type: Boolean, required: true, default: true },
  value: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  length: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  cbm: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  soldAt: String,
  location: String,
  note: String,
  image: String,
  date: String,
  dateRemoved: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

mongoose.Schema.Types.Boolean.convertToFalse.add('')
removalSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

removalSchema.pre('save', (next) => {
  if (!this.weight)
    this.weight = 0
  if (!this.length)
    this.length = 0
  if (!this.width)
    this.width = 0
  if (!this.height)
    this.height = 0
  if (!this.value)
    this.value = 0
  next()
})

const Removal = mongoose.model('Removal', removalSchema)

module.exports = Removal