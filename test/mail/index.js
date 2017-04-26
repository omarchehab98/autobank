const Mailbox = require('../../src/server/mail/mailbox.js')

const fakeIMAP = require('./fixtures/imap.js')
const fakeParseMail = require('./fixtures/parseMail.js')

var msg

let mailbox

msg = `mail`
describe(msg, function () {
  beforeEach(function () {
    const credentials = {
      host: 'imap.gmail.com',
      user: 'omarchehab98@gmail.com',
      password: 'password'
    }

    const options = {
      connectOnInit: false
    }

    const dependencies = {
      IMAP: fakeIMAP,
      parseMail: fakeParseMail
    }

    mailbox = new Mailbox(credentials, options, dependencies)
  })

  afterEach(() => {
    if (mailbox.isConnected) {
      mailbox.disconnect()
    }
  })

  msg = `spec`
  it(msg, function () {
    const tests = require('./unit/mailbox.js')
    tests.spec(mailbox)
  })

  msg = `.connect()`
  describe(msg, function () {
    const tests = require('./unit/on-connect.js')

    msg = `emits "connect"`
    it(msg, function (done) {
      tests.testConnect(done, mailbox)
    })

    msg = `emits "error" when failing to connect with error.textCode:
    "AUTHENTICATIONFAILED"`
    it(msg, function (done) {
      tests.testInvalidCredentials(done, mailbox)
    })

    msg = `emits "connect" once if .connect() is called when already
    connected`
    it(msg, function (done) {
      tests.testConnectingTwice(done, mailbox)
    })
  })

  msg = `.diconnect()`
  describe(msg, function () {
    const tests = require('./unit/on-disconnect.js')

    msg = `emits "disconnect"`
    it(msg, function (done) {
      tests.testDisconnect(done, mailbox)
    })

    msg = `emits "disconnect" once if .disconnect() is called when already
    disconnected`
    it(msg, function (done) {
      tests.testDisconnectingTwice(done, mailbox)
    })
  })

  msg = `mail`
  describe(msg, function () {
    const tests = require('./unit/on-mail.js')

    msg = `emits "mail" when there is new mail`
    it(msg, function (done) {
      tests.testReceiveMail(done, mailbox)
    })

    msg = `does not emit "mail" when flags do not match`
    it(msg, function (done) {
      tests.testFlagFilters(done, mailbox)
    })
  })

  msg = `filters`
  describe(msg, function () {
    msg = 'filter'
    describe(msg, function () {
      const tests = require('./unit/filter.js')

      msg = 'returns false when no filter passes (lazy: true)'
      it(msg, function () {
        tests.testFalseLazy()
      })

      msg = 'returns manipulated value when a filter passes (lazy: true)'
      it(msg, function () {
        tests.testManipulate()
      })

      msg = 'returns false when no filter passes (lazy: false)'
      it(msg, function () {
        tests.testFalse()
      })

      msg = 'returns true when a filter passes (lazy: false)'
      it(msg, function () {
        tests.testManipulateLazy()
      })

      msg = 'does not continue down a filter if a strainer returns false'
      it(msg, function (done) {
        tests.testFalseStrainer(done)
      })

      msg = 'does not manipulate original object'
      it(msg, function (done) {
        tests.testDoesNotMutateOriginal(done)
      })

      msg = 'stops search after a leaf has been reached (lazy: true)'
      it(msg, function (done) {
        tests.testLazyStopsAtFirst(done)
      })

      msg = 'continues search even after a leaf has been reached (lazy: false)'
      it(msg, function (done) {
        tests.testAttemptsAllFilters(done)
      })

      msg = 'passes on strainer return value to next strainer'
      it(msg, function () {
        tests.testStrainerReturnValue()
      })

      msg = 'branching off a manipulator is illegal'
      it(msg, function () {
        tests.testBranchingOffManipulatorError()
      })
    })

    describe('fieldset', function () {
      const tests = require('./unit/filter-fieldset.js')

      msg = 'returns fields in a fieldset'
      it(msg, function () {
        tests.testFilter()
      })

      msg = 'returns false for strings that are not fieldsets'
      it(msg, function () {
        tests.testFalse()
      })
    })

    describe('rbc', function () {
      const tests = require('./unit/filter-rbc.js')

      it('.isCreditWithdrawal()', function () {
        tests.testIsCreditWithdrawal()
      })

      it('.isCreditDeposit()', function () {
        tests.testIsCreditDeposit()
      })

      it('.isChequingWithdrawal()', function () {
        tests.testIsChequingWithdrawal()
      })

      it('.isChequingDeposit()', function () {
        tests.testIsChequingDeposit()
      })
    })
  })
})
