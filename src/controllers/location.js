const UserLocation = require('../models/userLocation')
const User = require('../models/user')
const logger = require('../utils/logger')
const activityLogger = require('../utils/activityLogger')
const geoDistance = require('../utils/geoDistance')

const post = async locationData => {
  const requestedBy =
    locationData.metaData && locationData.metaData.requestedBy
      ? locationData.metaData.requestedBy
      : ''

  const location = {
    deviceId: locationData['device-id'],
    speed: locationData.speed,
    location: {
      type: 'Point',
      coordinates: [locationData.longitude, locationData.latitude]
    },
    requestedBy: requestedBy
  }

  const user = await User.findOne({ deviceId: location.deviceId })
  if (!user) {
    logger.log(`Can't find user, deviceId: ${location.deviceId}`)
    return null
  }

  const activityObject = {
    context: 'UserLocation',
    type: 'Log',
    message: '',
    param: requestedBy,
    user: user.nickName,
    deviceId: location.deviceId
  }

  await activityLogger(activityObject)

  const userLocation = await UserLocation.findOneAndUpdate(
    { deviceId: locationData['device-id'] },
    location,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  if (!userLocation) {
    logger.log(`User: ${user.nickName}, can't update UserLocation`)
    return null
  }

  let nearestUser = null
  let distance = null

  const nearestLocation = await UserLocation.findOne(
    {
      deviceId: { $ne: user.deviceId },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [locationData.longitude, locationData.latitude]
          },
          distanceField: 'dist.calculated'
          // $maxDistance: user.nearest
        }
      }
    },
    {
      deviceId: 1,
      location: 1,
      updatedAt: 1
    }
  ).sort('-updatedAt')

  if (nearestLocation) {
    console.log('nearestLocation:', nearestLocation)
    nearestUser = await User.findOne({ deviceId: nearestLocation.deviceId })
    if (!nearestUser) {
      logger.log(
        `User: ${user.nickName}, can't find nearestUser, deviceId: ${nearestLocation.deviceId}, requestedBy: ${requestedBy}}`
      )
    }

    const nearestLocationData = nearestLocation.location.coordinates
    distance = geoDistance(
      locationData.latitude,
      locationData.longitude,
      nearestLocationData[1],
      nearestLocationData[0],
      'M'
    )
  }

  logger.log(
    `User: ${user.nickName}, Nearest: ${
      nearestUser ? nearestUser.nickName : ''
    }, Distance: ${distance}, RequestedBy: ${requestedBy}`
  )

  return { nearestLocation, nearestUser, distance }
}

module.exports = { post }
