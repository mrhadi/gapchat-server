const UserLocation = require('../models/userLocation')
const User = require('../models/user')
const logger = require('../utils/logger')
const geoDistance = require('../utils/geoDistance')

const post = async locationData => {
  const location = {
    deviceId: locationData['device-id'],
    speed: locationData.speed,
    location: {
      type: 'Point',
      coordinates: [locationData.longitude, locationData.latitude]
    }
  }

  logger.log(locationData)
  const source = locationData.source

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
    return { userLocation }
  }

  const nearest = await UserLocation.findOne({
    deviceId: { $ne: user.deviceId },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        $maxDistance: user.nearest
      }
    }
  }).sort('-updatedAt')
  if (!nearest) {
    logger.log(
      `User: ${user.nickName}, can't find any nearby user, [${source}]`
    )
    return { userLocation }
  }

  const nearestUser = await User.findOne({ deviceId: nearest.deviceId })
  if (!nearestUser) {
    logger.log(
      `User: ${user.nickName}, can't find nearestUser, deviceId: ${nearest.deviceId}, [${source}]}`
    )
    return { userLocation }
  }

  const nearestLocation = nearest.location.coordinates
  const distance = geoDistance(
    locationData.latitude,
    locationData.longitude,
    nearestLocation[1],
    nearestLocation[0],
    'M'
  )

  logger.log(
    `User: ${user.nickName}, Nearest: ${nearestUser.nickName}, Distance: ${distance}, [${source}]`
  )

  return { userLocation, nearest, nearestUser, distance }
}

module.exports = { post }
