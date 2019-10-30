const UserLocation = require('../models/userLocation')
const User = require('../models/user')
const logger = require('../utils/logger')

const post = async locationData => {
  const location = {
    deviceId: locationData['device-id'],
    speed: locationData.speed,
    location: {
      type: 'Point',
      coordinates: [locationData.longitude, locationData.latitude]
    }
  }

  const userLocation = await UserLocation.findOneAndUpdate(
    { deviceId: locationData['device-id'] },
    location,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  if (!userLocation) logger.log(`Can't update UserLocation!`)

  const user = await User.findOne({ deviceId: locationData['device-id'] })
  if (!user) {
    logger.log(`Can't find user!`)
    return null
  }
  logger.log('User:', user.nickName)

  const nearest = await UserLocation.findOne({
    deviceId: { $ne: user.deviceId },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        $maxDistance: user.nearest,
        $minDistance: 0
      }
    }
  })
  if (!nearest) {
    logger.log(`Can't find any other user nearby.`)
    return null
  }

  const nearestUser = await User.findOne({ deviceId: nearest.deviceId })
  if (!nearestUser) {
    logger.log(`Can't find nearestUser!`)
    return null
  }
  logger.log('Nearest user:', nearestUser.nickName)

  return { nearest: nearest, nearestUser: nearestUser }
}

module.exports = { post }
