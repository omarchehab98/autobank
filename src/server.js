const Mailbox = require('eun-mailbox');
const filterForExpenses = require('./mail/expenses.js');
// eslint-disable-next-line import/no-unresolved
const credentials = require('./credentials.json');

const mailbox = new Mailbox(credentials.mailbox);
mailbox.on('mail', mail => filterForExpenses(mail.body.text));
