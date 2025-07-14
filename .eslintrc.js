module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': 'off', // Allow both Unix and Windows line endings
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next|req|res' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-undef': 'error',
    'no-unused-expressions': 'error',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'eol-last': 'error',
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'comma-spacing': 'error',
    'brace-style': 'error',
    curly: 'error'
  },
  overrides: [
    {
      files: ['src/tests/**/*.js', 'src/**/*.test.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ],
  globals: {
    process: 'readonly'
  }
};
