const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
  nickName: {
    type: String,
    required: [true]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: [true]
  },
  createdBy: {
    type: ObjectId
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
  }
})

schema.pre('save', () => {
  logger.log('Schema pre-save')
})

const User = mongoose.model('User', schema, 'User')

module.exports = User
