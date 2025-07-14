module.exports = {
  extends: ['./.eslintrc.js', 'plugin:security/recommended'],
  plugins: ['security'],
  rules: {
    // Security-specific rules
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-object-injection': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',

    // Additional security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Prevent dangerous globals
    'no-restricted-globals': [
      'error',
      {
        name: 'eval',
        message: 'eval() is dangerous and should not be used.'
      },
      {
        name: 'execScript',
        message: 'execScript() is dangerous and should not be used.'
      }
    ],

    // Prevent dangerous imports
    'no-restricted-modules': [
      'error',
      {
        patterns: ['child_process', 'fs']
      }
    ]
  },
  env: {
    node: true,
    es6: true
  }
};
