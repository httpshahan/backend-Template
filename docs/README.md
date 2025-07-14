# Backend Template Documentation

Welcome to the Backend Template documentation! This template provides a clean, production-ready Node.js backend with Express, Sequelize, and MySQL.

## 🚀 Getting Started

### Quick Start

- **[Quick Start Guide](guides/quick-start.md)** - Get up and running in 5 minutes
- **[Complete Setup Guide](guides/setup-guide.md)** - Comprehensive setup instructions

### Core Guides

- **[ESLint Configuration Guide](guides/eslint-guide.md)** - Complete ESLint setup and best practices
- **[Configuration Guide](guides/configuration-guide.md)** - JSON-based configuration system
- **[Git Ignore Guide](guides/git-ignore-guide.md)** - What files to exclude from version control

## 📖 Reference Documentation

- **[API Documentation](reference/api-documentation.md)** - Complete API reference with examples
- **[ESLint Quick Reference](reference/eslint-quick-reference.md)** - ESLint rules cheat sheet
- **[ESLint Setup Summary](reference/eslint-setup-summary.md)** - Quick ESLint configuration summary

## 🛠️ Development Tools

- **[ESLint Examples Validation](reference/eslint-examples-validation.js)** - Working code examples for ESLint rules

## 📁 Project Structure

```
backend-Template/
├── src/                    # Application source code
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models (Sequelize)
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── validators/        # Input validation
│   └── config/            # Configuration files
├── docs/                  # Documentation
│   ├── guides/            # Step-by-step guides
│   └── reference/         # Reference documentation
├── scripts/               # Setup and utility scripts
├── tests/                 # Test files
├── uploads/               # File upload directory
└── logs/                  # Application logs
```

## 🎯 Key Features

- **Express.js** - Fast, unopinionated web framework
- **Sequelize ORM** - Modern JavaScript ORM with MySQL support
- **JWT Authentication** - Complete authentication system with refresh tokens
- **Security** - Helmet, CORS, rate limiting, input validation
- **Testing** - Comprehensive Jest testing with Supertest
- **Code Quality** - ESLint and Prettier configuration
- **JSON Configuration** - Modern config.json system with automatic secret generation
- **Nodemon** - Development auto-restart with hot reload
- **Security Testing** - Automated vulnerability scanning
- **Logging** - Winston logger with file rotation
- **Documentation** - Complete API documentation

## 📋 Quick Commands

```bash
# Setup
npm install
npm run setup           # Creates config.json with secure secrets
npm run db:migrate

# Development
npm run dev              # Start development server with nodemon
npm run lint            # Check code quality
npm run lint:fix        # Auto-fix ESLint issues
npm test               # Run tests
npm run test:coverage  # Run tests with coverage

# Security
npm run security        # Run security tests
npm run security:audit  # NPM audit check
npm run security:scan   # ESLint security scan

# Database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:reset       # Reset database

# Git Workflow
npm run branch:develop  # Switch to develop branch
npm run merge:main      # Merge develop to main
```

## 🔧 Configuration

The template uses a JSON-based configuration system. Run `npm run setup` to create `config.json` from the template:

- **Database**: MySQL connection settings
- **JWT**: Authentication secrets (auto-generated)
- **Email**: SMTP settings for notifications
- **Security**: CORS, rate limiting, and security headers
- **Logging**: Log levels and file settings

## 🧪 Testing

The template includes comprehensive testing setup:

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API endpoints and database operations
- **Coverage Reports**: View test coverage in `coverage/` directory
- **Security Tests**: Automated vulnerability scanning

## 🤝 Contributing

1. Follow the ESLint configuration for code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages
5. Run security tests before committing

For detailed contributing guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) for details.

---

**Need help?** Check the specific guide for your task or create an issue in the repository.
