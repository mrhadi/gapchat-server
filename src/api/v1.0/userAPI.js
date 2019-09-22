const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const { get, post } = require('../../controllers/user')

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const retVal = get()
    res.status(200).send(retVal)
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    if (req.query && req.query.name) {
      const retVal = await post(req.query.name)
      res.status(200).send(retVal)
    } else {
      res.status(200).send('User POST')
    }
  })
)

module.exports = router
