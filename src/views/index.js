const router = require('express').Router()
const asyncHandler = require('express-async-handler')

const UserLocation = require('../models/userLocation')
const ActivityLog = require('../models/activityLog')

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
      },
      {
        $limit: 200
      }
    ])

    const numUserLocation = await UserLocation.count()
    console.log('numUserLocation', numUserLocation)
    res.render('userLocation', { userLocation, numUserLocation })
  })
)

router.get(
  '/user/location/:deviceId',
  asyncHandler(async (req, res) => {
    const activityLog = await ActivityLog.find({
      deviceId: req.params.deviceId
    })
      .sort('-updatedAt')
      .limit(200)

    res.render('activityLog', { activityLog })
  })
)

module.exports = router
