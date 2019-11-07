require('dotenv').config({ path: '../.env' })
const csv = require('csvtojson')
const dbConnection = require('../src/db/dbConnection')
const logger = require('../src/utils/logger')
const City = require('../src/models/city')
const User = require('../src/models/user')

const fromCode = 1
const toCode = 100

let nameList

const deleteBulkUsers = async () => {
  const retVal = await User.deleteMany({ type: 'Bulk-CityCenter' })
  console.log('deleteBulkUsers:', retVal)
}

const addBulkUsers = async () => {
  for (let code = fromCode; code <= toCode; code++) {
    const randIndex = Math.floor(Math.random() * nameList.length)
    const randName = nameList[randIndex][0]
    console.log('randName:', randName)

    const city = await City.findOne({ code: code })

    let avatar = Math.floor(Math.random() * 110) + 1
    avatar = avatar < 10 ? `00${avatar}` : avatar < 100 ? `0${avatar}` : avatar

    const user = new User({
      nickName: randName,
      avatar: 'avatar_' + avatar,
      nearest: 1000,
      furthest: 20000,
      type: 'Bulk-CityCenter',
      cityName: city.cityName,
      countryName: city.countryName,
      countryCode: city.countryCode,
      deviceId:
        city.cityName.replace(' ', '') +
        '-' +
        city.countryName.replace(' ', '') +
        '-' +
        city.code
    })
    console.log(user)

    await user.save()

    console.log(`=> ${code}`)
  }
}

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', async () => {
  logger.log('MongoDB connected successfully.')
  nameList = await csv({
    noheader: true,
    trim: true,
    output: 'csv'
  }).fromFile('./csv/names.csv')
  console.log('nameList:', nameList.length)

  // await deleteBulkUsers()
  // await addBulkUsers()
})


