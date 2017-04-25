const assert = require('chai').assert
const _ = require('lodash')

/**
 * Tests Mailbox connecting to IMAP and then emitting "connect".
 */
function testConnect (done, mailbox) {
  // Succeed if "connect" is emitted.
  mailbox.on('connect', done)

  mailbox.connect()
}

/**
 * Tests Mailbox emitting "error" and not emitting "connect" if IMAP fails to
 * connect.
 */
function testInvalidCredentials (done, mailbox) {
  mailbox._credentials.host = 'imap.invalid.host'

  // Fail if "connect" is emitted.
  mailbox.on('connect', () => {
    assert(false, 'should not connect with invalid host')
  })

  // Succeed if "error" is emitted.
  mailbox.on('error', error => {
    assert.equal(error.textCode, 'AUTHENTICATIONFAILED')
    // Delay success by 25ms to ensure "connect" is not emitted.
    _.delay(done, 25)
  })

  mailbox.connect()
}

/**
 * Tests Mailbox's emitting "connect" if .connect() is called when already
 * connected.
 */
function testConnectingTwice (done, mailbox) {
  let success
  let emissions = 0

  // Success if "connect" is called once.
  // Fail if "connect" is called more than once.
  mailbox.on('connect', () => {
    emissions += 1
    if (emissions === 1) {
      success = _.delay(done, 25)
    } else {
      assert(false, 'should not emit "connect" more than once')
      clearTimeout(success)
    }
  })

  mailbox.connect()
  mailbox.connect()
}

module.exports = {
  testConnect,
  testInvalidCredentials,
  testConnectingTwice
}
