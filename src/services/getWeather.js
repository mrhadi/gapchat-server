const axios = require('../axios')
const logger = require('../utils/logger')

const API_END_POINT = 'http://api.weatherstack.com/current'
const API_KEY = 'cac1a03a0f161637590f2a45f2af24d6'

const getWeather = async (lat, lng) => {
  try {
    logger.log(`getWeather: [${lat}, ${lng}]`)
    const res = await axios.get(
      `${API_END_POINT}?access_key=${API_KEY}&query=${lat},${lng}`
    )
    if (res && res.data) {
      if (res.data.error) {
        logger.log('getWeather:', res.data.error)
      } else {
        return res.data
      }
    } else {
      logger.log('getWeather: No data')
    }
  } catch (err) {
    logger.log('getWeather:', err)
  }

  return null
}

module.exports = getWeather
