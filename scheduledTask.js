require('dotenv').config()
const axios = require('./src/axios')
const logger = require('./src/utils/logger')

const deleteInactiveLocations = async () => {
  const res = await axios.post('/task/inactive-locations')
  if (res && res.data) {
    logger.log('deleteInactiveLocations:', res.data)
  }
}

logger.log('Scheduled tasks started ...')
// deleteInactiveLocations()
