const router = require('express').Router()
const asyncHandler = require('express-async-handler')

router.post(
  '/inactive-locations',
  asyncHandler(async (req, res) => {
    res.status(200).send('OK')
  })
)

module.exports = router
