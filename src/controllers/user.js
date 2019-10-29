const User = require('../models/user')

const get = () => {
  return 'GET'
}

const post = async userData => {
  const user = new User({
    nickName: userData.nickName,
    avatar: userData.avatar,
    nearest: userData.nearest,
    furthest: userData.furthest,
    deviceId: userData.deviceId
  })

  const retVal = await user.save()
  return retVal
}

module.exports = { get, post }
