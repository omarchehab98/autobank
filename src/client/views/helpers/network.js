const url = 'http://localhost:3001/v1'
const endpoints = {
  expenses: (start, end) => `${url}/expenses/expenses?start=${start}&end=${end}`,
  income: (start, end) => `${url}/expenses/income?start=${start}&end=${end}`
}

const NetworkFacade = {
  getExpenses: function (start, end) {
    const endpoint = endpoints.expenses(start, end)
    return window.fetch(endpoint)
      .then(res => res.json())
  },
  getIncome: function (start, end) {
    const endpoint = endpoints.income(start, end)
    return window.fetch(endpoint)
      .then(res => res.json())
  }
}

export default NetworkFacade
