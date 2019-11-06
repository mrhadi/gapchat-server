const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const { fakeLocation } = require('../../controllers/task')

router.get(
  '/inactive-locations',
  asyncHandler(async (req, res) => {
    res.status(200).send('OK')
  })
)

router.get(
  '/fake-location',
  asyncHandler(async (req, res) => {
    const retVal = await fakeLocation()
    res.status(200).send(retVal)
  })
)

module.exports = router
