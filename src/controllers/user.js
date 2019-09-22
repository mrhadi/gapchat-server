const User = require('../models/user')

const get = () => {
  return 'GET'
}

const post = async name => {
  const user = new User({ name: name })
  const retVal = await user.save()

  return retVal
}

module.exports = { get, post }
