'use strict'

function Expense (mongoose, db) {
  const expenseSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: {type: String, default: ''},
    availableCredit: Number,
    category: {type: String, default: 'Other'}
  })
  return db.model('Expense', expenseSchema)
}

module.exports = Expense
