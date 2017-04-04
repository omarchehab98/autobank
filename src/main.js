const Mailbox = require('eun-mailbox');
const Expenses = require('eun-expenses');
const Filter = require('eun-filter');
const filterFieldset = require('eun-filter-fieldset');
const filterRBC = require('eun-filter-rbc');

// Assertions
const isString = require('lodash/isString');

// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.json');

const expenses = new Expenses(credentials.expenses);

const filter = new Filter({}, [
	[
		isString,
		filterFieldset,
		filterRBC.creditWithdrawal,
		logTranscation,
		expenses.putExpense
	], [
		isString,
		filterFieldset,
		filterRBC.creditDeposit,
		logTranscation,
		expenses.putIncome
	], [
		isString,
		filterFieldset,
		filterRBC.chequingWithdrawal,
		logTranscation,
		expenses.putExpense
	], [
		isString,
		filterFieldset,
		filterRBC.chequingDeposit,
		logTranscation,
		expenses.putIncome
	]
]);

const mailbox = new Mailbox(credentials.mailbox);
mailbox.on('mail', mail => filter(mail.body.text));

function logTranscation(transaction) {
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
