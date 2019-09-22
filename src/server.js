const makeApp = require('./utils/makeApp')
const logger = require('./utils/logger')
const { PORT } = require('./utils/config')

const start = async () => {
  try {
    const app = await makeApp()
    const server = await app.listen(PORT)
    logger.log('Server started and listening on port', PORT)

    return { server }
  } catch (err) {
    logger.log('Could not start the server:', err)
    throw err
  }
}

module.exports = { start }
