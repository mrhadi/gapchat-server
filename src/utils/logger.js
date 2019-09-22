const writeLog = (level, ...params) => {
  switch (level) {
    case 'debug': {
      console.log('DEBUG', ...params)
      break
    }
    case 'error': {
      console.error(...params)
      break
    }
    case 'info': {
      console.log('INFO', ...params)
      break
    }
    case 'log': {
      console.log(...params)
    }
  }
}

const logger = {
  debug: (...params) => {
    writeLog('debug', ...params)
  },
  error: (...params) => {
    writeLog('error', ...params)
  },
  info: (...params) => {
    writeLog('info', ...params)
  },
  log: (...params) => {
    writeLog('log', ...params)
  }
}

module.exports = logger
