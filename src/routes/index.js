const router = require('express').Router()
const logger = require('../utils/logger')
const apiRouter = require('../api')
const viewRouter = require('../views')

router.use((req, res, next) => {
  logger.log('ROUTER:', req.method, req.url)

  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server root')
})

router.use('/api', apiRouter)
router.use('/view', viewRouter)

module.exports = router
