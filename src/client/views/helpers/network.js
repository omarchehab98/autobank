const url = 'http://localhost:3001/v1'
const endpoints = {
  getExpenses: (start, end) => `${url}/expenses/expenses?start=${start}&end=${end}`,
  removeExpense: id => `${url}/expenses/expenses/${id}/delete`,
  getIncome: (start, end) => `${url}/expenses/income?start=${start}&end=${end}`,
  removeIncome: id => `${url}/expenses/income/${id}/delete`
}

const NetworkFacade = {
  getExpenses: function (start, end) {
    const endpoint = endpoints.getExpenses(start, end)
    return window.fetch(endpoint)
      .then(res => res.json())
  },
  removeExpense: function (id) {
    const endpoint = endpoints.removeExpense(id)
    return window.fetch(endpoint)
      .then(res => res.json())
  },
  getIncome: function (start, end) {
    const endpoint = endpoints.getIncome(start, end)
    return window.fetch(endpoint)
      .then(res => res.json())
  },
  removeIncome: function (id) {
    const endpoint = endpoints.removeIncome(id)
    return window.fetch(endpoint)
      .then(res => res.json())
  }
}

export default NetworkFacade
