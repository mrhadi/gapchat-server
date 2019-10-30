const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const { check, validationResult, matchedData } = require('express-validator')
const { post } = require('../../controllers/location')
const logger = require('../../utils/logger')

router.post(
  '/',
  [
    check('device-id').isString(),
    check('latitude').isFloat(),
    check('longitude').isFloat(),
    check('speed').isFloat()
  ],
  asyncHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const locationData = matchedData(req, {
      locations: ['body', 'headers', 'query']
    })

    logger.log('deviceId:', locationData['device-id'])

    const retVal = await post(locationData)
    res.status(200).send(retVal)
  })
)

module.exports = router
