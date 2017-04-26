const assert = require('chai').assert

const isFieldset = require('../../../src/server/mail/filters/fieldset.js')

/**
 * Tests `isFieldset` being able to match key value pairs in a string.
 */
function testFilter () {
  const value = 'Name: Omar Chehab\nGitHub: omarchehab98'
  const result = isFieldset(value)
  assert.isObject(result)
  assert.equal(result.Name, 'Omar Chehab')
  assert.equal(result.GitHub, 'omarchehab98')
}

/**
 * Tests `isFieldset` returning false if no key value pairs exist in a
 * string.
 */
function testFalse () {
  const value = 'This is not a fieldset'
  const result = isFieldset(value)
  assert.isFalse(result)
}

module.exports = {
  testFilter,
  testFalse
}
