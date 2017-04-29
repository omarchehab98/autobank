'use strict'

function Income (mongoose) {
  const incomeSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: {type: String, default: ''},
    availableCredit: Number,
    category: {type: String, default: 'Other'}
  })
  return mongoose.model('Income', incomeSchema)
}

module.exports = Income
