/**
 * What timezone should dates be parsed using?
 * @param {string} timezone https://momentjs.com/timezone/docs
 */
module.exports = function (timezone) {
  const moment = require('moment-timezone')

  const isUndefined = require('lodash/isUndefined')

  /**
   * Casts a string to a number if it's a currency.
   * @param {string} value
   * @returns {number}
   * @example
   * parseCurrency('$100.55')
   * // => 100.55
   *
   * parseCurrency('($100.55)')
   * // => -100.55
   *
   * parseCurrency('-$100.55')
   * // => -100.55
   */
  function parseCurrency (value) {
    const accounting = /^\(|\)$/
    if (accounting.test(value)) {
          // '($100.55)' -> '-($100.55)'
      value = '-' + value
    }
      // '-($100.55)' -> '-100.55'
    value = value.replace(/[^-\d.]/g, '')
      // '-100.55' -> -100.55
    return Number(value)
  }

  /**
   * Returns a unix timestamp in seconds of date represented as a string.
   * @param {string} value
   * @returns {number}
   */
  function parseDate (value) {
    // February 03, 2017
    return moment.tz(value, 'MMMM DD, YYYY', timezone).format('X')
  }

  /**
   * Requires: `eun-filter-fieldset`
   */
  function creditWithdrawal (value) {
    const fields = [
      'Account',
      'Purchase Amount',
      'Transaction Date',
      'Transaction Description',
      'Available credit'
    ]
    for (let field of fields) {
      if (isUndefined(value[field])) {
        return false
      }
    }
    const result = {
      account: value.Account,
      amount: -parseCurrency(value['Purchase Amount']),
      currency: 'CAD',
      timestamp: parseDate(value['Transaction Date']),
      description: value['Transaction Description'],
      availableCredit: parseCurrency(value['Available credit'])
    }
    return result
  }

  /**
   * Requires: `eun-filter-fieldset`
   */
  function creditDeposit (value) {
    const fields = [
      'Account',
      'Payment Amount',
      'Transaction Date',
      'Available credit'
    ]
    for (let field of fields) {
      if (isUndefined(value[field])) {
        return false
      }
    }
    const result = {
      account: value.Account,
      amount: parseCurrency(value['Payment Amount']),
      currency: 'CAD',
      timestamp: parseDate(value['Transaction Date']),
      availableCredit: parseCurrency(value['Available credit'])
    }
    return result
  }

  /**
   * Requires: `eun-filter-fieldset`
   */
  function chequingWithdrawal (value) {
    const fields = [
      'Account',
      'Withdrawal Amount',
      'Transaction Date',
      'Transaction Description'
    ]
    for (let field of fields) {
      if (isUndefined(value[field])) {
        return false
      }
    }
    const result = {
      account: value.Account,
      amount: -parseCurrency(value['Withdrawal Amount']),
      currency: 'CAD',
      timestamp: parseDate(value['Transaction Date']),
      description: value['Transaction Description']
    }
    return result
  }

  /**
   * Requires: `eun-filter-fieldset`
   */
  function chequingDeposit (value) {
    const fields = [
      'Account',
      'Deposit Amount',
      'Transaction Date',
      'Transaction Description'
    ]
    for (let field of fields) {
      if (isUndefined(value[field])) {
        return false
      }
    }
    const result = {
      account: value.Account,
      amount: parseCurrency(value['Deposit Amount']),
      currency: 'CAD',
      timestamp: parseDate(value['Transaction Date']),
      description: value['Transaction Description']
    }
    return result
  }

  return {
    creditWithdrawal,
    creditDeposit,
    chequingWithdrawal,
    chequingDeposit
  }
}
