const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const { check, validationResult, matchedData } = require('express-validator')
const { get, post } = require('../../controllers/user')

router.get(
  '/',
  [check('device-id').isString()],
  asyncHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const userData = matchedData(req, {
      locations: ['headers']
    })

    const retVal = await get(userData)
    if (retVal) {
      res.status(200).send(retVal)
    } else {
      res.status(404).send({ message: `User not found` })
    }
  })
)

router.post(
  '/',
  [
    check('nickName').isString(),
    check('avatar').isString(),
    check('nearest').isInt(),
    check('furthest').isInt(),
    check('device-id').isString()
  ],
  asyncHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const userData = matchedData(req, {
      locations: ['body', 'headers']
    })
    const retVal = await post(userData)
    res.status(200).send(retVal)
  })
)

module.exports = router
