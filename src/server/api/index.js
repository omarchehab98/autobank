const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const authentication = require('./controllers/authentication.js')
const expenses = require('./controllers/expenses.js')
const expenseModel = require('./models/expense.js')
const income = require('./controllers/income.js')
const incomeModel = require('./models/income.js')

/**
 * @param {Object} credentials
 * @param {string} credentials.privateKey
 * @param {string} [credentials.path]
 * @param {number} [credentials.port]
 * @param {Object} dependencies
 * @param {Object} dependencies.expenses
 * @param {Object} dependencies.authentication
 */
function API (credentials, dependencies) {
  const privateKey = credentials.privateKey
  const path = credentials.path || ''
  const port = credentials.port || '80'

  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(function defineCORS (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    next()
  })

  app.post(`${path}/authentication/generateToken`, [
    authentication.generateToken(dependencies.authentication, privateKey)
  ])

  app.get(`${path}/authentication/validateToken`, [
    authentication.validateToken(dependencies.authentication, true)
  ])

  const validateToken = authentication.validateToken(dependencies.authentication, false)

  app.get(`${path}/expenses/expenses`, [
    validateToken,
    expenses.getController(dependencies.expenses, expenseModel)
  ])
  app.get(`${path}/expenses/expenses/:id/delete`, [
    validateToken,
    expenses.removeController(dependencies.expenses, expenseModel)
  ])
  app.post(`${path}/expenses/expenses/:id/edit`, [
    validateToken,
    expenses.editController(dependencies.expenses, expenseModel)
  ])

  app.get(`${path}/expenses/income`, [
    validateToken,
    income.getController(dependencies.expenses, incomeModel)
  ])
  app.get(`${path}/expenses/income/:id/delete`, [
    validateToken,
    income.removeController(dependencies.expenses, incomeModel)
  ])
  app.post(`${path}/expenses/income/:id/edit`, [
    validateToken,
    income.editController(dependencies.expenses, incomeModel)
  ])

  app.listen(port)
}

module.exports = API
