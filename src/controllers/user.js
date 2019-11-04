const User = require('../models/user')

const get = async userData => {
  const user = await User.findOne({ deviceId: userData['device-id'] })
  console.log('Find User:', user)
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

  const retVal = await user.save()
  return retVal
}

module.exports = { get, post }
