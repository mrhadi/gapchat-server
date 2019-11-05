require('dotenv').config({ path: '../.env' })

const dbConnection = require('../src/db/dbConnection')
const logger = require('../src/utils/logger')
const City = require('../src/models/city')
const csvParser = require('csv-parser')
const fs = require('fs')

dbConnection.on('error', logger.error.bind(console, 'mongoose.connection:'))
dbConnection.once('open', () => {
  logger.log('MongoDB connected successfully.')

  fs.createReadStream('./csv/worldcities.csv')
    .on('error', error => {
      logger.log(error)
    })
    .pipe(csvParser())
    .on('data', async row => {
      const city = new City({
        cityName: row.city_ascii,
        latitude: row.lat,
        longitude: row.lng,
        countryName: row.country,
        countryCode: row.iso2,
        code: row.code
      })

      try {
        await city.save()
        logger.log(row.code)
      } catch (err) {
        logger.log(err)
      }
    })
    .on('end', () => {
      logger.log('end')
    })
    .on('close', () => {
      logger.log('close')
    })
})
