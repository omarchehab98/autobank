const assert = require('chai').assert;

const isFieldset = require('../../../src/server/mail/filters/fieldset.js');
const filterRBC = require('../../../src/server/mail/filters/rbc.js');

function testIsCreditWithdrawal () {
  let value = 'Account: ************1234\n' +
    'Purchase Amount: $12.34\n' +
    'Transaction Date: February 20, 2017\n' +
    'Transaction Description: ABCDEFGH\n' +
    'Available credit: $1,234.56';
  value = isFieldset(value);
  value = filterRBC.creditWithdrawal(value);

  assert.isNotFalse(value);
  assert.equal(value.account, '************1234');
  assert.equal(value.amount, -12.34);
  assert.equal(value.currency, 'CAD');
  assert.equal(value.timestamp, 1487566800);
  assert.equal(value.description, 'ABCDEFGH');
  assert.equal(value.availableCredit, 1234.56);
}

function testIsCreditDeposit() {
  let value = 'Account: ************1234\n' +
    'Payment Amount: $123.34\n' +
    'Transaction Date: February 20, 2017\n' +
    'Available credit: $1,234.56';
  value = isFieldset(value);
  value = filterRBC.creditDeposit(value);

  assert.isNotFalse(value);
  assert.equal(value.account, '************1234');
  assert.equal(value.amount, 123.34);
  assert.equal(value.currency, 'CAD');
  assert.equal(value.timestamp, 1487566800);
  assert.equal(value.availableCredit, 1234.56);
}

function testIsChequingWithdrawal() {
  let value = 'Account: ********1234\n' +
    'Withdrawal Amount: $123.45\n' +
    'Transaction Date: February 20, 2017\n' +
    'Transaction Description: ABCDEFGH';
  value = isFieldset(value);
  value = filterRBC.chequingWithdrawal(value);

  assert.isNotFalse(value);
  assert.equal(value.account, '********1234');
  assert.equal(value.amount, -123.45);
  assert.equal(value.currency, 'CAD');
  assert.equal(value.timestamp, 1487566800);
  assert.equal(value.description, 'ABCDEFGH');
}

function testIsChequingDeposit() {
  let value = 'Account: ********1234\n' +
    'Deposit Amount: $123.45\n' +
    'Transaction Date: February 20, 2017\n' +
    'Transaction Description: ABCDEFGH';
  value = isFieldset(value);
  value = filterRBC.chequingDeposit(value);

  assert.isNotFalse(value);
  assert.equal(value.account, '********1234');
  assert.equal(value.amount, 123.45);
  assert.equal(value.currency, 'CAD');
  assert.equal(value.timestamp, 1487566800);
  assert.equal(value.description, 'ABCDEFGH');
}

module.exports = {
  testIsChequingDeposit,
  testIsChequingWithdrawal,
  testIsCreditDeposit,
  testIsCreditWithdrawal
}
