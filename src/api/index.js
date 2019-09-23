const router = require('express').Router()
const { API_VER } = require('../utils/config')

const userAPI = require(`./${API_VER}/userAPI`)

router.use(`/${API_VER}/user`, userAPI)

module.exports = router
