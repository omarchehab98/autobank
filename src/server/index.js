// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.json')

const Expenses = require('./expenses/index.js')
const expenses = new Expenses(credentials.expenses)
const Filter = require('./mail/filter.js')
const isString = require('lodash/isString')
const filterFieldset = require('./mail/filters/fieldset.js')
const filterRBC = require('./mail/filters/rbc.js')
const filterForExpenses = new Filter({}, [
  [
    isString,
    filterFieldset,
    filterRBC.creditWithdrawal,
    x => console.log(x) || true,
    expenses.putExpense
  ], [
    isString,
    filterFieldset,
    filterRBC.creditDeposit,
    x => console.log(x) || true,
    expenses.putIncome
  ], [
    isString,
    filterFieldset,
    filterRBC.chequingWithdrawal,
    x => console.log(x) || true,
    expenses.putExpense
  ], [
    isString,
    filterFieldset,
    filterRBC.chequingDeposit,
    x => console.log(x) || true,
    expenses.putIncome
  ]
])

const Mailbox = require('./mail/mailbox.js')
const mailbox = new Mailbox(credentials.mailbox)
mailbox.on('mail', mail => filterForExpenses(mail.body.text))

const API = require('./api/index.js')
API(credentials.api, {
  expenses
})
