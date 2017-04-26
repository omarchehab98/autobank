const assert = require('chai').assert

const isFunction = assert.isFunction
const isBoolean = assert.isBoolean

const Expenses = require('../../../src/server/expenses/index.js')

function spec (expenses) {
  // Constructor
  isFunction(Expenses)

  // Public variables
  isBoolean(expenses.isConnected)

  // Public functions
  isFunction(expenses.connect)
  isFunction(expenses.disconnect)
  isFunction(expenses.putExpense)
  isFunction(expenses.getExpenses)
  isFunction(expenses.putIncome)
  isFunction(expenses.getIncome)

  // Private functions
  isFunction(expenses._onConnect)
  isFunction(expenses._onDisconnect)
  isFunction(expenses._onError)
}

module.exports = {
  spec
}
