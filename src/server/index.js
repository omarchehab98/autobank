module.exports = function (credentials) {
  const Expenses = require('./expenses/index.js')
  const expenses = new Expenses(credentials.expenses)
  expenses.on(
    'connect',
    () => console.log(`Server Expenses: ${credentials.expenses.host}:${credentials.expenses.port}`)
  )
  expenses.on('error', console.error)

  const Mailbox = require('./mail/mailbox.js')
  const filterForExpenses = require('./filterForExpenses.js')(expenses)
  const mailbox = new Mailbox(credentials.mailbox)
  mailbox.on('mail', mail => filterForExpenses(mail.body.text))
  mailbox.on(
    'connect',
    () => console.log(`Server Mailbox: ${credentials.mailbox.host}:${credentials.mailbox.port}`)
  )
  mailbox.on('error', console.error)

  const Authentication = require('./authentication/index.js')
  const authentication = new Authentication(credentials.authentication)
  authentication.on(
    'connect',
    () => console.log(`Server Authentication: ${credentials.authentication.host}:${credentials.authentication.port}`)
  )
  authentication.on('error', console.error)

  const API = require('./api/index.js')
  API(credentials.api, {
    expenses,
    authentication
  })
  console.log(`Server API: ${credentials.api.host}:${credentials.api.port}`)
}
