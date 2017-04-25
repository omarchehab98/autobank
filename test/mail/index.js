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
    describe('fieldset', function () {
      const tests = require('./unit/filter-fieldset.js')

      msg = 'returns fields in a fieldset'
      it(msg, function () {
        tests.testFilter()
      });

      msg = 'returns false for strings that are not fieldsets'
      it(msg, function () {
        tests.testFalse()
      });
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
