const defaultTo = require('lodash/defaultTo')
const cloneDeep = require('lodash/cloneDeep')
const isUndefined = require('lodash/isUndefined')
const hasOwnProperty = Object.prototype.hasOwnProperty

class BranchOffManipulatorError extends Error {
  /**
   * This can only be thrown when generating a new filter.
   * @param {Function} f1
   * @param {Function} f2
   */
  constructor (f1, f2) {
    const message = `It is illegal to branch off a manipulator. ` +
      `Avoid defining a filter that is a subset of another filter. ` +
      `Manipulator "${f1.name}"'s filter is a subset of manipulator` +
      `"${f2.name}"'s filter.`
    super(message)
    this.name = 'BranchOffManipulatorError'
    this.message = message
  }
}

class TrieNode {
    /**
     * @param {any} value
     */
  constructor (value) {
    this.children = {}
    this.value = value
  }

  get isLeaf () {
    return Object.keys(this.children).length === 0
  }
}

class Trie {
    /**
     * A regular Trie with an added constraint.
   * It is illegal to branch off a leaf that is not part of the insertion.
     */
  constructor () {
    this.root = new TrieNode(null, false)
  }

    /**
     * @param {any[]} array
     */
  insert (array) {
    let current = this.root
    // `root` is an exception for `currentIsNew`
    let currentIsNew = true
        // Start at the root node.
        // Foreach `value` in `array`.
    for (let i = 0; i < array.length; i++) {
      const value = array[i]
            // If `current` was not just inserted and `current` is a leaf
      if (!currentIsNew && current.isLeaf) {
        // Then `current` is some other filter's manipulator.
                // Branching off a manipulator is illegal due to ambiguity in
        // lazy mode.
        // Not throwing an error will likely cause confusion to the
        // programmer if we are silent about this operation.
        const manipulator = array[array.length - 1]
        throw new BranchOffManipulatorError(current, manipulator)
      }
      currentIsNew = false
            // If `current` is not the parent of `value`
      if (isUndefined(current.children[value])) {
                // Create a new node and make it the child of `current`
        current.children[value] = new TrieNode(value)
        currentIsNew = true
      }
            // Make `current` equal to the newly created node
      current = current.children[value]
    }
  }
}

/**
 * Generates a `filter` function.
 *
 * `filters` is an array of function arrays.
 * All the functions in an array (except for the last) are called strainers.
 *
 * Strainers are used for their truthy or falsy return value. They are allowed
 * to manipulate the `value` passed down to them.
 *
 * The last function in an array is called a manipulator. If it is called, then
 * you have the guarantee that all strainers returned a truthy value.
 *
 * Lazy mode (default) stops the filtering process when a manipulator is
 * reached.
 * @param {Object} [options]
 * @param {boolean} [options.lazy]
 * @param {Object} filters
 * @returns {Function}
 */
function generator (options, filters) {
  options = defaultTo(options, {})

  options = {
    lazy: defaultTo(options.lazy, true)
  }

  const trie = new Trie()
  for (let strainers of filters) {
    trie.insert(strainers)
  }

  return filter.bind(this, options, trie)
}

/**
 * Returns whether or not one of the `filters` has passed.
 *
 * Attempts to pass `value` through all the provided `filters`. If a strainer
 * returns `false`, then the filter fails, no other strainers in that filter
 * are visited.
 * @param {Object} options bind parameter
 * @param {Trie} trie bind parameter
 * @param {any} value
 * @returns {boolean}
 */
function filter (options, trie, value) {
  return depthFirst(options, trie.root, value)
}

/**
 * @param {Object} options
 * @param {TrieNode} current
 * @param {any} value
 * @returns {boolean}
 */
function depthFirst (options, current, value) {
  let filteredAtleastOne = false
  // For each strainer
  for (let i in current.children) {
    if (!hasOwnProperty.call(current.children, i)) {
      return false
    }
    const child = current.children[i]
    const strainer = child.value
    // Clone `value` to preserve its integrity.
    const instance = cloneDeep(value)
    // If the child is a leaf.
    if (child.isLeaf) {
      // Then we have completed our search.
      // Leaf strainers do not make assertions.
      const manipulator = strainer
      const finalValue = manipulator(instance)
      if (options.lazy) {
        return finalValue
      }
      filteredAtleastOne = true
      continue
    }
    // Try to pass `instance` through `strainer`.
    let result = strainer(instance)
    // If `instance` passed through `strainer`.
    if (isAccepted(result)) {
      // Try `instance` on children of current strainer.
      result = result === true ? instance : result
      let found = depthFirst(options, child, result)
      // If a match is found in the children.
      if (found) {
        if (options.lazy) {
          return found
        }
        continue
      }
    }
  }
  return filteredAtleastOne
}

/**
 * Returns true is the value is not undefined, not null, and not false.
 * @param {*} value
 * @returns {boolean}
 */
function isAccepted (value) {
  const isRejected = value === undefined ||
    value === null ||
    value === false
  return !isRejected
}

module.exports = generator
