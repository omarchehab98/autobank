'use strict'

function Income (mongoose) {
  const incomeSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: String,
    availableCredit: Number
  })
  return mongoose.model('Income', incomeSchema)
}

module.exports = Income
