const router = require('express').Router()
const { API_VER } = require('../utils/config')

const userAPI = require(`./${API_VER}/userAPI`)
const locationAPI = require(`./${API_VER}/locationAPI`)
const taskAPI = require(`./${API_VER}/taskAPI`)

router.use(`/${API_VER}/user`, userAPI)
router.use(`/${API_VER}/location`, locationAPI)
router.use(`/${API_VER}/task`, taskAPI)

module.exports = router
