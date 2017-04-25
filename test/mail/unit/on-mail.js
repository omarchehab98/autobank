const assert = require('chai').assert
const _ = require('lodash')

/**
 * Tests Mailbox fetching mail and emitting "mail" when there is new mail.
 */
function testReceiveMail (done, mailbox) {
  // Success if "mail" is emitted.
  mailbox.on('mail', mail => {
    assert.isObject(mail)
    done()
  })

  mailbox.connect()

  const fakeMail = {
    uid: 1,
    flags: ['UNSEEN']
  }

  mailbox._imap.__injectMail(fakeMail)
}

/**
 * Tests Mailbox not emitting "mail" if mail's flags does not match given flag
 * filters.
 */
function testFlagFilters (done, mailbox) {
  // Fail if "mail" is emitted.
  mailbox.on('mail', () => {
    assert(false, 'should not emit "mail"')
  })

  mailbox.connect()

  const fakeMail = {
    uid: 1,
    flags: ['SEEN']
  }

  mailbox._imap.__injectMail(fakeMail)

  _.delay(done, 25)
}

module.exports = {
  testReceiveMail,
  testFlagFilters
}
