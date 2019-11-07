const UserLocation = require('../models/userLocation')
const User = require('../models/user')
const logger = require('../utils/logger')
const activityLogger = require('../utils/activityLogger')

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

  let nearestLocation = null
  let furthestLocation = null

  const nearestLocationAggregate = await UserLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        $maxDistance: user.nearest,
        distanceField: 'distance',
        query: { deviceId: { $ne: user.deviceId } },
        includeLocs: 'location'
        // spherical: true
      }
    },
    {
      $lookup: {
        from: 'User',
        localField: 'deviceId',
        foreignField: 'deviceId',
        as: 'fromUser'
      }
    },
    {
      $limit: 1
    }
  ])
  if (nearestLocationAggregate) {
    nearestLocation = nearestLocationAggregate[0]
  }

  const furthestLocationAggregate = await UserLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude]
        },
        distanceField: 'distance',
        // query: { deviceId: { $ne: user.deviceId } },
        includeLocs: 'location'
        // spherical: true
      }
    },
    {
      $lookup: {
        from: 'User',
        localField: 'deviceId',
        foreignField: 'deviceId',
        as: 'fromUser'
      }
    },
    {
      $sort: { distance: -1 }
    },
    {
      $limit: 1
    }
  ])
  if (furthestLocationAggregate) {
    furthestLocation = furthestLocationAggregate[0]
  }

  logger.log(`User: ${user.nickName}, RequestedBy: ${requestedBy}`)

  return { nearestLocation, furthestLocation }
}

module.exports = { post }
