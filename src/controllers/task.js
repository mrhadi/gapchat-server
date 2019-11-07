const User = require('../models/user')
const City = require('../models/city')
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
        size: 10
      }
    }
  ])

  for (const user of randomUsers) {
    const city = await City.findOne({
      cityName: user.cityName,
      countryCode: user.countryCode
    })

    if (city) {
      const location = {
        deviceId: user.deviceId,
        speed: 0,
        location: {
          type: 'Point',
          coordinates: [city.longitude, city.latitude]
        },
        requestedBy: 'FakeLocation'
      }

      const userLocation = await UserLocation.findOneAndUpdate(
        { deviceId: user.deviceId },
        location,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )

      updatedLocations.push(userLocation)
    }
  }

  return updatedLocations
}

module.exports = { fakeLocation }
