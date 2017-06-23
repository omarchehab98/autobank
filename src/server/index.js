// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.js')

const Expenses = require('./expenses/index.js')
const expenses = new Expenses(credentials.expenses)
expenses.on('connect', () => console.log('Expenses: ' + credentials.expenses.host + ':' + credentials.expenses.port))
expenses.on('error', console.error)

const Mailbox = require('./mail/mailbox.js')
const filterForExpenses = require('./filterForExpenses.js')(expenses)
const mailbox = new Mailbox(credentials.mailbox)
mailbox.on('mail', mail => filterForExpenses(mail.body.text))
mailbox.on('error', console.error)
mailbox.on('connect', () => console.log('Mailbox: ' + credentials.mailbox.host + ':' + credentials.mailbox.port))

const Authentication = require('./authentication/index.js')
const authentication = new Authentication(credentials.authentication)
authentication.on('connect', () => console.log('Authentication: ' + credentials.authentication.host + ':' + credentials.authentication.port))
authentication.on('error', console.error)

const API = require('./api/index.js')
API(credentials.api, {
  expenses,
  authentication
})
console.log('API: localhost:' + credentials.api.port)
