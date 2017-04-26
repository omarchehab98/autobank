const assert = require('chai').assert

const isFunction = assert.isFunction
const isBoolean = assert.isBoolean

const Mailbox = require('../../../src/server/mail/mailbox.js')

function spec (mailbox) {
  // Constructor
  isFunction(Mailbox)

  // Public variables
  isBoolean(mailbox.isConnected)

  // Public functions
  isFunction(mailbox.connect)
  isFunction(mailbox.disconnect)

  // Private functions
  isFunction(mailbox._onConnect)
  isFunction(mailbox._onDisconnect)
  isFunction(mailbox._onMailOut)
  isFunction(mailbox._onMailIn)
  isFunction(mailbox._onError)
  isFunction(mailbox._searchForMail)
  isFunction(mailbox._fetchMail)
  isFunction(mailbox._markSeen)
}

module.exports = {
  spec
}
