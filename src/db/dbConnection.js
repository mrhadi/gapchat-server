const mongoose = require('mongoose')
const logger = require('../utils/logger')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .catch(err => {
    logger.error('mongoose.connect:', err)
  })

const dbConnection = mongoose.connection

module.exports = dbConnection
