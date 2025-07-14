# ESLint Configuration Guide

This document explains the ESLint configuration used in the Backend Template project, including rules, best practices, and how to work with the linter.

## Overview

ESLint is configured to enforce consistent code style and catch potential bugs across the entire codebase. The configuration is defined in `.eslintrc.js` and includes rules for Node.js, ES2021, and Jest testing environments.

## Configuration File

The ESLint configuration is located at the project root: `.eslintrc.js`

## Environment Settings

```javascript
env: {
  node: true,    // Node.js global variables and scoping
  es2021: true,  // ES2021 syntax support
  jest: true     // Jest testing framework globals
}
```

### Supported Environments

- **Node.js**: Server-side JavaScript environment
- **ES2021**: Modern JavaScript features (async/await, optional chaining, etc.)
- **Jest**: Testing framework with global functions like `describe`, `it`, `beforeAll`

## Parser Options

```javascript
parserOptions: {
  ecmaVersion: 'latest',  // Use the latest ECMAScript version
  sourceType: 'module'    // Enable ES6 modules (import/export)
}
```

## Code Style Rules

### Indentation and Spacing

| Rule                          | Setting              | Description                                          |
| ----------------------------- | -------------------- | ---------------------------------------------------- |
| `indent`                      | `['error', 2]`       | Use 2 spaces for indentation                         |
| `linebreak-style`             | `'off'`              | Allow both Unix (LF) and Windows (CRLF) line endings |
| `space-before-function-paren` | `['error', 'never']` | No space before function parentheses                 |
| `keyword-spacing`             | `'error'`            | Require spaces around keywords                       |
| `space-infix-ops`             | `'error'`            | Require spaces around operators                      |
| `comma-spacing`               | `'error'`            | Require spaces after commas                          |

**Examples:**

✅ **Correct:**

```javascript
function getData() {
  const result = a + b;
  return { data, status };
}
```

❌ **Incorrect:**

```javascript
function getData() {
  const result = a + b;
  return { data, status };
}
```

### Quotes and Semicolons

| Rule     | Setting               | Description                   |
| -------- | --------------------- | ----------------------------- |
| `quotes` | `['error', 'single']` | Use single quotes for strings |
| `semi`   | `['error', 'always']` | Always require semicolons     |

**Examples:**

✅ **Correct:**

```javascript
const message = 'Hello World';
const user = { name: 'John' };
```

❌ **Incorrect:**

```javascript
const message = 'Hello World';
const user = { name: 'John' };
```

### Object and Array Formatting

| Rule                    | Setting               | Description                         |
| ----------------------- | --------------------- | ----------------------------------- |
| `object-curly-spacing`  | `['error', 'always']` | Require spaces inside object braces |
| `array-bracket-spacing` | `['error', 'never']`  | No spaces inside array brackets     |
| `comma-dangle`          | `['error', 'never']`  | No trailing commas                  |

**Examples:**

✅ **Correct:**

```javascript
const user = { name: 'John', age: 30 };
const items = [1, 2, 3];
```

❌ **Incorrect:**

```javascript
const user = { name: 'John', age: 30 };
const items = [1, 2, 3];
```

### Control Flow and Braces

| Rule          | Setting   | Description                              |
| ------------- | --------- | ---------------------------------------- |
| `brace-style` | `'error'` | Enforce consistent brace style           |
| `curly`       | `'error'` | Always use braces for control statements |

**Examples:**

✅ **Correct:**

```javascript
if (condition) {
  doSomething();
} else {
  doSomethingElse();
}
```

❌ **Incorrect:**

```javascript
if (condition) doSomething();
else doSomethingElse();
```

## Code Quality Rules

### Variable Declaration

| Rule             | Setting                                              | Description                                            |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| `no-var`         | `'error'`                                            | Disallow `var`, use `let` or `const`                   |
| `prefer-const`   | `'error'`                                            | Prefer `const` for variables that are never reassigned |
| `no-unused-vars` | `['error', { argsIgnorePattern: 'next\|req\|res' }]` | No unused variables (except Express middleware params) |

**Examples:**

✅ **Correct:**

```javascript
const API_URL = 'https://api.example.com';
let counter = 0;

// Express middleware - req, res, next are allowed even if unused
app.get('/users', (req, res, next) => {
  res.json({ users: [] });
});
```

❌ **Incorrect:**

```javascript
var API_URL = 'https://api.example.com'; // Use const instead
let name = 'John'; // Use const if never reassigned
const unusedVariable = 'test'; // Remove if not used
```

### Error Prevention

| Rule                      | Setting   | Description                   |
| ------------------------- | --------- | ----------------------------- |
| `no-undef`                | `'error'` | Disallow undeclared variables |
| `no-unused-expressions`   | `'error'` | Disallow unused expressions   |
| `no-irregular-whitespace` | `'error'` | Disallow irregular whitespace |

### Code Formatting

| Rule                      | Setting                 | Description                       |
| ------------------------- | ----------------------- | --------------------------------- |
| `no-multiple-empty-lines` | `['error', { max: 2 }]` | Maximum 2 consecutive empty lines |
| `eol-last`                | `'error'`               | Require newline at end of file    |

## Environment-Specific Rules

### Development vs Production

```javascript
'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
```

- **Development**: Console statements and debugger are warnings
- **Production**: Console statements and debugger are errors

### Test Files Override

```javascript
overrides: [
  {
    files: ['src/tests/**/*.js', 'src/**/*.test.js'],
    rules: {
      'no-console': 'off' // Allow console.log in test files
    }
  }
];
```

Test files can use `console.log` for debugging without warnings.

## Global Variables

```javascript
globals: {
  process: 'readonly'; // Node.js process global
}
```

## Usage Commands

### Lint All Files

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint:fix
```

### Lint Specific Files

```bash
npx eslint src/controllers/*.js
```

### Lint with Different Formats

```bash
npx eslint src/ --format=table
npx eslint src/ --format=json
```

## IDE Integration

### VS Code

1. Install the ESLint extension
2. Add to VS Code settings (`settings.json`):

```json
{
  "eslint.enable": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": ["javascript"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ

1. Go to `File → Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint`
2. Enable "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

## Common Issues and Solutions

### 1. Line Ending Issues (Windows)

**Problem:** `Expected linebreaks to be 'LF' but found 'CRLF'`

**Solution:** The configuration already handles this with `'linebreak-style': 'off'`

### 2. Unused Variables in Express Middleware

**Problem:** ESLint complains about unused `req`, `res`, `next` parameters

**Solution:** These are automatically ignored by the configuration:

```javascript
'no-unused-vars': ['error', { argsIgnorePattern: 'next|req|res' }]
```

### 3. Console Statements in Tests

**Problem:** ESLint warns about console.log in test files

**Solution:** Console statements are allowed in test files through overrides.

### 4. Function Spacing

**Problem:** `Unexpected space before function parentheses`

**Solution:**

```javascript
// ✅ Correct
function myFunction() {}
const arrow = () => {};

// ❌ Incorrect
function myFunction() {}
const arrow = () => {};
```

## Ignoring Files

Create `.eslintignore` file to exclude files:

```
node_modules/
dist/
build/
coverage/
*.min.js
```

## Custom Rules for Specific Cases

### Disable Rule for One Line

```javascript
const debug = console.log; // eslint-disable-line no-console
```

### Disable Rule for Next Line

```javascript
// eslint-disable-next-line no-console
console.log('Debug message');
```

### Disable Rule for Block

```javascript
/* eslint-disable no-console */
console.log('Debug 1');
console.log('Debug 2');
/* eslint-enable no-console */
```

### Disable Rule for Entire File

```javascript
/* eslint-disable no-console */
// Entire file content
```

## Best Practices

### 1. Run ESLint Before Commits

Set up pre-commit hooks using Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "git add"]
  }
}
```

### 2. Integrate with CI/CD

The project includes ESLint checks in GitHub Actions:

```yaml
- name: Run ESLint
  run: npm run lint
```

### 3. Use ESLint with Prettier

While ESLint handles code quality, Prettier handles formatting:

```bash
npm install --save-dev prettier eslint-config-prettier
```

### 4. Regular Updates

Keep ESLint and rules updated:

```bash
npm update eslint
npx eslint --print-config src/server.js  # Check current config
```

## Team Guidelines

### 1. Consistent Configuration

- All team members should use the same ESLint configuration
- Configuration changes should be discussed and approved by the team
- Use shared IDE settings for consistent experience

### 2. Rule Modifications

- Before disabling rules, understand why they exist
- Prefer fixing code over disabling rules
- Document any custom rule overrides

### 3. Code Reviews

- Check ESLint status in pull requests
- Address linting issues before merging
- Use ESLint output to guide code improvements

## Troubleshooting

### ESLint Not Working

1. Check if ESLint is installed: `npm list eslint`
2. Verify configuration syntax: `npx eslint --print-config src/server.js`
3. Clear cache: `npx eslint --cache-location .eslintcache --fix src/`

### Performance Issues

1. Use `.eslintignore` for large files/directories
2. Enable caching: `npx eslint --cache src/`
3. Run on specific file patterns: `npx eslint src/**/*.js`

### Configuration Conflicts

1. Check for multiple config files
2. Verify rule inheritance from extended configs
3. Use `--print-config` to see final configuration

## Related Tools

- **Prettier**: Code formatting (works alongside ESLint)
- **Husky**: Git hooks for pre-commit linting
- **lint-staged**: Run linters on staged files only
- **ESLint plugins**: Additional rules for specific frameworks

## References

- [ESLint Official Documentation](https://eslint.org/)
- [ESLint Rules Reference](https://eslint.org/docs/rules/)
- [Configuring ESLint](https://eslint.org/docs/user-guide/configuring/)
- [ESLint Shareable Configs](https://eslint.org/docs/developer-guide/shareable-configs)

---

This ESLint configuration ensures consistent, high-quality code across the Backend Template project while providing flexibility for different development environments and use cases.
