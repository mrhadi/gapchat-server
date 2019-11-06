require('dotenv').config()

const axios = require('./src/axios')
const logger = require('./src/utils/logger')

const deleteInactiveLocations = async () => {
  const res = await axios.get('/task/inactive-locations')
  if (res && res.data) {
    logger.log('deleteInactiveLocations:', res.data)
  }
}

const updateFakeLocations = async () => {
  const res = await axios.get('/task/fake-location')
  if (res && res.data) {
    logger.log('updateFakeLocations: Done')
  }
}

logger.log('Scheduled tasks started ...')
;(async () => {
  try {
    // await updateFakeLocations()
  } catch (error) {
    logger.log(error)
  }
})()
