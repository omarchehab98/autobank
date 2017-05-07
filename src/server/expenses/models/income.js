'use strict'

function Income (mongoose, db) {
  const incomeSchema = new mongoose.Schema({
    account: String,
    amount: Number,
    currency: String,
    timestamp: Number,
    description: {type: String, default: ''},
    availableCredit: Number,
    category: {type: String, default: 'Other'}
  })
  return db.model('Income', incomeSchema)
}

module.exports = Income
