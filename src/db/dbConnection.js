const mongoose = require('mongoose')
const logger = require('../utils/logger')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
  })
  .catch(err => {
    logger.error('mongoose.connect:', err)
  })

const dbConnection = mongoose.connection
dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', () => {
  logger.log('MongoDB connected successfully.')

  const usersSchema = new mongoose.Schema({
    name: String
  })

  const Users = mongoose.model('Users', usersSchema)

  const user = new Users({ name: 'Hadi' })
  user.save(err => {
    if (err) logger.log('err', err)
  })
})

module.exports = dbConnection
