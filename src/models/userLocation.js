const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema

const schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    required: [true]
  },
  deviceId: {
    type: String,
    required: [true]
  },
  speed: {
    type: Number
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
})

schema.pre('save', () => {
  logger.log('UserLocation schema pre-save')
})

const UserLocation = mongoose.model('UserLocation', schema, 'UserLocation')

module.exports = UserLocation
