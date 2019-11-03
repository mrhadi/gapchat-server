const mongoose = require('mongoose')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new Schema(
  {
    createdBy: {
      type: ObjectId
    },
    context: {
      type: String,
      required: [true]
    },
    type: {
      type: String
    },
    message: {
      type: String
    },
    param: {
      type: String
    },
    user: {
      type: String
    },
    deviceId: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

schema.index({ deviceId: 1 })
schema.index({ user: 1 })
schema.index({ updatedAt: 1 })

schema.pre('save', () => {
  logger.log('ActivityLog schema pre-save')
})

const ActivityLog = mongoose.model('ActivityLog', schema, 'ActivityLog')

module.exports = ActivityLog
