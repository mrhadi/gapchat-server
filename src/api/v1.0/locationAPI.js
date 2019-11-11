const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const { check, validationResult, matchedData } = require('express-validator')
const { updateUserLocation } = require('../../controllers/location')

router.post(
  '/',
  [
    check('device-id').isString(),
    check('latitude').isFloat(),
    check('longitude').isFloat(),
    check('speed').isFloat(),
    check('metaData').optional({ nullable: true })
  ],
  asyncHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const locationData = matchedData(req, {
      includeOptionals: true
    })

    const retVal = await updateUserLocation(locationData)
    res.status(200).send(retVal)
  })
)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).send('OK')
  })
)

module.exports = router
