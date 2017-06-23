const esc = window.encodeURIComponent

const url = window.eun.apiUrl
const endpoints = {
  generateToken: () => `${url}/authentication/generateToken`,
  validateToken: () => `${url}/authentication/validateToken`,
  getExpenses: (start, end) => `${url}/expenses/expenses?start=${start}&end=${end}`,
  removeExpense: id => `${url}/expenses/expenses/${id}/delete`,
  editExpense: (id) => `${url}/expenses/expenses/${id}/edit`,
  getIncome: (start, end) => `${url}/expenses/income?start=${start}&end=${end}`,
  removeIncome: id => `${url}/expenses/income/${id}/delete`,
  editIncome: (id) => `${url}/expenses/income/${id}/edit`
}

const networkFacade = {
  isAuthenticated: false,

  token: window.localStorage.getItem('token', this.token),

  authenticate (privateKey) {
    const endpoint = endpoints.generateToken()
    return window.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'privateKey=' + esc(privateKey)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.isAuthenticated = false
          this.token = null
          window.localStorage.removeItem('token')
        } else {
          this.isAuthenticated = true
          this.token = res.token
          window.localStorage.setItem('token', this.token)
        }
        return Promise.resolve(res)
      })
  },

  validateToken (token) {
    const endpoint = endpoints.validateToken()
    return window.fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.isAuthenticated = false
          this.token = null
        } else {
          this.isAuthenticated = true
        }
        return Promise.resolve(this.isAuthenticated)
      })
  },

  logout () {
    this.isAuthenticated = false
    this.token = null
    window.localStorage.removeItem('token')
  },

  getExpenses: function (start, end) {
    const endpoint = endpoints.getExpenses(start, end)
    return window.fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => res.json())
  },

  removeExpense: function (id) {
    const endpoint = endpoints.removeExpense(id)
    return window.fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    })
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
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.token
      },
      body: queryString.substr(0, queryString.length - 1)
    })
      .then(res => res.json())
  },

  getIncome: function (start, end) {
    const endpoint = endpoints.getIncome(start, end)
    return window.fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => res.json())
  },

  removeIncome: function (id) {
    const endpoint = endpoints.removeIncome(id)
    return window.fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    })
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
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.token
      },
      body: queryString.substr(0, queryString.length - 1)
    })
      .then(res => res.json())
  }
}

export default networkFacade
