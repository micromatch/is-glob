module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': 'off'
  }
}
