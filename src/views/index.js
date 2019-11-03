const router = require('express').Router()
const asyncHandler = require('express-async-handler')

const UserLocation = require('../models/userLocation')

router.get(
  '/user/location',
  asyncHandler(async (req, res) => {
    const userLocation = await UserLocation.find().sort('-updatedAt').populate('hadi')

    console.log('userLocation:', userLocation)
    res.render('userLocation', { userLocation })
  })
)

module.exports = router
