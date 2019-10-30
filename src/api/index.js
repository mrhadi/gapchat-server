const router = require('express').Router()
const { API_VER } = require('../utils/config')

const userAPI = require(`./${API_VER}/userAPI`)
const locationAPI = require(`./${API_VER}/locationAPI`)

router.use(`/${API_VER}/user`, userAPI)
router.use(`/${API_VER}/location`, locationAPI)

module.exports = router
