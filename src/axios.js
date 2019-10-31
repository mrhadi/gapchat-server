const axios = require('axios')
const logger = require('./utils/logger')
console.log(process.env.API_ENDPOINT)
const instance = axios.create({
  baseURL: process.env.API_ENDPOINT,
  timeout: 5000
})

instance.interceptors.response.use(
  response => response,
  error => {
    logger.log('axiosError:', error)
    return error
  }
)

module.exports = instance
