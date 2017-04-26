'use strict'

function Expense (mongoose) {
  const expenseSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: String,
    availableCredit: Number
  })
  return mongoose.model('Expense', expenseSchema)
}

module.exports = Expense
