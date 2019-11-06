const User = require('../models/user')

const fakeLocation = async () => {
  const randomUsers = await User.aggregate([
    {
      $match: {
        type: 'Bulk-CityCenter'
      }
    },
    {
      $sample: {
        size: 10
      }
    }
  ])
  return randomUsers
}

module.exports = { fakeLocation }
