const logger = require('../utils/logger')

const get = () => {
  logger.log('get')
}

const post = () => {
  logger.log('post')
}

module.exports = { get, post }
