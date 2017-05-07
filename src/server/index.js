process.on('uncaughtException', function (e) {
  console.error(e)
})

// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.json')

const Expenses = require('./expenses/index.js')
const expenses = new Expenses(credentials.expenses)
expenses.on('connect', () => console.log('Expenses: ' + credentials.expenses.host + ':' + credentials.expenses.port))
expenses.on('error', console.log)

const Mailbox = require('./mail/mailbox.js')
const filterForExpenses = require('./filterForExpenses.js')(expenses)
const mailbox = new Mailbox(credentials.mailbox)
mailbox.on('mail', mail => filterForExpenses(mail.body.text))
mailbox.on('error', console.log)
mailbox.on('connect', () => console.log('Mailbox: ' + credentials.mailbox.host + ':' + credentials.mailbox.port))

const Authentication = require('./authentication/index.js')
const authentication = new Authentication(credentials.authentication)
authentication.on('connect', () => console.log('Authentication: ' + credentials.authentication.host + ':' + credentials.authentication.port))
authentication.on('error', console.log)

const API = require('./api/index.js')
API(credentials.api, {
  expenses,
  authentication
})
console.log('API: localhost:' + credentials.api.port)

if (process.env.NODE_ENV === 'production') {
  const express = require('express')
  const webserver = express()
  const port = 3000
  webserver.use(express.static('dist'))
  webserver.listen(port)
  console.log('Webserver: localhost:' + port)
}
