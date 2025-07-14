# Backend Template

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16%20%7C%2018%20%7C%2020-brightgreen.svg)](https://nodejs.org/)

A professional, production-ready Node.js backend template with Express, Sequelize, and MySQL following industry best practices.

## 🌟 Key Features

- 🚀 **Express.js** - Fast, unopinionated web framework with security middleware
- 🗄️ **Sequelize ORM** - Modern JavaScript ORM with MySQL support
- 🔐 **Authentication** - Complete JWT-based authentication system with refresh tokens
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation, SQL injection prevention
- ✅ **Validation** - Request validation with Joi and express-validator
- 📝 **Logging** - Winston logger with different levels and file rotation
- 🧪 **Testing** - Comprehensive Jest testing with Supertest and coverage reporting
- 📊 **Code Quality** - ESLint, Prettier, and pre-commit hooks
- 🐳 **Docker** - Development environment with Docker Compose
- 📈 **Monitoring** - Health checks and performance monitoring
- 📁 **Clean Architecture** - Well-organized folder structure following MVC patterns

## 🏗️ Project Structure

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
├── tests/                 # API tests and test utilities
│   └── api-tests.http     # REST Client tests for VS Code
└── uploads/               # File upload directory
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
   # Create config.json from example template
   npm run setup

   # Or manually copy the example
   cp config.example.json config.json
   ```

3. **Configure Settings**

   ```bash
   # Edit config.json with your database credentials and other settings
   # The setup script automatically generates secure JWT secrets
   ```

4. **Setup Database**

   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE backend_template_dev;"

   # Run migrations
   npm run db:migrate
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Verify Setup**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### 📖 Guides

- **[🚀 Quick Start Guide](docs/guides/quick-start.md)** - Get up and running in 5 minutes
- **[📖 Complete Setup Guide](docs/guides/setup-guide.md)** - Comprehensive setup instructions
- **[🔍 ESLint Guide](docs/guides/eslint-guide.md)** - Complete ESLint configuration and best practices
- **[🚫 Git Ignore Guide](docs/guides/git-ignore-guide.md)** - What files to exclude from version control

### 📋 Reference

- **[📋 API Documentation](docs/reference/api-documentation.md)** - Complete API reference with examples
- **[⚡ ESLint Quick Reference](docs/reference/eslint-quick-reference.md)** - ESLint rules cheat sheet
- **[📝 ESLint Setup Summary](docs/reference/eslint-setup-summary.md)** - Quick ESLint configuration summary

### 🎯 Choose Your Path

**New to the project?** Start with the [Quick Start Guide](docs/guides/quick-start.md)

**Setting up for development?** Follow the [Complete Setup Guide](docs/guides/setup-guide.md)

**Code quality and linting?** Check the [ESLint Guide](docs/guides/eslint-guide.md)

**Need API reference?** Check the [API Documentation](docs/reference/api-documentation.md)

## 🛠️ Development

### Prerequisites

- **Node.js** (v16.x, v18.x, or v20.x)
- **MySQL** (v8.0+)
- **Redis** (v6.0+) - Optional, for caching
- **Docker** - Optional, for containerized development

### Common Commands

```bash
# Development
npm run dev              # Start development server with auto-restart
npm start               # Start production server

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:reset        # Reset database (drop and recreate)

# Code Quality
npm run lint            # Check code style with ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier

# Testing
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report

# Docker
docker-compose up      # Start all services with Docker
docker-compose down    # Stop all services
```

### Environment Configuration

The template uses environment variables for configuration. Key variables include:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_NAME=backend_template_dev
DB_USER=your_db_user
DB_PASS=your_db_password

# JWT
JWT_SECRET=your_secure_secret_key

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

See `.env.example` for all available configuration options.

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
```

## 🐳 Docker Development

Use Docker Compose for isolated development environment:

```bash
# Start all services (app, MySQL, Redis)
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app npm test
docker-compose exec app npm run db:migrate
```

## 📦 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/change-password` - Change password

### Health

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health check with database status

For complete API documentation, see [API Reference](docs/reference/api-documentation.md).

## 🔧 Configuration Files

| File                 | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `.eslintrc.js`       | ESLint configuration for code quality      |
| `.prettierrc`        | Prettier configuration for code formatting |
| `jest.config.js`     | Jest testing framework configuration       |
| `docker-compose.yml` | Docker development environment             |
| `.sequelizerc`       | Sequelize CLI configuration                |
| `.env.example`       | Environment variables template             |

## 🤝 Contributing

1. **Code Style**: Follow the ESLint configuration
2. **Testing**: Write tests for new features
3. **Documentation**: Update docs for new features
4. **Commits**: Use conventional commit messages

```bash
# Before committing
npm run lint          # Check code style
npm test             # Run tests
npm run test:coverage # Check coverage
```

## 🚨 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- Rate limiting and CORS protection
- Security headers with Helmet
- Environment-based configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs directory](docs/)
- **Issues**: Create an issue for bugs or feature requests
- **Setup Help**: See the [Setup Guide](docs/guides/setup-guide.md)
- **API Questions**: Check the [API Documentation](docs/reference/api-documentation.md)

---

**Ready to start coding?** Run `npm run dev` and visit `http://localhost:3000/api/v1/health` to verify everything is working! 🚀
