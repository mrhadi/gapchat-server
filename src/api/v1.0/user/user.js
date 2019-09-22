const router = require('express').Router()

router.get('/', (req, res) => {
  res.status(200).send('User GET')
})

router.post('/', (req, res) => {
  res.status(200).send('User POST')
})

router.put('/', (req, res) => {
  res.status(200).send('User PUT')
})

router.delete('/', (req, res) => {
  res.status(200).send('User DELETE')
})

module.exports = router
