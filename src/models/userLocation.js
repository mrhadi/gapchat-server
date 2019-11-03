const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema(
  {
    createdBy: {
      type: ObjectId
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
    },
    requestedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

schema.index({ location: '2dsphere' })
schema.index({ updatedAt: 1 }) // { expireAfterSeconds: 360 }
schema.index({ deviceId: 1 })

schema.pre('save', () => {
  logger.log('UserLocation schema pre-save')
})

const UserLocation = mongoose.model('UserLocation', schema, 'UserLocation')

module.exports = UserLocation
