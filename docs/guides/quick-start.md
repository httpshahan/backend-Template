# Quick Start Guide

Get the backend template up and running in 5 minutes!

## Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- Git

## 5-Minute Setu- 📖 **Full documentation**: [Setup Guide](./setup-guide.md)

- 🔍 **ESLint configuration**: [ESLint Guide](./eslint-guide.md)
- 🐛 **Troubleshooting**: Check the [Setup Guide Troubleshooting section](./setup-guide.md#troubleshooting)### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repository-url>
cd backend-Template

# Install dependencies
npm install
```

### 2. Environment Setup (1 minute)

```bash
# Copy environment file
cp .env.example .env

# Generate a secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Edit .env file with your database credentials
# Minimum required changes:
# DB_NAME=backend_template_dev
# DB_USER=your_database_user
# DB_PASS=your_database_password
# JWT_SECRET=<generated_secret_from_above>
```

**Quick .env setup:**

```bash
# Required variables (update these)
NODE_ENV=development
DB_NAME=backend_template_dev
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_32_char_secret_here
```

### 3. Database Setup (1 minute)

```bash
# Create database (run in MySQL)
CREATE DATABASE your_database_name;

# Run migrations
npx sequelize-cli db:migrate

# (Optional) Seed with sample data
npx sequelize-cli db:seed:all
```

### 4. Start Development Server (30 seconds)

```bash
# Start the server
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

# Code formatting
npm run lint
npm run format

# Build for production
npm run build
npm start
```

## Docker Quick Start (Alternative)

If you prefer Docker:

```bash
# Start everything with Docker Compose
docker-compose up

# The API will be available at http://localhost:3000
# MySQL and Redis are included
```

## Need Help?

- 📖 **Full documentation**: [Setup Guide](./setup-guide.md)
- � **ESLint configuration**: [ESLint Guide](./eslint-guide.md)
- 🐛 **Troubleshooting**: Check the [Setup Guide Troubleshooting section](./setup-guide.md#troubleshooting)
- 💬 **Questions**: Create an issue in the repository

## What's Included

This template includes:

- ✅ Express.js REST API with proper error handling
- ✅ JWT Authentication system
- ✅ MySQL database with Sequelize ORM
- ✅ Redis caching support
- ✅ Input validation and security middleware
- ✅ Comprehensive testing setup
- ✅ Docker configurations
- ✅ Code quality tools (ESLint, Prettier)
- ✅ API documentation and testing files

## Getting Help

For advanced setup and configuration, see the [complete setup guide](./setup-guide.md) which covers:

- Environment configuration
- Security best practices
- Testing strategies
- Code quality standards

Happy coding! 🚀
