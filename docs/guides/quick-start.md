# Quick Start Guide

Get the backend template up and running in 5 minutes!

## Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- Git

## 5-Minute Setup

- 📖 **Full documentation**: [Setup Guide](./setup-guide.md)
- 🔍 **ESLint configuration**: [ESLint Guide](./eslint-guide.md)
- 🐛 **Troubleshooting**: Check the [Setup Guide Troubleshooting section](./setup-guide.md#troubleshooting)

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repository-url>
cd backend-Template

# Install dependencies
npm install
```

### 2. Configuration Setup (1 minute)

```bash
# Generate secure configuration file
npm run setup
```

This creates `config.json` with secure, auto-generated secrets.

### 3. Database Setup (1 minute)

```bash
# Create database (run in MySQL)
CREATE DATABASE backend_template_dev;

# Run migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

**Edit config.json** to update your database credentials:

```json
{
  "development": {
    "database": {
      "name": "backend_template_dev",
      "username": "your_db_user",
      "password": "your_db_password",
      "host": "localhost"
    }
  }
}
```

### 4. Start Development Server (30 seconds)

```bash
# Start the server with nodemon (auto-restart)
npm run dev

# Server will start at http://localhost:3000
```

### 5. Test API (30 seconds)

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Should return: {"status":"OK","timestamp":"..."}
```

## Next Steps

✅ **You're ready to develop!** The API is running at `http://localhost:3000`

### Available Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get profile (requires auth)
- `GET /api/v1/users` - List users (requires auth)

### Test with Sample Data

Use the `api-tests.http` file in VS Code with the REST Client extension, or test with curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Development Commands

```bash
# Development server with auto-reload
npm run dev

# Run tests
npm test
npm run test:coverage

# Code quality
npm run lint
npm run lint:fix
npm run format

# Security testing
npm run security
npm run security:audit

# Git workflow
npm run branch:develop
npm run merge:main

# Database management
npm run db:migrate
npm run db:seed
npm run db:reset
```

## Need Help?

- 📖 **Full documentation**: [Setup Guide](./setup-guide.md)
- 🔍 **ESLint configuration**: [ESLint Guide](./eslint-guide.md)
- 🐛 **Troubleshooting**: Check the [Setup Guide Troubleshooting section](./setup-guide.md#troubleshooting)
- 💬 **Questions**: Create an issue in the repository

## What's Included

This template includes:

- ✅ Express.js REST API with proper error handling
- ✅ JWT Authentication system with refresh tokens
- ✅ MySQL database with Sequelize ORM
- ✅ JSON-based configuration with auto-generated secrets
- ✅ Input validation and security middleware
- ✅ Comprehensive testing setup with Jest
- ✅ Security testing and vulnerability scanning
- ✅ Code quality tools (ESLint, Prettier)
- ✅ Nodemon for development auto-restart
- ✅ Git workflow automation
- ✅ Open source governance (Contributing, Security policies)
- ✅ API documentation and testing files

## Getting Help

For advanced setup and configuration, see the [complete setup guide](./setup-guide.md) which covers:

- JSON configuration system
- Security best practices
- Testing strategies
- Code quality standards
- Git workflow management

Happy coding! 🚀
