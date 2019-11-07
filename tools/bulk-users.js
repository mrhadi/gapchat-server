require('dotenv').config({ path: '../.env' })

const csv = require('csvtojson')
const shortid = require('shortid')

const dbConnection = require('../src/db/dbConnection')
const logger = require('../src/utils/logger')
const City = require('../src/models/city')
const User = require('../src/models/user')

const fromCityCode = 101
const toCityCode = 5000
const deleteCurrentBulkUsers = false

let nameList

const deleteBulkUsers = async () => {
  const retVal = await User.deleteMany({ type: 'Bulk-CityCenter' })
  console.log('deleteBulkUsers:', retVal)
}

const addBulkUsers = async () => {
  for (let code = fromCityCode; code <= toCityCode; code++) {
    const randIndex = Math.floor(Math.random() * nameList.length)
    const randName = nameList[randIndex][0]

    const city = await City.findOne({ code: code })
    if (!city) {
      console.log('City code not found:', code)
      continue
    }

    let avatar = Math.floor(Math.random() * 110) + 1
    avatar = avatar < 10 ? `00${avatar}` : avatar < 100 ? `0${avatar}` : avatar

    const user = new User({
      nickName: randName,
      avatar: 'avatar_' + avatar,
      nearest: 5000,
      furthest: 15000,
      type: 'Bulk-CityCenter',
      cityName: city.cityName,
      countryName: city.countryName,
      countryCode: city.countryCode,
      deviceId: shortid.generate() + city.countryCode + avatar
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

  if (deleteCurrentBulkUsers) await deleteBulkUsers()

  await addBulkUsers()
})
