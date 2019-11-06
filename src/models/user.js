const mongoose = require('mongoose')

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
    type: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

schema.index({ deviceId: 1 })
schema.index({ type: 1 })

const User = mongoose.model('User', schema, 'User')

module.exports = User
