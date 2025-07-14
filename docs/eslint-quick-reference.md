# ESLint Quick Reference

## 🚀 Quick Commands

```bash
npm run lint          # Check all files
npm run lint:fix      # Auto-fix issues
npx eslint src/       # Lint specific directory
npx eslint file.js    # Lint specific file
```

## ✅ Code Style Quick Reference

### Functions

```javascript
// ✅ DO
function getData() {}
const arrow = () => {};

// ❌ DON'T
function getData() {}
```

### Strings & Semicolons

```javascript
// ✅ DO
const msg = 'Hello';
const data = { name: 'John' };

// ❌ DON'T
const msg = 'Hello';
const data = { name: 'John' };
```

### Objects & Arrays

```javascript
// ✅ DO
const user = { name: 'John', age: 30 };
const items = [1, 2, 3];

// ❌ DON'T
const user = { name: 'John', age: 30 };
const items = [1, 2, 3];
```

### Control Flow

```javascript
// ✅ DO
if (condition) {
  doSomething();
}

// ❌ DON'T
if (condition) doSomething();
```

### Variables

```javascript
// ✅ DO
const API_URL = 'https://api.com';
let counter = 0;

// ❌ DON'T
var API_URL = 'https://api.com';
let name = 'John'; // Use const if never changed
```

## 🔧 Rule Overrides

### Single Line

```javascript
const debug = console.log; // eslint-disable-line no-console
```

### Next Line

```javascript
// eslint-disable-next-line no-console
console.log('Debug');
```

### Block

```javascript
/* eslint-disable no-console */
console.log('Debug 1');
console.log('Debug 2');
/* eslint-enable no-console */
```

### Entire File

```javascript
/* eslint-disable no-console */
```

## 📊 Rule Categories

| Category      | Rules                                                 | Purpose               |
| ------------- | ----------------------------------------------------- | --------------------- |
| **Style**     | `indent`, `quotes`, `semi`                            | Consistent formatting |
| **Quality**   | `no-unused-vars`, `no-undef`                          | Catch bugs            |
| **Modern JS** | `no-var`, `prefer-const`                              | Use modern syntax     |
| **Spacing**   | `space-before-function-paren`, `object-curly-spacing` | Readable code         |

## 🎯 Environment Rules

| Environment     | Console | Debugger | Notes                   |
| --------------- | ------- | -------- | ----------------------- |
| **Development** | Warning | Warning  | Allowed for debugging   |
| **Production**  | Error   | Error    | Not allowed             |
| **Tests**       | Off     | Warning  | Console.log OK in tests |

## 🔍 Common Fixes

### Function Spacing

```diff
- function getData () {
+ function getData() {
```

### Object Spacing

```diff
- const user = {name: 'John'};
+ const user = { name: 'John' };
```

### Variable Declaration

```diff
- var data = 'test';
+ const data = 'test';
```

### String Quotes

```diff
- const message = "Hello";
+ const message = 'Hello';
```

### Missing Semicolons

```diff
- const result = getData()
+ const result = getData();
```

## 🚨 Critical Rules (Always Fix)

1. **no-undef** - Undeclared variables
2. **no-unused-vars** - Unused variables (except req, res, next)
3. **curly** - Always use braces
4. **semi** - Always use semicolons
5. **quotes** - Consistent quote style

## 💡 Pro Tips

- Use `--fix` flag to auto-correct most issues
- Set up IDE integration for real-time feedback
- Run ESLint before committing code
- Test files allow `console.log` statements
- Express middleware params (req, res, next) can be unused

## 🔗 Quick Links

- [Full ESLint Guide](./eslint-guide.md)
- [Project Setup](./setup.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
