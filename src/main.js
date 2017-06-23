// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.js')
process.on('uncaughtException', console.error)
require('./client/webserver.js')(credentials)
require('./server/index.js')(credentials)
