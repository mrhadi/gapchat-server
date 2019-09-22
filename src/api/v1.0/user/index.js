const router = require('express').Router()
const { get, post } = require('../../../controllers/user')

router.get('/', (req, res) => {
  get()
  res.status(200).send('User GET')
})

router.post('/', (req, res) => {
  post()
  res.status(200).send('User POST')
})

module.exports = router
