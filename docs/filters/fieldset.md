**eun-filter-fieldset** is a function that turns

```js
'Name: Omar Chehab\nGitHub: omarchehab98'
```

into

```js
{
  'Name': 'Omar Chehab',
  'GitHub': 'omarchehab98'
}
```


## Usage

Requires:

1. **String Assertion** equivalent to [`lodash/isString`][lodash-isString]

Complements:

* [`eun-filter`][eun-filter]

```js
const filterFieldset = require('eun-filter-fieldset');

const value = 'Name: Omar Chehab\nGitHub: omarchehab98';
filterFieldset(value);
// => { 'Name': 'Omar Chehab', 'GitHub': 'omarchehab98' }

const value = 'This is not a fieldset';
filterFieldset(value);
// => false
```

Requires `value` to be a `string` with atleast one line containing
characters followed by ': ' and then more characters.

Returns an `Object` where the keys and values match that of the fields in
the fieldset.

Returns `false` if the `value` is not a valid fieldset.

### Arguments
* **value (string)**: The value to process.

### Returns
* **(Object|boolean)**: Returns an `Object` on success, `false` on failure.
