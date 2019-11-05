const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema(
  {
    createdBy: {
      type: ObjectId
    },
    cityName: {
      type: String,
      required: [true]
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    countryName: {
      type: String
    },
    countryCode: {
      type: String
    },
    code: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

schema.index({ code: 1 })
schema.index({ cityName: 1 })
schema.index({ countryCode: 1 })

const City = mongoose.model('City', schema, 'City')

module.exports = City
