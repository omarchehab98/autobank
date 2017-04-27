function expenseModel (expense) {
  return {
    id: expense._id,
    account: expense.account,
    amount: expense.amount,
    currency: expense.currency,
    timestamp: expense.timestamp,
    description: expense.description,
    availableCredit: expense.availableCredit
  }
}

module.exports = expenseModel
