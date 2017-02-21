const Mailbox = require('eun-mailbox');
const Filter = require('eun-filter');
const filterFieldset = require('eun-filter-fieldset');
const filterRBC = require('eun-filter-rbc');
const isString = require('lodash/isString');
const credentials = require('../credentials.json');

//
const logIt = result => console.log(result);
//

const options = {lazy: true};
const filter = new Filter(options, [
    [isString, filterFieldset, filterRBC.creditWithdrawal, logIt],
    [isString, filterFieldset, filterRBC.creditDeposit, logIt],
    [isString, filterFieldset, filterRBC.chequingWithdrawal, logIt],
    [isString, filterFieldset, filterRBC.chequingDeposit, logIt]
]);

const mailbox = new Mailbox(credentials.mailbox, {markSeen: false});
mailbox.on('mail', mail => filter(mail.body.text));
