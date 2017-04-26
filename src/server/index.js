// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.json')

const Expenses = require('./expenses/index.js')
const expenses = new Expenses(credentials.expenses)
console.log('Expenses: '+credentials.expenses.host+':'+credentials.expenses.port)

const Mailbox = require('./mail/mailbox.js')
const filterForExpenses = require('./filterForExpenses.js')(expenses)
const mailbox = new Mailbox(credentials.mailbox)
mailbox.on('mail', mail => filterForExpenses(mail.body.text))
console.log('Mailbox: '+credentials.mailbox.host+':'+credentials.mailbox.port)

const API = require('./api/index.js')
API(credentials.api, {
  expenses
})
console.log('API: localhost:' + credentials.api.port)

if (process.env.NODE_ENV == 'production') {
  const express = require('express')
  const webserver = express()
  const port = 3000
  webserver.use(express.static('dist'))
  webserver.listen(port)
  console.log('Webserver: localhost:' + port)
}
