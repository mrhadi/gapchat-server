const ActivityLog = require('../models/activityLog')
const logger = require('../utils/logger')

const activityLogger = async activityObject => {
  const log = new ActivityLog(activityObject)

  try {
    await log.save()
  } catch (error) {
    logger.log('activityLogger:', error)
  }
}

module.exports = activityLogger
