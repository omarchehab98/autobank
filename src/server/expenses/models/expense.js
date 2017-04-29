'use strict'

function Expense (mongoose) {
  const expenseSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: {type: String, default: ''},
    availableCredit: Number,
    category: {type: String, default: 'Other'}
  })
  return mongoose.model('Expense', expenseSchema)
}

module.exports = Expense
