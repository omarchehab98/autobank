const assert = require('chai').assert
const _ = require('lodash')

const Filter = require('../../../src/server/mail/filter.js')

let foobarFilter
let moopooFilter
let spyOnFoobar
let spyOnMoopoo

foobarFilter = [
  function (value) {
    spyOnFoobar()
    let result
    if (value && value.foo && value.bar) {
      result = value
    } else {
      result = false
    }
    return result
  },
  function (value) {
    spyOnFoobar()
    value.foo = `${value.foo} bar`
    value.bar = `foo ${value.bar}`
    return value
  }
]

moopooFilter = [
  function (value) {
    spyOnMoopoo()
    let result
    if (value && value.moo && value.poo) {
      result = value
    } else {
      result = false
    }
    return result
  },
  function (value) {
    spyOnMoopoo()
    value.moo = 'Hello'
    value.poo = 'World'
    return value
  }
]

// Returns false when no filter passes.
// lazy: true
function testFalseLazy () {
  const options = {
    lazy: true
  }

  const filters = [
    [() => false],
    [() => false],
    [() => false]
  ]

  const filter = new Filter(options, filters)

  const result = filter('foo')
  assert.isFalse(result)
}

// Returns false when no filter passes.
// lazy: true
function testManipulate () {
  const options = {
    lazy: true
  }

  const filters = [
    [() => true, foo => foo + ' bar'],
    [() => true, () => 'Will never be returned because lazy']
  ]

  const filter = new Filter(options, filters)

  const result = filter('foo')
  assert.equal(result, 'foo bar')
}

// Returns false when no filter passes.
// lazy: false
function testFalse () {
  const options = {
    lazy: false
  }

  const filters = [
    [() => false, () => 'manipulatorA'],
    [() => false, () => 'manipulatorB'],
    [() => false, () => 'manipulatorC']
  ]

  const filter = new Filter(options, filters)

  const result = filter('foo')
  assert.isFalse(result)
}

// Returns true when a filter passes. If you want to use the manipulated
// value, add a function to the end of the queue.
// lazy: false
function testManipulateLazy () {
  const options = {
    lazy: false
  }

  const filters = [
    [() => true, () => true, () => true],
    [() => false],
    [() => false]
  ]

  const filter = new Filter(options, filters)

  const result = filter('foo')
  assert.isTrue(result)
}

// Does not call foobar if foobar's first filter does not pass.
// Calls both moopoo's filters because they pass.
function testFalseStrainer (done) {
  let foobarCalls = 0
  spyOnFoobar = function () {
    foobarCalls += 1
    if (foobarCalls === foobarFilter.length) {
      assert(false, 'foobar should fail')
    }
  }

  let moopooCalls = 0
  spyOnMoopoo = function () {
    moopooCalls += 1
    if (moopooCalls === moopooFilter.length) {
      done()
    }
  }

  const options = {
    lazy: false
  }

  const filters = [
    foobarFilter,
    moopooFilter
  ]

  const filter = new Filter(options, filters)

  filter({
    foo: 'foo',
    moo: 'moo',
    poo: 'poo'
  })
}

// If a filter returns true, the value should not be assigned to true.
function testDoesNotMutateOriginal (done) {
  const originalValue = {
    foo: 'foo',
    bar: 'bar'
  }

  spyOnFoobar = function () {}

  let modifiedFoobarFilter = _.clone(foobarFilter)
  modifiedFoobarFilter.unshift(function () {
    return true
  })

  modifiedFoobarFilter.push(function (value) {
    assert.isObject(value)
    assert.equal(value.foo, 'foo bar')
    assert.equal(value.bar, 'foo bar')
    assert.notEqual(value, originalValue)
    done()
  })

  const options = {
    lazy: false
  }

  const filters = [
    modifiedFoobarFilter
  ]

  const filter = new Filter(options, filters)

  filter(originalValue)
}

// Calls both foobar's filters because they pass.
// Does not consider moopoo's filters because lazy mode.
// lazy: true
function testLazyStopsAtFirst (done) {
  let foobarCalls = 0
  spyOnFoobar = function () {
    foobarCalls += 1
    if (foobarCalls === foobarFilter.length) {
      calledLeaf()
    }
  }

  let moopooCalls = 0
  spyOnMoopoo = function () {
    moopooCalls += 1
    if (moopooCalls === moopooFilter.length) {
      calledLeaf()
    }
  }

  let leafCalls = 0
  function calledLeaf () {
    leafCalls += 1
    if (leafCalls === 1) {
      _.delay(done, 25)
    } else {
      assert(false, 'should call only one leaf')
    }
  }

  const options = {
    lazy: true
  }

  const filters = [
    foobarFilter,
    moopooFilter
  ]

  const filter = new Filter(options, filters)

  filter({
    foo: 'foo',
    bar: 'bar',
    moo: 'moo',
    poo: 'poo'
  })
}

// Calls both foobar's filters because they pass.
// Calls both moopoo's filters because they also pass.
// lazy: false
function testAttemptsAllFilters (done) {
  let foobarCalls = 0
  spyOnFoobar = function () {
    foobarCalls += 1
    if (foobarCalls === foobarFilter.length) {
      calledLeaf()
    }
  }

  let moopooCalls = 0
  spyOnMoopoo = function () {
    moopooCalls += 1
    if (moopooCalls === moopooFilter.length) {
      calledLeaf()
    }
  }

  let leafCalls = 0
  function calledLeaf () {
    leafCalls += 1
    if (leafCalls === 1) {
      _.delay(() => {
        assert(false, 'should call two leaves')
      }, 25)
    } else {
      done()
    }
  }

  const options = {
    lazy: false
  }

  const filters = [
    foobarFilter,
    moopooFilter
  ]

  const filter = new Filter(options, filters)

  filter({
    foo: 'foo',
    bar: 'bar',
    moo: 'moo',
    poo: 'poo'
  })
}

function testStrainerReturnValue () {
  const options = {
    lazy: true
  }

  const filters = [
    [
      function () {
        return 0
      },
      function (value) {
        assert.equal(value, 0)
        return value + 6
      },
      function (value) {
        assert.equal(value, 6)
        return value - 3
      },
      function (value) {
        assert.equal(value, 3)
      }
    ]
  ]

  const filter = new Filter(options, filters)
  filter({})
}

function testBranchingOffManipulatorError () {
  const options = {
    lazy: true
  }

  const filters = [
    // Imagine `a`, `b`, `c` are functions.
    ['a', 'b'],
    ['a', 'b', 'c']
  ]

  try {
    const filter = new Filter(options, filters)
    assert(false, 'expected BranchOffManipulatorError')
    filter({}) // ESLint barking at me
  } catch (err) {
    if (err.name !== 'BranchOffManipulatorError') {
      assert(false, 'expected BranchOffManipulatorError')
    }
  }
}

module.exports = {
  testFalseLazy,
  testManipulate,
  testFalse,
  testManipulateLazy,
  testFalseStrainer,
  testDoesNotMutateOriginal,
  testLazyStopsAtFirst,
  testAttemptsAllFilters,
  testStrainerReturnValue,
  testBranchingOffManipulatorError
}
