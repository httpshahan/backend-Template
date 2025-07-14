# Backend Template

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16%20%7C%2018%20%7C%2020-brightgreen.svg)](https://nodejs.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red.svg)](https://github.com/httpshahan/backend-Template)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

An **open-source**, professional, production-ready Node.js backend template with Express, Sequelize, and MySQL. Built for public use and community contributions, following modern development practices with Git Flow workflow.

## 🌟 Open Source & Community-Driven

This template is **completely free** and **open source** under the MIT License:

- ✅ **Free to use** - Personal and commercial projects
- ✅ **Free to modify** - Customize for your needs
- ✅ **Free to distribute** - Share with your team
- 🤝 **Community contributions welcome** - Help make it better
- 📚 **Comprehensive documentation** - Easy to understand and extend

## 🌟 Key Features

- 🚀 **Express.js** - Fast, unopinionated web framework with security middleware
- 🗄️ **Sequelize ORM** - Modern JavaScript ORM with MySQL support
- 🔐 **Authentication** - Complete JWT-based authentication system
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Validation** - Request validation with Joi and express-validator
- 📝 **Logging** - Winston logger with different levels and file rotation
- 🧪 **Testing** - Comprehensive Jest testing with Supertest and coverage
- 📊 **Code Quality** - ESLint, Prettier, and automated formatting
- � **Git Flow** - Main/develop branch workflow with automated scripts
- ⚙️ **JSON Configuration** - Modern config.json system (no .env files)
- 🔥 **Nodemon Integration** - Auto-restart development server
- 📁 **Clean Architecture** - Well-organized MVC structure with centralized routing

## 🏗️ Project Structure

```
backend-Template/
├── src/                    # Application source code
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models (Sequelize)
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes + centralized index
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── validators/        # Input validation
│   └── config/            # Configuration loader and utilities
├── docs/                  # Documentation
│   ├── guides/            # Step-by-step guides + Git workflow
│   └── reference/         # Reference documentation
├── scripts/               # Setup and utility scripts
├── tests/                 # API tests and test utilities
│   └── api-tests.http     # REST Client tests for VS Code
├── config.json           # Environment-specific configuration
├── nodemon.json          # Nodemon development configuration
└── uploads/              # File upload directory
```

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <your-repo-url>
   cd backend-Template
   npm install
   ```

2. **Setup Configuration**

   ```bash
   # Generate config.json with secure defaults
   npm run setup:config
   ```

3. **Setup Database**

   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE backend_template_dev;"

   # Run migrations
   npm run db:migrate
   ```

4. **Start Development Server**

   ```bash
   # Start with auto-restart (recommended)
   npm run dev

   # Or start without auto-restart
   npm run start:dev
   ```

5. **Verify Setup**
   ```bash
   curl http://localhost:3000/api
   ```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### 📖 Guides

- **[🚀 Quick Start Guide](docs/guides/quick-start.md)** - Get up and running in 5 minutes
- **[📖 Complete Setup Guide](docs/guides/setup-guide.md)** - Comprehensive setup instructions
- **[� Git Workflow Guide](docs/guides/git-workflow-guide.md)** - Complete Git Flow workflow with main/develop branches
- **[�🔍 ESLint Guide](docs/guides/eslint-guide.md)** - Complete ESLint configuration and best practices
- **[🚫 Git Ignore Guide](docs/guides/git-ignore-guide.md)** - What files to exclude from version control

### 📋 Reference

- **[📋 API Documentation](docs/reference/api-documentation.md)** - Complete API reference with examples
- **[⚡ ESLint Quick Reference](docs/reference/eslint-quick-reference.md)** - ESLint rules cheat sheet
- **[📝 ESLint Setup Summary](docs/reference/eslint-setup-summary.md)** - Quick ESLint configuration summary

### 🎯 Choose Your Path

**New to the project?** Start with the [Quick Start Guide](docs/guides/quick-start.md)

**Setting up for development?** Follow the [Complete Setup Guide](docs/guides/setup-guide.md)

**Using Git workflow?** Check the [Git Workflow Guide](docs/guides/git-workflow-guide.md)

**Code quality and linting?** Check the [ESLint Guide](docs/guides/eslint-guide.md)

**Need API reference?** Check the [API Documentation](docs/reference/api-documentation.md)

## 🛠️ Development

### Prerequisites

- **Node.js** (v16.x, v18.x, or v20.x)
- **MySQL** (v8.0+)
- **npm** (v8.0+)

### Development Commands

```bash
# Development with auto-restart (recommended)
npm run dev              # Start with nodemon - auto-restart on changes
npm run dev:debug        # Start with debugging enabled

# Development without auto-restart
npm run start:dev        # Standard development start
npm run start:prod       # Production-like server locally

# Database operations
npm run db:migrate       # Run database migrations
npm run db:migrate:status # Check migration status
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (development only)

# Code quality
npm run lint             # Check code style with ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run lint:watch       # Run ESLint in watch mode
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Git workflow (see Git Workflow Guide for details)
npm run branch:develop   # Switch to/create develop branch
npm run branch:feature   # Create feature branch from develop
npm run merge:develop    # Merge current branch to develop
npm run merge:main       # Merge develop to main
npm run deploy:staging   # Deploy develop branch
npm run deploy:production # Deploy main branch
```

### Configuration System

The template uses **JSON configuration** instead of environment variables:

- **`config.json`** - Contains environment-specific settings
- **`src/config/configLoader.js`** - Smart configuration loader
- **Automatic setup** - Run `npm run setup:config` to generate secure defaults

```javascript
// Configuration structure
{
  "development": {
    "database": { /* dev database settings */ },
    "jwt": { /* dev JWT settings */ },
    "security": { /* dev security settings */ }
  },
  "production": {
    "database": { /* prod database settings */ },
    "jwt": { /* prod JWT settings */ },
    "security": { /* prod security settings */ }
  }
}
```

### Git Workflow

This template follows **Git Flow** with main/develop branches:

```bash
# Quick workflow commands
npm run branch:develop       # Switch to develop branch
npm run branch:feature feature/my-feature # Create feature branch
npm run merge:develop        # Merge current branch to develop
npm run merge:main          # Merge develop to main

# Deployment
npm run deploy:staging      # Deploy develop branch to staging
npm run deploy:production   # Deploy main branch to production
```

**Branch Strategy:**

- **`main`** - Production environment (stable, release-ready)
- **`develop`** - Development environment (integration branch)
- **`feature/*`** - Feature development branches

See the complete [Git Workflow Guide](docs/guides/git-workflow-guide.md) for detailed workflow instructions.

## 🧪 Testing

The template includes comprehensive testing setup:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and database operations
- **Coverage Reports**: Generated in `coverage/` directory

```bash
# Run specific test file
npm test -- auth.test.js

# Run tests with verbose output
npm test -- --verbose

# Generate coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 📦 API Endpoints

### Main Routes

- `GET /api` - API information and available routes
- `GET /api/health` - Basic health check

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### User Routes (`/api/users`)

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

For complete API documentation, see [API Reference](docs/reference/api-documentation.md).

## ⚙️ Configuration Files

| File             | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `config.json`    | Environment-specific configuration         |
| `nodemon.json`   | Nodemon development configuration          |
| `.eslintrc.js`   | ESLint configuration for code quality      |
| `.prettierrc`    | Prettier configuration for code formatting |
| `jest.config.js` | Jest testing framework configuration       |
| `.sequelizerc`   | Sequelize CLI configuration                |

## 🤝 Contributing

We welcome contributions from the community! This is an open source project and we encourage:

- 🐛 **Bug reports** - Help us identify and fix issues
- 💡 **Feature requests** - Suggest new functionality
- 🔧 **Code contributions** - Submit pull requests
- 📚 **Documentation improvements** - Help make docs better
- 🧪 **Testing** - Add tests and improve coverage

### How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from develop
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request** to the develop branch

### Contribution Guidelines

1. **Code Style**: Follow the ESLint configuration
2. **Testing**: Write tests for new features
3. **Documentation**: Update docs for new features
4. **Git Workflow**: Use the established main/develop branch workflow
5. **Commits**: Use conventional commit messages

```bash
# Before committing
npm run lint:fix     # Fix code style issues
npm run format       # Format code with Prettier
npm test            # Run tests
npm run test:coverage # Check coverage
```

### Development Workflow

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/backend-Template.git
cd backend-Template

# 2. Start from develop branch
npm run branch:develop

# 3. Create feature branch
npm run branch:feature feature/my-new-feature

# 4. Make changes and test
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Check code style

# 5. Commit and push
git add .
git commit -m "feat: add my new feature"
git push origin feature/my-new-feature

# 6. Create Pull Request to develop branch
```

### Community Guidelines

- **Be respectful** and constructive in discussions
- **Search existing issues** before creating new ones
- **Provide clear descriptions** in issues and PRs
- **Help others** in discussions and code reviews
- **Follow the project's coding standards**

## 🚨 Security

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Sequelize ORM protection
- **Rate Limiting** - API endpoint protection
- **CORS Configuration** - Cross-origin request security
- **Security Headers** - Helmet middleware protection
- **JSON Configuration** - Secure configuration management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs directory](docs/) for comprehensive guides
- **Git Workflow**: See the [Git Workflow Guide](docs/guides/git-workflow-guide.md)
- **Issues**: Create an issue for bugs or feature requests
- **Setup Help**: See the [Setup Guide](docs/guides/setup-guide.md)
- **API Questions**: Check the [API Documentation](docs/reference/api-documentation.md)

## ✨ What's New

This template has been modernized with:

- 🔄 **Git Flow Workflow** - Main/develop branch strategy with automated scripts
- ⚙️ **JSON Configuration** - Modern config.json system replacing .env files
- 🔥 **Nodemon Integration** - Auto-restart development server with smart file watching
- 📁 **Centralized Routing** - Organized route management in `src/routes/index.js`
- 📚 **Enhanced Documentation** - Comprehensive guides including Git workflow
- 🧹 **Clean Structure** - Removed CI/CD complexity, focused on development

---

**Ready to start coding?**

```bash
npm run dev
```

Then visit `http://localhost:3000/api` to see your API information! 🚀
