
## Usage

```js
const filterRBC = require('eun-filter-rbc');
const filterFieldset = require('eun-filter-fieldset');

let value = 'Account: ************1234\n' +
  'Payment Amount: $123.34\n' +
  'Transaction Date: February 20, 2017\n' +
  'Available credit: $1,234.56';

value = filterFieldset(value);
filterRBC.creditWithdrawal(value);
// => {
//   account: '************1234',
//   amount: -123.34,
//   currency: 'CAD',
//   date: 1487566800,
//   availableCredit: 1234.56
// }

filterRBC.creditWithdrawal('This is not what the filter expects');
// => false
```


This package is used to filter email alerts from the Royal Bank of Canada.

![RBC Credit Card Transaction Email][rbc-alert-creditcard-transaction]

### Alert Variations

#### `filterRBC.creditWithdrawal`

Mail comes with the subjet 'Large Transaction Warning' for purchase using **Credit Card**

##### Arguments

* **fieldset (Object)**: The `fieldset` to process.

Returns `false` if one if any of these values are `undefined`
* `fieldset['Account']`
* `fieldset['Purchase Amount']`
* `fieldset['Transaction Date']`
* `fieldset['Transaction Description']`
* `fieldset['Available credit']`

Returns `Object` if all the fields are set

##### Returns

* **(Object|boolean)**: Returns an `Object` on success, `false` on failure.

Specification of `Object`:
```js
{
  account: {string},
  amount: {number}, // negative
  currency: {string},
  timestamp: {number},
  description: {string},
  availableCredit: {number}
}
```

#### `filterRBC.creditDeposit`

Mail comes with the subjet 'Payment Made' for payment into **Credit Card**

##### Arguments

* **fieldset (Object)**: The `fieldset` to process.

Returns `false` if one if any of these values are `undefined`
* `fieldset['Account']`
* `fieldset['Payment Amount']`
* `fieldset['Transaction Date']`
* `fieldset['Available credit']`

Returns `Object` if all the fields are set

##### Returns

* **(Object|boolean)**: Returns an `Object` on success, `false` on failure.

Specification of `Object`:
```js
{
  account: {string},
  amount: {number}, // positive
  currency: {string},
  timestamp: {number},
  availableCredit: {number}
}
```

#### `filterRBC.chequingWithdrawal`

Mail comes with the subject 'Large Withdrawal Warning' for withdrawal from **Chequing Account**

##### Arguments

* **fieldset (Object)**: The `fieldset` to process.

Returns `false` if one if any of these values are `undefined`
* `fieldset['Account']`
* `fieldset['Withdrawal Amount']`
* `fieldset['Transaction Date']`
* `fieldset['Transaction Description']`

Returns `Object` if all the fields are set

##### Returns

* **(Object|boolean)**: Returns an `Object` on success, `false` on failure.

Specification of `Object`:
```js
{
  account: {string},
  amount: {number}, // negative
  currency: {string},
  timestamp: {number},
  description: {string}
}
```

#### `filterRBC.chequingDeposit`

Mail comes with the subject 'Large Deposit Notice' for deposit into **Chequing Account**

##### Arguments

* **fieldset (Object)**: The `fieldset` to process.

Returns `false` if one if any of these values are `undefined`
* `fieldset['Account']`
* `fieldset['Deposit Amount']`
* `fieldset['Transaction Date']`
* `fieldset['Transaction Description']`

Returns `Object` if all the fields are set

##### Returns

* **(Object|boolean)**: Returns an `Object` on success, `false` on failure.

Specification of `Object`:
```js
{
  account: {string},
  amount: {number}, // positive
  currency: {string},
  timestamp: {number},
  description: {string}
}
```

[rbc-alert-creditcard-transaction]: https://cloud.githubusercontent.com/assets/12089120/23151493/07caf37c-f7c9-11e6-8db7-5006ddcf4470.png
