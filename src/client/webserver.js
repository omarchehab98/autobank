const path = require('path')

module.exports = function ({ webserver }) {
  const express = require('express')
  const app = express()

  const {
    host,
    port,
    staticDirectory
  } = webserver
  const buildDirectory = path.resolve(staticDirectory)

  app.use(express.static(buildDirectory))

  app.use(function (req, res, next) {
    res.status(200).sendFile(buildDirectory + '/index.html')
  })

  app.listen(port, host)
  console.log(`Client Webserver: ${host}:${port}`)
}
