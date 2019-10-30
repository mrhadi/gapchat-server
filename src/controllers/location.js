const UserLocation = require('../models/userLocation')
const User = require('../models/user')
const logger = require('../utils/logger')

const post = async locationData => {
  const location = {
    deviceId: locationData['device-id'],
    speed: locationData.speed,
    location: {
      type: 'Point',
      coordinates: [locationData.latitude, locationData.longitude]
    }
  }

  const userLocation = await UserLocation.findOneAndUpdate(
    { deviceId: locationData['device-id'] },
    location,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  if (!userLocation) {
    logger.log(`Can't update UserLocation, deviceId: ${location.deviceId}`)
    return null
  }

  const user = await User.findOne({ deviceId: location.deviceId })
  if (!user) {
    logger.log(`Can't find user, deviceId: ${location.deviceId}`)
    return null
  }

  const nearest = await UserLocation.findOne({
    deviceId: { $ne: user.deviceId },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [locationData.latitude, locationData.longitude]
        },
        $maxDistance: user.nearest,
        $minDistance: 0
      }
    }
  })
  if (!nearest) {
    logger.log(`Can't find any nearby user for ${user.nickName}`)
    return null
  }

  const nearestUser = await User.findOne({ deviceId: nearest.deviceId })
  if (!nearestUser) {
    logger.log(`Can't find nearestUser, deviceId: ${nearest.deviceId}`)
    return null
  }

  logger.log(`User: ${user.nickName}, Nearest: ${nearestUser.nickName}`)

  return { nearest: nearest, nearestUser: nearestUser }
}

module.exports = { post }
