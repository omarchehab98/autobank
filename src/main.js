// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.js')
process.on('uncaughtException', console.error)

// Wait for Mongo container to start
setTimeout(() => {
  require('./client/webserver.js')(credentials)
  require('./server/index.js')(credentials)
}, 5000)
