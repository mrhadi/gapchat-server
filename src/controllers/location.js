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
  let nearestLocation = null

  const nearestLocationAggregate = await UserLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        distanceField: 'dist.calculated',
        query: { deviceId: { $ne: user.deviceId } },
        includeLocs: 'dist.location',
        spherical: true
      }
    },
    {
      $sort: { updatedAt: -1 }
    },
    {
      $limit: 1
    }
  ])

  const furthestLocationAggregate = await UserLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        distanceField: 'distance',
        query: { deviceId: { $ne: user.deviceId } },
        includeLocs: 'location',
        spherical: true
      }
    },
    {
      $sort: { distance: -1, updatedAt: -1 }
    },
    {
      $limit: 1
    }
  ])
  console.log('furthestLocationAggregate:', furthestLocationAggregate)

  if (nearestLocationAggregate) {
    nearestLocation = nearestLocationAggregate[0]
    console.log('nearestLocation:', nearestLocation)
    nearestUser = await User.findOne({ deviceId: nearestLocation.deviceId })
    if (!nearestUser) {
      logger.log(
        `User: ${user.nickName}, can't find nearestUser, deviceId: ${nearestLocation.deviceId}, requestedBy: ${requestedBy}}`
      )
    }
  }

  logger.log(
    `User: ${user.nickName}, Nearest: ${
      nearestUser ? nearestUser.nickName : ''
    }, Distance: ${
      nearestLocation ? nearestLocation.dist.calculated : ''
    }, RequestedBy: ${requestedBy}`
  )

  return { nearestLocation, nearestUser }
}

module.exports = { post }
