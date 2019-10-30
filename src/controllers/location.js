const UserLocation = require('../models/userLocation')

const post = async userData => {
  const locationData = {
    deviceId: userData['device-id'],
    speed: userData.speed,
    location: {
      type: 'Point',
      coordinates: [userData.latitude, userData.longitude]
    }
  }

  const user = await UserLocation.findOneAndUpdate(
    { deviceId: userData['device-id'] },
    locationData,
    { new: true, upsert: true }
  )
  return user
}

module.exports = { post }
