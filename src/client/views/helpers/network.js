const esc = window.encodeURIComponent

const url = 'http://localhost:3001/v1'
const endpoints = {
  getExpenses: (start, end) => `${url}/expenses/expenses?start=${start}&end=${end}`,
  removeExpense: id => `${url}/expenses/expenses/${id}/delete`,
  editExpense: (id) => `${url}/expenses/expenses/${id}/edit`,
  getIncome: (start, end) => `${url}/expenses/income?start=${start}&end=${end}`,
  removeIncome: id => `${url}/expenses/income/${id}/delete`,
  editIncome: (id) => `${url}/expenses/income/${id}/edit`
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

  editExpense: function (id, changes) {
    const endpoint = endpoints.editExpense(id, changes)
    let queryString = ''
    for (const key in changes) {
      queryString += esc(key) + '=' + esc(changes[key]) + '&'
    }
    return window.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: queryString.substr(0, queryString.length - 1)
    }).then(res => res.json())
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
  },

  editIncome: function (id, changes) {
    const endpoint = endpoints.editIncome(id, changes)
    let queryString = ''
    for (const key in changes) {
      queryString += esc(key) + '=' + esc(changes[key]) + '&'
    }
    return window.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: queryString.substr(0, queryString.length - 1)
    }).then(res => res.json())
  }
}

export default NetworkFacade
