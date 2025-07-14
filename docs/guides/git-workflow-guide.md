# Git Workflow Guide

This project follows a Git Flow branching strategy with two main branches for different environments.

**Repository**: `nodejs-backend-template`

## 📋 Branch Structure

### Main Branches

- **`main`** - Production environment (stable, release-ready code)
- **`develop`** - Development environment (integration branch for features)

### Supporting Branches

- **`feature/*`** - Feature development branches
- **`release/*`** - Release preparation branches
- **`hotfix/*`** - Emergency fixes for production

## 🚀 Environment Configuration

Each branch uses different configuration environments:

- **`main`** → `NODE_ENV=production` → `config.json` production settings
- **`develop`** → `NODE_ENV=development` → `config.json` development settings
- **`test`** → `NODE_ENV=test` → `config.json` test settings

## 🏠 Local Development Setup

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd nodejs-backend-template

# Install dependencies
npm install

# Set up local configuration
npm run setup:config

# Initialize database
npm run db:migrate
npm run db:seed  # Optional: add sample data
```

### Local Environment Commands

```bash
# Start development server (uses develop branch settings)
npm run start:dev

# Start production-like server locally (uses main branch settings)
npm run start:prod

# Watch mode for development (auto-restart with nodemon)
npm run dev

# Watch mode with debugging
npm run dev:debug

# Run tests locally
npm test

# Lint and format code
npm run lint
npm run format
```

### Local Database Management

```bash
# Reset local database (development only)
npm run db:reset

# Create new migration
npx sequelize-cli migration:generate --name your-migration-name

# Run pending migrations
npm run db:migrate

# Check migration status
npm run db:migrate:status

# Rollback last migration (if needed)
npm run db:migrate:undo
```

## 🔄 Workflow Commands

### Quick Branch Operations

```bash
# Switch to develop branch (or create if doesn't exist)
npm run branch:develop

# Create feature branch from develop
npm run branch:feature feature/user-authentication

# Create release branch from develop
npm run branch:release release/v1.2.0
```

### Development Workflow

```bash
# 1. Start new feature (local development)
git checkout develop
git pull origin develop
npm run branch:feature feature/my-new-feature

# 2. Set up local development environment
npm install  # Install any new dependencies
npm run db:migrate  # Run any pending migrations

# 3. Start local development server
npm run start:dev  # Uses develop branch configuration

# 4. Work on feature locally
# ... make changes ...
# ... test in browser/Postman ...

# 5. Run local tests and linting
npm test
npm run lint
npm run format

# 6. Commit changes
git add .
git commit -m "feat: add new feature"

# 7. Push feature branch
git push origin feature/my-new-feature

# 8. Create Pull Request to develop branch
# ... via GitHub/GitLab UI ...

# 9. After PR approval, merge to develop
git checkout develop
git pull origin develop
```

### Local Testing Workflow

```bash
# Test your changes locally before pushing
npm run start:dev        # Start development server
npm test                 # Run unit tests
npm run test:integration # Run integration tests (if available)
npm run lint             # Check code style
npm run format:check     # Check formatting

# Test with different environments locally
NODE_ENV=test npm start     # Test environment
NODE_ENV=production npm start  # Production-like environment
```

### Release Workflow

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
npm run branch:release release/v1.2.0

# 2. Prepare release (update version, changelog, etc.)
npm version minor  # or patch/major
git add .
git commit -m "chore: prepare release v1.2.0"

# 3. Test release branch
npm run test
npm run lint

# 4. Merge to main for production
git checkout main
git pull origin main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# 5. Merge back to develop
git checkout develop
git merge release/v1.2.0
git push origin develop

# 6. Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue
# ... make changes ...
git add .
git commit -m "fix: resolve critical bug"

# 3. Merge to main
git checkout main
git merge hotfix/critical-bug-fix
npm version patch
git tag v1.2.1
git push origin main --tags

# 4. Merge to develop
git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## �️ Development Workflow Scripts

### Branch Management

```bash
# Switch to develop branch (or create if doesn't exist)
npm run branch:develop

# Create feature branch from develop
npm run branch:feature feature-name

# Create release branch from develop
npm run branch:release v1.0.0
```

### Merge Operations

```bash
# Merge current branch to develop
npm run merge:develop

# Merge develop to main (for releases)
npm run merge:main
```

### Database Management

```bash
# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Reset database (undo seeds, migrations, then re-run)
npm run db:reset
```

### Quality Assurance

```bash
# Run linting
npm run lint
npm run lint:fix

# Run tests
npm test
npm run test:coverage

# Run security tests
npm run security
```

## 📝 Commit Message Convention

Follow conventional commits for better changelog generation:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

Examples:

```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API documentation"
```

## 🔄 Branch Protection Rules

### Main Branch Protection

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch

### Develop Branch Protection

- Require pull request reviews
- Require status checks to pass
- Allow force pushes from administrators

## � Security Integration

### GitHub Actions Security Workflow

```yaml
# .github/workflows/security.yml
name: Security Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run security
      - run: npm run lint
      - run: npm run test

  codeql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
      - name: Perform CodeQL Analysis
        run: npm run deploy:production
```

## 🔧 Database Migrations

### Development Environment

```bash
# Create new migration
npx sequelize-cli migration:generate --name create-users-table

# Run migrations
npm run db:migrate

# Check migration status
npm run db:migrate:status

# Rollback last migration
npm run db:migrate:undo

# Reset database (development only)
npm run db:reset
```

### Production Environment

```bash
# Only run migrations, never reset in production
NODE_ENV=production npm run db:migrate
```

## 🏗️ Feature Development Best Practices

### Local Development Guidelines

1. **Always start from develop**: `git checkout develop && git pull origin develop`
2. **Set up clean local environment**: `npm install && npm run db:migrate`
3. **Use descriptive branch names**: `feature/user-authentication`, `fix/payment-validation`
4. **Test locally first**: Run `npm test` and `npm run lint` before pushing
5. **Keep branches small and focused**: One feature per branch
6. **Write tests**: Add tests for new features and bug fixes
7. **Update documentation**: Keep README and API docs current
8. **Follow code style**: Run `npm run format` before committing

### Local Development Environment

```bash
# Recommended local development flow
git checkout develop
git pull origin develop
npm run branch:feature feature/my-feature

# Set up environment
npm install
npm run db:migrate

# Start development
npm run start:dev  # Server runs on http://localhost:3000

# In another terminal - watch for changes with nodemon
npm run dev  # Auto-restart on file changes with nodemon
npm run dev:debug  # Auto-restart with debugging enabled

# Test your changes
npm test
npm run lint

# When ready to commit
git add .
git commit -m "feat: implement my feature"
git push origin feature/my-feature
```

### Local Configuration Management

The project uses `config.json` for environment-specific settings:

```bash
# Development (default for local work)
NODE_ENV=development npm start  # Uses config.json development settings

# Test locally
NODE_ENV=test npm start  # Uses config.json test settings

# Production-like locally
NODE_ENV=production npm start  # Uses config.json production settings
```

### Local Database Setup

```bash
# First time setup
npm run db:create      # Create database
npm run db:migrate     # Run migrations
npm run db:seed        # Add sample data (optional)

# Daily development
npm run db:migrate     # Run any new migrations
npm run db:reset       # Reset database when needed (dev only)

# Check database status
npm run db:migrate:status  # See which migrations have run
```

### Development Tools & Nodemon

#### Nodemon Configuration

The project uses nodemon for automatic server restarts during development:

```bash
# Start development server with nodemon (recommended)
npm run dev          # Watches for file changes and auto-restarts
npm run dev:debug    # Same as above but with debugging enabled

# Manual start (no auto-restart)
npm run start:dev    # Standard development start
```

#### Nodemon Features

- **Auto-restart**: Server automatically restarts when files change
- **File watching**: Monitors `.js`, `.json`, `.ts` files by default
- **Ignore patterns**: Ignores `node_modules`, `logs`, `.git` folders
- **Delay**: 2-second delay before restart to avoid multiple restarts
- **Debugging**: Support for Node.js debugging when using `dev:debug`

#### Nodemon Configuration (nodemon.json)

```json
{
  "watch": ["src", "config.json"],
  "ext": "js,json,ts",
  "ignore": ["node_modules", "logs", "*.log", "coverage"],
  "delay": 2000,
  "env": {
    "NODE_ENV": "development"
  },
  "exec": "node src/server.js"
}
```

#### Development Workflow with Nodemon

```bash
# Terminal 1: Start development server with auto-restart
npm run dev

# Terminal 2: Run tests in watch mode (optional)
npm run test:watch

# Terminal 3: Run linting in watch mode (optional)
npm run lint:watch

# Make changes to your code - server will auto-restart!
# No need to manually stop/start the server
```

## 🚨 Emergency Procedures

### Rollback Production

```bash
# If main branch has issues, rollback to previous tag
git checkout main
git log --oneline --decorate --graph  # Find previous stable tag
git reset --hard v1.2.0  # Replace with actual tag
git push origin main --force-with-lease
```

### Hotfix Deployment

```bash
# For critical production issues
git checkout main
git checkout -b hotfix/urgent-fix
# ... make minimal fix ...
git add . && git commit -m "fix: urgent production issue"
git checkout main && git merge hotfix/urgent-fix
npm version patch && git push origin main --tags
```

### Local Development Issues

#### Common Local Problems

```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Database connection issues
npm run db:migrate:status  # Check database status
npm run db:reset          # Reset database (development only)

# Port already in use
# Kill process using port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm run start:dev

# Environment configuration issues
npm run setup:config      # Regenerate config.json

# Nodemon issues
# Nodemon not restarting on file changes
npm install -g nodemon    # Install/update nodemon globally
npm run dev -- --verbose # Run with verbose output to see what's happening

# Nodemon restarting too frequently
# Check nodemon.json configuration for ignore patterns
# Temporary fix: increase delay
npm run dev -- --delay 5000

# Clear nodemon cache if having issues
npx nodemon --help        # Check nodemon is working
```

#### Local Branch Issues

```bash
# Stuck in merge conflict
git merge --abort         # Cancel merge
git checkout develop      # Switch to safe branch
git pull origin develop   # Get latest changes

# Lost local changes
git stash                 # Save current changes
git checkout develop      # Switch branch
git stash pop             # Restore changes

# Branch out of sync
git checkout feature/my-branch
git rebase develop        # Rebase on latest develop
# Or merge develop into feature branch
git merge develop
```

#### Local Database Issues

```bash
# Database not responding
# Check if database service is running
# Windows: Check MySQL/PostgreSQL service
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Migration issues
npm run db:migrate:undo    # Rollback last migration
npm run db:migrate         # Re-run migrations

# Seed data problems
npm run db:seed:undo:all   # Remove all seed data
npm run db:seed:all        # Re-add seed data
```

## 📊 Monitoring Branch Health

### Regular Maintenance

```bash
# Check branch status
git branch -a
git log --oneline --graph --decorate --all

# Clean up merged branches
git branch --merged develop | grep -v develop | grep -v main | xargs -n 1 git branch -d

# Sync with remote
git fetch --prune
```

### Health Checks

- Ensure `develop` is regularly merged to `main`
- Keep feature branches short-lived (< 1 week)
- Regular code reviews for all pull requests
- Automated testing on all branches

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

**MIT License Summary:**

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ License and copyright notice must be included
- ❗ No warranty provided
