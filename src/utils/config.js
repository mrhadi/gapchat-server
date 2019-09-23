const env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8282
const API_VER = 'v1.0'

module.exports = {
  PORT,
  env,
  API_VER
}
