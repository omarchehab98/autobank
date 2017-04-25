const Expenses = require('../../src/server/expenses/index.js')

const fakeMongoose = require('./fixtures/mongoose')

var msg
msg = `expenses`
describe(msg, function () {
  let expenses

  beforeEach(function () {
    const credentials = {
      host: 'localhost',
      database: 'eun-test'
    }

    const options = {
      connectOnInit: false
    }

    const dependencies = {
      mongoose: fakeMongoose
    }

    expenses = new Expenses(credentials, options, dependencies)
  })

  afterEach(() => {
    if (expenses.isConnected) {
      expenses.disconnect()
    }
  })

  msg = `spec`
  it(msg, function () {
    const tests = require('./unit/expenses.js')
    tests.spec(expenses)
  })
})
