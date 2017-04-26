/**
 * Requires `value` to be a `string` with atleast one line containing
 * characters followed by ': ' and then more characters.
 *
 * Returns an `Object` where the keys and values match that of the fields in
 * the fieldset.
 *
 * Returns `false` if the `value` is not a valid fieldset.
 * @param {string} value
 * @returns {(Object|boolean)}
 * @example
 * const value = 'Name: Omar Chehab\nGitHub: omarchehab98';
 * filterFieldset(value);
 * // => { 'Name': 'Omar Chehab', 'GitHub': 'omarchehab98' }
 *
 * const value = 'This is not a fieldset';
 * filterFieldset(value);
 * // => false
 */
function filterFieldset (value) {
    // Matches lines that contain characters followed by ': '
  const fields = value.match(/^[^:\n]+: [^\n]+$/gm)
  if (!Array.isArray(fields)) {
    return false
  }
  const fieldset = {}
  for (let field of fields) {
    field = field.split(': ')
    const key = field[0]
    const value = field[1]
    fieldset[key] = value
  }
  return fieldset
}

module.exports = filterFieldset
