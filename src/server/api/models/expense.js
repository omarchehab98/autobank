function expenseModel (expense) {
  return {
    account: expense.account,
    amount: expense.amount,
    currency: expense.currency,
    timestamp: expense.timestamp,
    description: expense.description,
    availableCredit: expense.availableCredit
  }
}

module.exports = expenseModel
