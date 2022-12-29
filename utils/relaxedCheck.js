const chars = { '{': '}', '(': ')', '[': ']' }

module.exports = function relaxedCheck(str) {
  if (str[0] === '!') {
    return true
  }
  let index = 0
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true
    }

    if (str[index] === '\\') {
      const open = str[index + 1]
      index += 2
      const close = chars[open]

      if (close) {
        const n = str.indexOf(close, index)
        if (n !== -1) {
          index = n + 1
        }
      }

      if (str[index] === '!') {
        return true
      }
    } else {
      index++
    }
  }
  return false
}
