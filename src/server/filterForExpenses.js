/**
 * @param {Object} expenses
 */
module.exports = function (expenses) {
  const Filter = require('./mail/filter.js')
  const isString = require('lodash/isString')
  const filterFieldset = require('./mail/filters/fieldset.js')
  const filterRBC = require('./mail/filters/rbc.js')('Canada/Eastern')
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
  return filterForExpenses
}
