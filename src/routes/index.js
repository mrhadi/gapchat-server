const router = require('express').Router()
const logger = require('../utils/logger')
const userRouter = require('../api/v1.0/user/user')

router.use((req, res, next) => {
  logger.log('ROUTER:', req.method, req.url)

  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server root')
})

router.use('/api/v1/user', userRouter)

module.exports = router
