const express = require('express')
const app = express()

/**
 * @param {Object} options
 * @param {string} options.path
 * @param {number} options.port
 */
function API (options) {
  const path = options.path || ''
  const port = options.port || '3000'

  app.get(`${path}/expenses/expenses`)
  app.get(`${path}/expenses/income`)

  app.listen(port)
}

module.exports = API
