const chars = { '{': '}', '(': ')', '[': ']' }

module.exports = function strictCheck(str) {
  if (str[0] === '!') {
    return true
  }

  let index = 0
  let pipeIndex = -2
  let closeSquareIndex = -2
  let closeCurlyIndex = -2
  let closeParenIndex = -2
  let backSlashIndex = -2

  while (index < str.length) {
    if (str[index] === '*') {
      return true
    }

    if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) {
      return true
    }

    if (
      closeSquareIndex !== -1 &&
      str[index] === '[' &&
      str[index + 1] !== ']'
    ) {
      if (closeSquareIndex < index) {
        closeSquareIndex = str.indexOf(']', index)
      }
      if (closeSquareIndex > index) {
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true
        }
        backSlashIndex = str.indexOf('\\', index)
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true
        }
      }
    }

    if (
      closeCurlyIndex !== -1 &&
      str[index] === '{' &&
      str[index + 1] !== '}'
    ) {
      closeCurlyIndex = str.indexOf('}', index)
      if (closeCurlyIndex > index) {
        backSlashIndex = str.indexOf('\\', index)
        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
          return true
        }
      }
    }

    if (
      closeParenIndex !== -1 &&
      str[index] === '(' &&
      str[index + 1] === '?' &&
      /[:!=]/.test(str[index + 2]) &&
      str[index + 3] !== ')'
    ) {
      closeParenIndex = str.indexOf(')', index)
      if (closeParenIndex > index) {
        backSlashIndex = str.indexOf('\\', index)
        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
          return true
        }
      }
    }

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) {
        pipeIndex = str.indexOf('|', index)
      }
      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
        closeParenIndex = str.indexOf(')', pipeIndex)
        if (closeParenIndex > pipeIndex) {
          backSlashIndex = str.indexOf('\\', pipeIndex)
          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
            return true
          }
        }
      }
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
