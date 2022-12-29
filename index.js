/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
const strictCheck = require('./utils/strictCheck')
const relaxedCheck = require('./utils/relaxedCheck')
const isExtglob = require('./utils/isExtGlob')

module.exports = function isGlob(str, options) {
  // should be false if the value is not a string
  if (typeof str !== 'string' || str === '') {
    return false
  }

  // should be true if it has an extglob
  if (isExtglob(str)) {
    return true
  }

  let check = strictCheck

  // options.strict it's false
  if (options && options.strict === false) {
    check = relaxedCheck
  }

  return check(str)
}
