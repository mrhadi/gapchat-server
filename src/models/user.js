const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema(
  {
    createdBy: {
      type: ObjectId
    },
    nickName: {
      type: String,
      required: [true]
    },
    active: {
      type: Boolean,
      default: true,
      required: [true]
    },
    nearest: {
      type: Number,
      required: [true]
    },
    furthest: {
      type: Number,
      required: [true]
    },
    avatar: {
      type: String,
      required: [true]
    },
    deviceId: {
      type: String,
      required: [true]
    },
    userLocation: {
      type: ObjectId,
      ref: 'UserLocation'
    }
  },
  {
    timestamps: true
  }
)

schema.index({ deviceId: 1 })

schema.pre('save', () => {
  logger.log('User schema pre-save')
})

const User = mongoose.model('User', schema, 'User')

module.exports = User
