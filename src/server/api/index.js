const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const expenses = require('./controllers/expenses.js')
const expenseModel = require('./models/expense.js')
const income = require('./controllers/income.js')
const incomeModel = require('./models/income.js')

/**
 * @param {Object} options
 * @param {string} options.path
 * @param {number} options.port
 * @param {Object} dependencies
 * @param {Object} dependencies.expenses
 */
function API (options, dependencies) {
  const path = options.path || ''
  const port = options.port || '80'

  app.use(bodyParser.urlencoded())

  app.get(`${path}/expenses/expenses`, [
    setCORS,
    expenses.getController(dependencies.expenses, expenseModel)
  ])
  app.get(`${path}/expenses/expenses/:id/delete`, [
    setCORS,
    expenses.removeController(dependencies.expenses, expenseModel)
  ])
  app.post(`${path}/expenses/expenses/:id/edit`, [
    setCORS,
    expenses.editController(dependencies.expenses, expenseModel)
  ])

  app.get(`${path}/expenses/income`, [
    setCORS,
    income.getController(dependencies.expenses, incomeModel)
  ])
  app.get(`${path}/expenses/income/:id/delete`, [
    setCORS,
    income.removeController(dependencies.expenses, incomeModel)
  ])
  app.post(`${path}/expenses/income/:id/edit`, [
    setCORS,
    income.editController(dependencies.expenses, incomeModel)
  ])

  app.listen(port)
}

function setCORS (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  next()
}

module.exports = API
