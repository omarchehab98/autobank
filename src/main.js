const Mailbox = require('eun-mailbox');
const Expenses = require('eun-expenses');
const Filter = require('eun-filter');
const filterFieldset = require('eun-filter-fieldset');
const filterRBC = require('eun-filter-rbc');

const isString = require('lodash/isString');

const credentials = require('../credentials.json');

const expenses = new Expenses(credentials.expenses);

const filter = new Filter({}, [
	[isString, filterFieldset, filterRBC.creditWithdrawal, logIt, expenses.putExpense],
	[isString, filterFieldset, filterRBC.creditDeposit, logIt, expenses.putIncome],
	[isString, filterFieldset, filterRBC.chequingWithdrawal, logIt, expenses.putExpense],
	[isString, filterFieldset, filterRBC.chequingDeposit, logIt, expenses.putIncome]
]);

const mailbox = new Mailbox(credentials.mailbox);
mailbox.on('mail', mail => filter(mail.body.text));

function logIt(transaction) {
	const date = prettyDate(transaction.timestamp);
	const amount = transaction.amount;
	console.log(date, amount);
	return true;
}

function prettyDate(timestamp) {
	const validTimestamp = Number(timestamp) * 1000;
	return new Date(validTimestamp)
		.toISOString()
		.substring(0, 10);
}
