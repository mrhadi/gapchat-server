const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema({
  name: {
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
  }
})

schema.pre('save', () => {
  logger.log('Schema pre-save')
})

const User = mongoose.model('User', schema)

module.exports = User
