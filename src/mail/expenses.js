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
		x => console.log(x) || true,
		expenses.putExpense
	], [
		isString,
		filterFieldset,
		filterRBC.creditDeposit,
		x => console.log(x) || true,
		expenses.putIncome
	], [
		isString,
		filterFieldset,
		filterRBC.chequingWithdrawal,
		x => console.log(x) || true,
		expenses.putExpense
	], [
		isString,
		filterFieldset,
		filterRBC.chequingDeposit,
		x => console.log(x) || true,
		expenses.putIncome
	]
]);

module.exports = filter;
