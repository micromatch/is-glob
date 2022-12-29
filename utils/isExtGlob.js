module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false
  }

  let match
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true
    str = str.slice(match.index + match[0].length)
  }

  return false
}
