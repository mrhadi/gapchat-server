const User = require('../models/user')
const City = require('../models/user')
const UserLocation = require('../models/userLocation')

const fakeLocation = async () => {
  const updatedLocations = []
  const randomUsers = await User.aggregate([
    {
      $match: {
        type: 'Bulk-CityCenter'
      }
    },
    {
      $sample: {
        size: 5
      }
    }
  ])

  for (const user of randomUsers) {
    console.log('User:', user.nickName)
    const city = await City.findOne({ cityName: user.nickName })

    if (city) {
      console.log('City:', city.cityName)
      const location = {
        deviceId: user['device-id'],
        speed: 0,
        location: {
          type: 'Point',
          coordinates: [city.longitude, city.latitude]
        },
        requestedBy: 'FakeLocation'
      }

      const userLocation = await UserLocation.findOneAndUpdate(
        { deviceId: user['device-id'] },
        location,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )

      updatedLocations.push(userLocation)
    }
  }

  return updatedLocations
}

module.exports = { fakeLocation }
