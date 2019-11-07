const User = require('../models/user')
const UserLocation = require('../models/userLocation')

const get = async userData => {
  const user = await User.findOne({ deviceId: userData['device-id'] })
  return user
}

const post = async userData => {
  const user = new User({
    nickName: userData.nickName,
    avatar: userData.avatar,
    nearest: userData.nearest,
    furthest: userData.furthest,
    deviceId: userData['device-id']
  })

  const res = await user.save()

  if (res && userData.longitude && userData.latitude) {
    const location = {
      deviceId: userData['device-id'],
      speed: 0,
      location: {
        type: 'Point',
        coordinates: [userData.longitude, userData.latitude]
      },
      requestedBy: 'AddNewUser'
    }
    await UserLocation.findOneAndUpdate(
      { deviceId: userData['device-id'] },
      location,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
  }

  return res
}

module.exports = { get, post }
