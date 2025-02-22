require('dotenv').config()

const dbConnection = require('./src/db/dbConnection')
const Server = require('./src/server')
const logger = require('./src/utils/logger')

process.on('unhandledRejection', (reason, p) => {
  if (reason.code && reason.code === 'ECONNREFUSED') {
    logger.debug(
      'Known issue in the pg library wherin it fails to catch ECONNREFUSED'
    )
  } else {
    logger.error('Unhandled rejection in promise', p, 'caused by', reason)
  }
})

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', () => {
  logger.log('MongoDB connected successfully.')
})

Server.start()
