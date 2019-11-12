require('dotenv').config()

const dbConnection = require('./src/db/dbConnection')
const logger = require('./src/utils/logger')

const getWeather = require('./src/services/getWeather')

const City = require('./src/models/city')
const User = require('./src/models/user')
const UserLocation = require('./src/models/userLocation')

const updateLocationWeather = async () => {
  const randomLocations = await UserLocation.aggregate([
    {
      $match: {
        weather: null
      }
    },
    {
      $sample: {
        size: 200
      }
    }
  ])

  for (const userLocation of randomLocations) {
    if (
      userLocation.location.coordinates &&
      userLocation.location.coordinates.length === 2
    ) {
      const weather = await getWeather(
        userLocation.location.coordinates[1],
        userLocation.location.coordinates[0]
      )
      if (weather) {
        userLocation.weather = JSON.stringify(weather)

        await UserLocation.findOneAndUpdate(
          { deviceId: userLocation.deviceId },
          userLocation
        )

        logger.log('Weather updated for', userLocation.deviceId)
      }
    }
  }
}

const addCityCenterLocation = async () => {
  let updated = 0
  let ignored = 0

  const randomUsers = await User.aggregate([
    {
      $match: {
        type: 'Bulk-CityCenter'
      }
    },
    {
      $sample: {
        size: 100
      }
    }
  ])

  for (const user of randomUsers) {
    const location = await UserLocation.findOne({ deviceId: user.deviceId })
    if (location) {
      ignored++
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

      await UserLocation.findOneAndUpdate(
        { deviceId: user.deviceId },
        location,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )

      updated++
    }
  }

  return { updated, ignored }
}

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', async () => {
  logger.log('Scheduled tasks started ...')

  try {
    logger.log('addCityCenterLocation started')
    const res = await addCityCenterLocation()
    logger.log(`addCityCenterLocation ended: ${res}`)
  } catch (err) {
    logger.log('addCityCenterLocation:', err)
  }

  try {
    logger.log('updateLocationWeather started')
    await updateLocationWeather()
    logger.log('updateLocationWeather ended')
  } catch (err) {
    logger.log('updateLocationWeather:', err)
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
