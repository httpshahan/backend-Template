# Git Ignore Guide - What NOT to Push to Repository

This guide explains what files and directories should be ignored when pushing to your repository and why.

## 🚨 Critical Items to NEVER Commit

### 1. Environment Variables and Secrets

```gitignore
# Environment files (NEVER COMMIT THESE)
.env
.env.*
!.env.example          # Keep example file for reference
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging
```

**Why?** Contains sensitive information like:

- Database passwords
- JWT secrets
- API keys
- Email credentials
- Third-party service tokens

**What to do instead:**

- Use `.env.example` with placeholder values
- Document required environment variables
- Use environment variable management
- Use cloud provider secret managers (AWS Secrets Manager, etc.)

### 2. Credentials and Certificates

```gitignore
# Security-related files
credentials.json
secrets.json
localhost.pem
localhost-key.pem
*.p12
*.pfx
*.key
*.crt
```

**Why?** Security certificates and credential files contain sensitive authentication data.

### 3. Database Files and Backups

```gitignore
# Database files
*.sqlite
*.sqlite3
*.db
database.db
*.backup
*.bak
*.sql.gz
*.dump
```

**Why?** May contain sensitive user data and are environment-specific.

## 📦 Dependencies and Generated Files

### 1. Node.js Dependencies

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
```

**Why?**

- `node_modules/` can contain thousands of files
- Generated from `package.json` and lock files
- Platform-specific binaries
- Greatly increases repository size

**What to include instead:**

- `package.json` - dependency definitions
- `package-lock.json` or `yarn.lock` - exact versions

### 2. Build Outputs and Compiled Code

```gitignore
# Build outputs
dist/
build/
out/
.next/
.nuxt/
```

**Why?** Generated from source code during build process.

### 3. Cache Directories

```gitignore
# Cache directories
.cache/
.parcel-cache/
.eslintcache
.webpack/
```

**Why?** Temporary files that improve build performance but are regenerated.

## 📊 Testing and Coverage

### 1. Test Results and Coverage

```gitignore
# Test artifacts
coverage/
*.lcov
.nyc_output/
test-results/
playwright-report/
test-results.xml
```

**Why?** Generated during testing and varies by environment.

**What to do instead:**

- Generate coverage reports locally for development
- Upload coverage to services like Codecov or Coveralls

## 📝 Logs and Runtime Data

### 1. Log Files

```gitignore
# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**Why?**

- Contains runtime information specific to local environment
- Can contain sensitive data
- Grows over time

### 2. Runtime Data

```gitignore
# Runtime data
pids/
*.pid
*.seed
*.pid.lock
```

**Why?** Process-specific data that's meaningless in version control.

## 💻 Development Environment

### 1. IDE and Editor Files

```gitignore
# IDE and Editor files
.vscode/
!.vscode/settings.json    # Keep shared settings
!.vscode/tasks.json       # Keep shared tasks
!.vscode/launch.json      # Keep shared debug config
!.vscode/extensions.json  # Keep recommended extensions
.idea/
*.swp
*.swo
*~
*.sublime-project
*.sublime-workspace
```

**Why?** Personal development environment preferences shouldn't affect others.

**Exception:** Shared project settings that benefit the entire team.

### 2. Operating System Files

```gitignore
# OS generated files
.DS_Store              # macOS
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db           # Windows
Thumbs.db
desktop.ini
```

**Why?** OS-specific metadata files that serve no purpose in the project.

## 📁 User-Generated Content

### 1. File Uploads

```gitignore
# Uploads and user-generated content
uploads/
public/uploads/
storage/
media/
```

**Why?**

- User-uploaded files can be large
- May contain personal/sensitive data
- Should be stored in cloud storage (AWS S3, etc.)

**What to do instead:**

- Use cloud storage services
- Keep only sample/test files if needed
- Document upload directory structure

## 🐳 Docker and Deployment

### 1. Docker Override Files

```gitignore
# Docker
docker-compose.override.yml
```

**Why?** Local development overrides that are specific to individual developers.

**What to include:**

- `Dockerfile` - production container definition
- `docker-compose.yml` - base composition
- `docker-compose.override.example.yml` - example overrides

### 2. Deployment Configuration

```gitignore
# Deployment configuration
deployment-config.json
ecosystem.config.js      # PM2 config with secrets
!ecosystem.config.example.js
```

**Why?** May contain environment-specific secrets or sensitive configuration.

## 🔧 Configuration Guidelines

### What TO Include in Git

```bash
# Configuration files (safe to commit)
package.json              # Dependencies and scripts
package-lock.json         # Exact dependency versions
.gitignore               # This file!
.eslintrc.js             # Code style rules
.prettierrc              # Code formatting rules
jest.config.js           # Test configuration
Dockerfile               # Container definition
docker-compose.yml       # Base container composition
docs/                    # Documentation
README.md                # Project documentation
.env.example             # Environment variable template
```

### What NOT to Include

```bash
# Never commit these
.env                     # Actual environment variables
node_modules/            # Dependencies
logs/                    # Log files
coverage/                # Test coverage reports
uploads/                 # User uploads
*.log                    # Any log files
.DS_Store               # OS files
.vscode/settings.json   # Personal IDE settings
credentials.json        # Any credentials
secrets.json           # Any secrets
```

## 🛠️ Best Practices

### 1. Environment Variables

**❌ Wrong:**

```bash
# .env file committed to git
DB_PASSWORD=mysecretpassword
JWT_SECRET=topsecretkey
```

**✅ Correct:**

```bash
# .env.example file committed to git
DB_PASSWORD=your_database_password_here
JWT_SECRET=your_jwt_secret_key_here

# Actual .env file ignored by git
# Developers copy .env.example to .env and fill in real values
```

### 2. Secrets Management

**For Development:**

- Use `.env` files (ignored by git)
- Use local secret management tools

**For Production:**

- Use cloud secret managers (AWS Secrets Manager, Azure Key Vault)
- Use environment variable management
- Use Kubernetes secrets
- Use cloud provider environment variables

### 3. Large Files

**❌ Avoid committing:**

- Videos, images (use CDN/cloud storage)
- Large datasets (use external storage)
- Binary files (use Git LFS if needed)

**✅ Better approach:**

- Store large files in cloud storage
- Reference them via URLs
- Use placeholder files for development

### 4. Temporary Files

**Common temporary files to ignore:**

```gitignore
# Temporary files
*.tmp
*.temp
*~
.*.sw*
.#*
```

## 🔍 How to Check What You're About to Commit

### Before Pushing, Always Check:

```bash
# See what files are staged for commit
git status

# See what changes are staged
git diff --cached

# See all tracked files
git ls-files

# Check for accidentally staged large files
git diff --cached --stat

# Check for secrets in staged files
git diff --cached | grep -i "password\|secret\|key\|token"
```

### Emergency: Already Committed Secrets?

```bash
# Remove file from git but keep locally
git rm --cached .env
git commit -m "Remove accidentally committed secrets"

# For sensitive data already pushed
# Use git filter-branch or BFG Repo-Cleaner
# Then rotate all exposed secrets immediately
```

## 📋 Pre-Commit Checklist

Before every push:

- [ ] No `.env` files committed
- [ ] No `node_modules/` included
- [ ] No log files included
- [ ] No personal IDE settings committed
- [ ] No credentials or secrets exposed
- [ ] No large binary files added
- [ ] All sensitive data properly ignored
- [ ] `.env.example` updated if new variables added

## 🔧 Tools to Help

### 1. Pre-commit Hooks

```bash
# Install pre-commit hook to check for secrets
npm install --save-dev husky lint-staged

# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for potential secrets
git diff --cached --name-only | xargs grep -l "password\|secret\|key" && echo "⚠️  Potential secrets detected!" && exit 1

npx lint-staged
```

### 2. Secret Scanning Tools

```bash
# GitLeaks - scan for secrets
docker run --rm -v "${PWD}:/path" zricethezav/gitleaks:latest detect --source="/path" -v

# TruffleHog - find secrets
trufflehog git file://. --only-verified
```

### 3. GitHub Secret Scanning

GitHub automatically scans for known secret patterns and alerts you if secrets are detected.

## 🚨 Security Reminder

**Remember:** Once something is committed to git, it exists in the history forever (even if deleted later). Always:

1. **Never commit secrets** - use environment variables
2. **Review changes** before committing
3. **Use secret scanning tools**
4. **Rotate exposed secrets** immediately
5. **Use `.env.example`** for documentation

Following these guidelines will keep your repository clean, secure, and professional! 🛡️
