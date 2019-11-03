const router = require('express').Router()
const asyncHandler = require('express-async-handler')

const UserLocation = require('../models/userLocation')

router.get(
  '/user/location',
  asyncHandler(async (req, res) => {
    const userLocation = await UserLocation.aggregate([
      {
        $lookup: {
          from: 'User',
          localField: 'deviceId',
          foreignField: 'deviceId',
          as: 'fromUser'
        }
      },
      {
        $sort: { updatedAt: -1 }
      }
    ])

    res.render('userLocation', { userLocation })
  })
)

module.exports = router
