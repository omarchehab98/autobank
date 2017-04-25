**eun-filter** is a functional filter in JavaScript.

It is used in scenarios where you have different types of inputs from a
single source and you want to want to operate on them on a case by case basis.

Say for example, you have a function that returns an object `A` or `B` in an
unpredictable manner. You want `A` to get stored in a database while you want
`B` to be emailed somewhere.

> You're better off using an `if` statement if that's your use case for this
> repository.

This filter is useful when there are many different types of inputs from a
single source (for example a mailbox).

You create a filter using an array of functions in queues.

functions must take a single argument and return:

* `false` when the argument does not match the criteria and must not continue
down the queue.

* `true` when the argument matches the criteria and must continue down the
queue with the original value.

* `any` when the argument matches the criteria and must continue down the
queue with the returned value.

## Usage

```js
const Filter = require('eun-filter');

const HumanFilter = [
    isHuman, // returns `true` if `value.brain == 'big'`
    flyToMars // assigns `value.location = 'mars'`
];
const MonkeyFilter = [
    isMonkey, // returns `true` if `value.hairy == 'very'`
    giveCymbal, // assigns `value.equipment = 'cymbal'`
    flyToJapan // assigns `value.location = 'japan'`
];

const options = { lazy: true };
const filters = [ HumanFilter, MonkeyFilter ];
const filter = new Filter(options, filters);

let human = { name: 'John Doe', brain: 'big' };
human = filter(human);
/*
$ human
{
  name: 'John Doe',
  brain: 'big',
  location: 'mars'
}
*/

let monkey = { name: 'Peanut', hairy: 'very' };
monkey = filter(monkey);
/*
$ monkey
{
  name: 'Peanut',
  hairy: 'very',
  equipment: 'cymbal',
  location: 'japan'
}
*/
```

### Options

Defaults:
```js
{
  lazy: true
}
```

#### lazy
When set to `true`, filtering process stops when `value` passes through one
filter.
Does not manipulate `value`, it creates a new clone for every filter.
Returns `false` if `value` failed to pass through all filters.
Returns a copy of `value` after manipulation if passed through a filter.

When set to `false`, filtering process continues even when the value passes a
filter.
You would have to use the manipulated value in the functions of your filters.
Returns `true` if atleast one filter passed.
Returns `false` if no filters passed.
