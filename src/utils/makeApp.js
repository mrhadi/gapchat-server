const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment-timezone')

const routes = require('../routes')

const genericErrors = require('./genericErrors')
const notFoundError = require('./notFoundError')
const { bugsnagClient } = require('../bugsnag')

const bugsnagMiddleware = bugsnagClient.getPlugin('express')

const makeApp = async () => {
  const app = express()
  app.locals.moment = moment

  app.set('views', './src/views')
  app.set('view engine', 'pug')
  app.use(express.static('public'))
  app.use(cors())
  app.use(bodyParser.json())
  app.use('/', routes)
  app.use(bugsnagMiddleware.errorHandler)
  app.use(notFoundError)
  app.use(genericErrors) // must be last

  return app
}

module.exports = makeApp
