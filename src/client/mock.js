window.fetch = function (urlString, options) {
  const url = new window.URL(urlString)
  const method = (options.method || 'GET').toUpperCase()
  console.log('Mock', method, url.pathname)
  return mocks[`${method} ${url.pathname}`](url, options)
}

const mocks = {
  'POST /api/v1/authentication/generateToken': function () {
    return makeBody({
      token: 'yourfaketokenfromafakeserver'
    })
  },

  'GET /api/v1/authentication/validateToken': function () {
    return makeBody({
      timestamp: 0
    })
  },

  'GET /api/v1/expenses/expenses': function () {
    return makeBody([{
      account: '4510111122223333',
      amount: -100,
      currency: 'CAD',
      timestamp: 1507100000,
      description: 'Apartment',
      availableCredit: 1830,
      category: 'Accomodation'
    }, {
      account: '4510111122223333',
      amount: -10,
      currency: 'CAD',
      timestamp: 1507990000,
      description: 'Strawberries',
      availableCredit: 1930,
      category: 'Grocery'
    }, {
      account: '4510111122223333',
      amount: -20,
      currency: 'CAD',
      timestamp: 1507900000,
      description: 'Bowling with friends',
      availableCredit: 1940,
      category: 'Leisure'
    }, {
      account: '4510111122223333',
      amount: -20,
      currency: 'CAD',
      timestamp: 1507500000,
      description: 'Haircut',
      availableCredit: 1960,
      category: 'Misc'
    }, {
      account: '4510111122223333',
      amount: -20,
      currency: 'CAD',
      timestamp: 1507000000,
      description: 'Presto',
      availableCredit: 1980,
      category: 'Transportation'
    }])
  },

  'GET /api/v1/expenses/income': function () {
    return makeBody([{
      account: '3333444455556666',
      amount: 1000,
      currency: 'CAD',
      timestamp: 1507991477,
      description: 'Salary',
      category: 'Recurring'
    }])
  }
}

function makeBody (body) {
  return Promise.resolve({
    json: () => Promise.resolve(body)
  })
}
