const config = require('./utils/config')
const express = require('express')
const path = require('path') // Tämä tarvii olla täällä, jotta routet toimisi oikein myös production-versiossa
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const removalRouter = require('./controllers/removals')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { errorHandler, tokenExtractor, requestLogger } = require('./utils/middleware')

app.use(bodyParser.json())
app.use(express.static('build')) // Tämä tarvii olla täällä, jotta routet toimisi oikein myös production-versiossa

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(tokenExtractor)

app.use('/api/removals', removalRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}) // Tämä tarvii olla täällä, jotta routet toimisi oikein myös production-versiossa

app.use(errorHandler)
module.exports = app