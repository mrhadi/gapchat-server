const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('../routes')

const genericErrors = require('./genericErrors')
const notFoundError = require('./notFoundError')
const { bugsnagClient } = require('../bugsnag')

const bugsnagMiddleware = bugsnagClient.getPlugin('express')

const makeApp = async () => {
  const app = express()
  app.use(bugsnagMiddleware.requestHandler)
  app.set('views', './src/views')
  app.set('view engine', 'pug')
  app.use(cors())
  app.use(bodyParser.json())
  app.use('/', routes)
  app.use(bugsnagMiddleware.errorHandler)
  app.use(notFoundError)
  app.use(genericErrors) // must be last
  return app
}

module.exports = makeApp
