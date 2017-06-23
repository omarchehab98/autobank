function startClient() {
  const path = require('path')
  const express = require('express')
  const app = express()
  const buildDirectory = path.join('..', 'dist')
  app.use(express.static(buildDirectory))
  const host = 'localhost'
  const port = 8081
  app.listen(port, host)
  console.log(`Client: ${host}:${port}`)
}

function startServer() {
  require('./server/index.js')
}

process.on('uncaughtException', console.error)

startClient()
startServer()
