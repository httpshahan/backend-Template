# Complete Setup Guide for Backend Template

This comprehensive guide will walk you through setting up, configuring, and developing with the Node.js backend template.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [JSON Configuration](#json-configuration)
4. [Database Setup](#database-setup)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Security](#security)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v16.x, v18.x, or v20.x) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v8.0+) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

### Development Tools (Recommended)

- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier
  - REST Client (for testing API endpoints)
- **Postman** or **Insomnia** (for API testing)
- **MySQL Workbench** or **phpMyAdmin** (for database management)

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd backend-Template

# If starting fresh, initialize git
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

### Step 3: Verify Installation

```bash
# Check if all dependencies are installed correctly
npm ls --depth=0

# Run the health check
node healthcheck.js
```

## JSON Configuration

### Step 1: Generate Configuration File

```bash
# Generate secure config.json with auto-generated secrets
npm run setup
```

This creates a `config.json` file with secure, randomly generated secrets and default settings.

### Step 2: Configure Your Settings

Open the generated `config.json` file and update the database and other settings:

```json
{
  "development": {
    "server": {
      "port": 3000,
      "apiVersion": "v1"
    },
    "database": {
      "name": "backend_template_dev",
      "username": "your_db_user",
      "password": "your_db_password",
      "host": "localhost",
      "port": 3306,
      "dialect": "mysql"
    },
    "jwt": {
      "secret": "auto-generated-secure-secret",
      "expiresIn": "7d"
    },
    "email": {
      "host": "smtp.gmail.com",
      "port": 587,
      "user": "your_email@gmail.com",
      "password": "your_app_password"
    },
    "security": {
      "rateLimitWindowMs": 900000,
      "rateLimitMaxRequests": 100,
      "corsOrigins": ["http://localhost:3000", "http://localhost:3001"]
    },
    "logging": {
      "level": "info",
      "fileEnabled": true
    }
  },
  "production": {
    // Similar structure with production-specific values
  }
}
```

**Important Security Notes:**

- The setup script automatically generates secure JWT secrets
- Update database credentials in the appropriate environment section
- Never commit sensitive data to version control
- Use environment-specific configuration sections

### Step 3: Environment-Specific Configuration

The JSON configuration supports multiple environments in a single file:

- `development` - Local development settings
- `staging` - Staging environment settings
- `production` - Production environment settings

Set the `NODE_ENV` environment variable to switch between configurations:

```bash
# Development (default)
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

## Database Setup

### Step 1: Create MySQL Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE backend_template_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional but recommended)
CREATE USER 'backend_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON backend_template_dev.* TO 'backend_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 2: Configure Sequelize

The Sequelize configuration is already set up in `src/config/database.js`. It automatically reads from your environment variables.

### Step 3: Run Migrations

```bash
# Run database migrations
npx sequelize-cli db:migrate

# If you need to undo migrations
npx sequelize-cli db:migrate:undo

# Undo all migrations (be careful!)
npx sequelize-cli db:migrate:undo:all
```

### Step 4: Seed Database (Optional)

```bash
# Run seeders to populate initial data
npx sequelize-cli db:seed:all

# Undo seeders
npx sequelize-cli db:seed:undo:all
```

### Step 5: Verify Database Setup

```bash
# Test database connection
node -e "
const { sequelize } = require('./src/models');
sequelize.authenticate()
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection failed:', err));
"
```

## Development Workflow

### Step 1: Start Development Server

```bash
# Start the development server
npm run dev

# Or with nodemon for auto-restart
npm run start:dev
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Step 2: Verify Server is Running

```bash
# Check health endpoint
curl http://localhost:3000/api/v1/health

# Or open in browser
# http://localhost:3000/api/v1/health
```

### Step 3: Test API Endpoints

Use the provided `api-tests.http` file with VS Code REST Client extension:

1. Open `api-tests.http` in VS Code
2. Click "Send Request" above each HTTP request
3. View responses in the adjacent panel

Or use curl commands:

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

### Step 4: Code Quality Checks

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## Testing

### Step 1: Configure Test Environment

Create a test database:

```sql
CREATE DATABASE backend_template_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON backend_template_test.* TO 'backend_user'@'localhost';
```

Update your `.env.test` file:

```env
NODE_ENV=test
DB_NAME=backend_template_test
```

### Step 2: Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=auth.test.js

# Run tests in verbose mode
npm test -- --verbose
```

### Step 3: Test Coverage

After running tests with coverage, open `coverage/lcov-report/index.html` in your browser to view detailed coverage reports.

### Step 4: Writing Tests

Example test structure:

```javascript
// src/tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('POST /api/v1/auth/register - should register new user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'SecurePass123!'
    };

    const response = await request(app).post('/api/v1/auth/register').send(userData).expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

## Security

### Step 1: Security Testing

Run comprehensive security tests:

```bash
# Run all security tests
npm run security

# Individual security checks
npm run security:audit     # NPM vulnerability audit
npm run security:scan      # ESLint security scan
npm run security:deps      # Check for outdated packages
```

### Step 2: Configuration Security

```bash
# Generate new secure configuration
npm run setup:config

# Validate configuration security
node scripts/validate-config.js
```

### Step 3: Code Security

The template includes security-focused ESLint rules:

```bash
# Run security-focused linting
eslint src/ --config .eslintrc.security.js

# Auto-fix security issues
npm run lint:fix
```

### Step 4: Production Security Checklist

- ✅ Use secure JWT secrets (auto-generated by setup script)
- ✅ Enable rate limiting in production
- ✅ Configure CORS for your domain only
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ✅ Run security tests regularly
- ✅ Monitor for vulnerabilities

## Monitoring and Maintenance

### Step 1: Application Health Checks

The application includes built-in health checks:

- **Basic Health**: `/api/v1/health` - Basic server health
- **Detailed Health**: `/api/v1/health/detailed` - Database and Redis connectivity

### Step 2: Logging

```bash
# View application logs (if LOG_FILE_ENABLED=true)
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# Monitor logs in real-time
npm run logs
```

### Step 3: Performance Monitoring

```javascript
// Built-in performance monitoring endpoints
GET / api / v1 / health / metrics; // Application metrics
GET / api / v1 / health / database; // Database performance
```

### Step 4: Backup Strategies

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u backend_user -p backend_template_prod > backup_$DATE.sql

# Automated backup (add to crontab)
0 2 * * * /path/to/backup_script.sh
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues

**Problem**: `ECONNREFUSED` or connection timeout

**Solutions**:

```bash
# Check database is running
systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Verify connection parameters
mysql -h localhost -u backend_user -p backend_template_dev

# Check Sequelize configuration
node -e "console.log(require('./src/config/database.js'))"
```

#### 2. Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::3000`

**Solutions**:

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Use different port
PORT=3001 npm run dev
```

#### 3. JWT Token Issues

**Problem**: `JsonWebTokenError: invalid token`

**Solutions**:

```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token format in requests
# Should be: Authorization: Bearer <token>

# Clear expired tokens from client storage
```

#### 4. Migration Errors

**Problem**: Migration fails or database schema issues

**Solutions**:

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Undo and retry migration
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate

# Reset database (development only!)
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

#### 5. Configuration Issues

**Problem**: Application fails to start due to configuration errors

**Solutions**:

```bash
# Regenerate configuration with secure defaults
npm run setup:config

# Validate configuration
node scripts/validate-config.js

# Check configuration loading
npm run config:test
```

### Getting Help

1. **Check Application Logs**: Always start by checking the application logs for error details
2. **Database Logs**: Check MySQL logs for database-related issues
3. **Network Issues**: Verify firewall settings and port accessibility
4. **Configuration**: Double-check all config.json settings are correct
5. **Dependencies**: Ensure all required services (MySQL) are running
6. **Security**: Run security tests to identify potential issues

### Performance Optimization

#### 1. Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(createdAt);

-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
```

#### 2. Application Optimization

```javascript
// Use connection pooling
const sequelize = new Sequelize(database, username, password, {
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Implement caching for frequent queries
const Redis = require('redis');
const client = Redis.createClient();

// Cache user data
const getCachedUser = async userId => {
  const cached = await client.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await User.findByPk(userId);
  await client.setEx(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
};
```

#### 3. Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery quick --count 100 --num 10 http://localhost:3000/api/v1/health

# Monitor performance during load
npm run dev & artillery quick --count 50 --num 5 http://localhost:3000/api/v1/health
```

This comprehensive guide covers everything you need to know to set up, develop, and test the backend template locally. For specific questions or issues not covered here, please refer to the individual documentation files in the `docs/` directory or create an issue in the repository.
