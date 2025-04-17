const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter) // prefix of all routes in personsRouter

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app