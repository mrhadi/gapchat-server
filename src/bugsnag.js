const bugsnag = require('@bugsnag/js')
const bugsnagExpress = require('@bugsnag/plugin-express')

const bugsnagClient = bugsnag('2b633646eb9063091093b1eb9499cce0')

bugsnagClient.use(bugsnagExpress)

module.exports = { bugsnagClient }
