const assert = require('chai').assert
const _ = require('lodash')

/**
 * Tests Mailbox disconnecting from IMAP and then emitting "disconnect".
 */
function testDisconnect (done, mailbox) {
  // Succeeds if "disconnect" is emitted.
  mailbox.on('disconnect', done)
  mailbox.connect()
  mailbox.disconnect()
}

/**
 * Tests Mailbox's emitting "disconnect" if .disconnect() is called when
 * already disconnected.
 */
function testDisconnectingTwice (done, mailbox) {
  let success
  let emissions = 0

  // Success if "disconnect" is called once.
  // Fail if "disconnect" is called more than once.
  mailbox.on('disconnect', () => {
    emissions += 1
    if (emissions === 1) {
      success = _.delay(done, 25)
    } else {
      assert(false, 'should not emit "disconnect" more than once')
      clearTimeout(success)
    }
  })

  mailbox.connect()
  mailbox.disconnect()
  mailbox.disconnect()
}

module.exports = {
  testDisconnect,
  testDisconnectingTwice
}
