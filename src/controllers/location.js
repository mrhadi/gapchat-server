const UserLocation = require('../models/userLocation')
const User = require('../models/user')

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

  const user = await User.findOne({ deviceId: locationData['device-id'] })
  console.log(user)

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

  return { userLocation: userLocation, nearest: nearest }
}

module.exports = { post }
