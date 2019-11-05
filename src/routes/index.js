const router = require('express').Router()
const apiRouter = require('../api')
const viewRouter = require('../views')

router.use((req, res, next) => {
  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server root')
})

router.use('/api', apiRouter)
router.use('/view', viewRouter)

module.exports = router
