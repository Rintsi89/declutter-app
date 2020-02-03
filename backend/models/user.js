const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const locations = ['Home']
const categories = [
  { key: 'c', text: 'Clothes', value: 'Clothes' },
  { key: 'si', text: 'Sentimental items', value: 'Sentimental items' },
  { key: 'se', text: 'Sport equipment', value: 'Sport equipment' },
  { key: 'f', text: 'Furniture', value: 'Furniture' },
  { key: 'ea', text: 'Electric appliances', value: 'Electric appliances' },
  { key: 'd', text: 'Dishes', value: 'Dishes' },
  { key: 'b', text: 'Books', value: 'Books' },
  { key: 'do', text: 'Documents', value: 'Documents' },
]

const saleLocations = [
  { key: 'tori', text: 'Tori.fi', value: 'Tori.fi' },
  { key: 'huuto', text: 'Huuto.net', value: 'Huuto.net' },
  { key: 'kontti', text: 'SPR Kontti', value: 'SPR Kontti' },
]

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 5
  },
  email: { type: String, unique: true, minlength: 5 },
  confirmed: { type: Boolean, default: false },
  name: { type: String, minlength: 2 },
  passwordHash: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  categories: { type: Array, default: categories },
  locations: { type: Array, default: locations },
  saleLocations: { type: Array, default: saleLocations },
  description: String,
  image: String,
  active: { type: Boolean, default: true },
  removals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Removal'
    }
  ],
})

userSchema.plugin(uniqueValidator, { message: 'already taken' })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User