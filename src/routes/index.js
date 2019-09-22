const router = require('express').Router()
const logger = require('../utils/logger')

router.use((req, res, next) => {
  logger.log('ROUTER:', req.method, req.url)

  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server root')
})

module.exports = router
