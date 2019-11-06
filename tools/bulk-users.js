require('dotenv').config({ path: '../.env' })
const util = require('util')

const dbConnection = require('../src/db/dbConnection')
const logger = require('../src/utils/logger')
const City = require('../src/models/city')
const User = require('../src/models/user')

const fromCode = 1
const toCode = 10

const addBulkUsers = async () => {
  for (let code = fromCode; code <= toCode; code++) {
    const city = await City.findOne({ code: code })
    console.log(`${code} => ${city}`)

    let avatar = Math.floor(Math.random() * 110) + 1
    avatar = avatar < 10 ? `00${avatar}` : avatar < 100 ? `0${avatar}` : avatar
    console.log(avatar)

    const user = new User({
      nickName: city.cityName,
      avatar: 'avatar_' + avatar,
      nearest: 1000,
      furthest: 20000,
      type: 'CityCenter',
      deviceId:
        city.cityName.replace(' ', '') +
        '-' +
        city.countryName.replace(' ', '') +
        '-' +
        city.code
    })
    console.log(user)

    // await user.save()
  }
}

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', async () => {
  logger.log('MongoDB connected successfully.')
  addBulkUsers()
})
