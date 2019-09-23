const router = require('express').Router()
const logger = require('../utils/logger')
const apiRouter = require('../api')

router.use((req, res, next) => {
  logger.log('ROUTER:', req.method, req.url)

  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server root')
})

router.use('/api', apiRouter)

module.exports = router
