const User = require('../models/user')
const UserLocation = require('../models/userLocation')

const getUser = async userData => {
  const user = await User.findOne({ deviceId: userData['device-id'] })
  return user
}

const addUser = async userData => {
  const user = new User({
    nickName: userData.nickName,
    avatar: userData.avatar,
    nearest: userData.nearest,
    furthest: userData.furthest,
    deviceId: userData['device-id']
  })

  if (userData.type) user.type = userData.type

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

const updateUser = async userData => {
  const user = {
    nickName: userData.nickName,
    avatar: userData.avatar,
    active: userData.active,
    nearest: userData.nearest,
    furthest: userData.furthest
  }

  const res = await User.findOneAndUpdate(
    { deviceId: userData['device-id'] },
    user,
    { new: true }
  )

  if (!userData.active) {
    await UserLocation.findOneAndDelete({ deviceId: userData['device-id'] })
  }

  return res
}

module.exports = { getUser, addUser, updateUser }
