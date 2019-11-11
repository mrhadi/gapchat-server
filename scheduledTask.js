require('dotenv').config()

const dbConnection = require('./src/db/dbConnection')
const logger = require('./src/utils/logger')

const getWeather = require('./src/services/getWeather')

const City = require('./src/models/city')
const User = require('./src/models/user')
const UserLocation = require('./src/models/userLocation')

const addCityCenterLocation = async () => {
  const updatedLocations = []
  const randomUsers = await User.aggregate([
    {
      $match: {
        type: 'Bulk-CityCenter'
      }
    },
    {
      $sample: {
        size: 20
      }
    }
  ])

  for (const user of randomUsers) {
    const location = await UserLocation.findOne({ deviceId: user.deviceId })
    if (location) {
      logger.log(`addCityCenterLocation: Ignoring ${user.nickName}`)
      continue
    }

    const city = await City.findOne({
      cityName: user.cityName,
      countryCode: user.countryCode
    })

    if (city) {
      const location = {
        deviceId: user.deviceId,
        speed: 0,
        location: {
          type: 'Point',
          coordinates: [city.longitude, city.latitude]
        },
        requestedBy: 'FakeLocation'
      }

      const weather = await getWeather(city.latitude, city.longitude)
      if (weather) {
        location.weather = JSON.stringify(weather)
      }

      const userLocation = await UserLocation.findOneAndUpdate(
        { deviceId: user.deviceId },
        location,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )

      updatedLocations.push(userLocation)
    }
  }

  return updatedLocations
}

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', async () => {
  logger.log('Scheduled tasks started ...')

  try {
    logger.log('addCityCenterLocation started')
    const res = await addCityCenterLocation()
    logger.log(`addCityCenterLocation ended, ${res.length} locations added`)
  } catch (err) {
    logger.log('addCityCenterLocation:', err)
  }

  logger.log('Scheduled tasks ended')
})

/*
;(async () => {
  try {
  } catch (error) {
  }
})()
*/
