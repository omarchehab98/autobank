function incomeModel (income) {
  return {
    account: income.account,
    amount: income.amount,
    currency: income.currency,
    timestamp: income.timestamp,
    description: income.description,
    availableCredit: income.availableCredit
  }
}

module.exports = incomeModel
