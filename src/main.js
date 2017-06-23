function startClient () {
  const path = require('path')
  const express = require('express')
  const app = express()
  const buildDirectory = path.resolve('dist')
  app.use(express.static(buildDirectory))
  app.use(function (res, res, next) {
    res.status(404).sendFile(buildDirectory + '/index.html')
  })
  const host = 'localhost'
  const port = 8081
  app.listen(port, host)
  console.log(`Client: ${host}:${port}`)
}

function startServer () {
  require('./server/index.js')
}

process.on('uncaughtException', console.error)

startClient()
startServer()
