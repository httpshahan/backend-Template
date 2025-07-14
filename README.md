# Backend Template

[![CI/CD Pipeline](https://github.com/your-username/backend-template/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-username/backend-template/actions/workflows/ci-cd.yml)
[![Staging Deploy](https://github.com/your-username/backend-template/actions/workflows/staging-deploy.yml/badge.svg)](https://github.com/your-username/backend-template/actions/workflows/staging-deploy.yml)
[![Production Deploy](https://github.com/your-username/backend-template/actions/workflows/render-deploy.yml/badge.svg)](https://github.com/your-username/backend-template/actions/workflows/render-deploy.yml)
[![CodeQL](https://github.com/your-username/backend-template/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/your-username/backend-template/actions/workflows/codeql-analysis.yml)
[![Docker](https://img.shields.io/docker/v/your-username/backend-template?label=docker&color=blue)](https://hub.docker.com/r/your-username/backend-template)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16%20%7C%2018%20%7C%2020-brightgreen.svg)](https://nodejs.org/)

A professional, production-ready Node.js backend template with Express, Sequelize, and MySQL following industry best practices. Features complete CI/CD pipelines, staging/production environments, and comprehensive development workflow.

## 🌟 Key Features

- 🚀 **Express.js** - Fast, unopinionated web framework with security middleware
- 🗄️ **Sequelize ORM** - Modern JavaScript ORM with MySQL/PostgreSQL support
- 🔐 **Authentication** - Complete JWT-based authentication system with refresh tokens
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation, SQL injection prevention
- ✅ **Validation** - Request validation with Joi and express-validator
- 📝 **Logging** - Winston logger with different levels and file rotation
- 🧪 **Testing** - Comprehensive Jest testing with Supertest and coverage reporting
- 📊 **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- 🐳 **Docker** - Multi-stage builds with development and production configurations
- ☸️ **Kubernetes** - Production-ready manifests with Helm charts
- 🔄 **CI/CD** - Complete GitHub Actions pipelines for staging and production
- ☁️ **Cloud Deployment** - Render.com integration with auto-deployment
- 📈 **Monitoring** - Health checks, performance testing, and logging
- 🌿 **Git Workflow** - Professional branching strategy with staging/production environments
- 📁 **Clean Architecture** - Well-organized folder structure following MVC patterns

## 🏗️ Architecture & Deployment

### Environments

| Environment     | Branch      | URL                                   | Purpose           |
| --------------- | ----------- | ------------------------------------- | ----------------- |
| **Development** | `feature/*` | `localhost:3000`                      | Local development |
| **Staging**     | `develop`   | `backend-api-staging.onrender.com`    | QA and testing    |
| **Production**  | `main`      | `backend-api-production.onrender.com` | Live environment  |

### Git Workflow

```mermaid
graph TD
    A[feature/branch] --> B[develop]
    B --> C{Staging Tests}
    C -->|Pass| D[main/master]
    C -->|Fail| B
    D --> E{Production Deploy}
    E -->|Success| F[Live]
    E -->|Rollback| D
```

**Branch Strategy:**

- `main/master` → Production environment (protected)
- `develop` → Staging environment (integration)
- `feature/*` → Feature development
- `hotfix/*` → Emergency production fixes

## 📁 Project Structure

```
backend-template/
├── src/                     # Source code
│   ├── config/             # Configuration files
│   │   ├── database.js     # Database configuration
│   │   ├── auth.js         # Authentication config
│   │   └── logger.js       # Logging configuration
│   ├── controllers/        # Route controllers (business logic)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── healthController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   ├── validation.js   # Request validation
│   │   ├── rateLimiter.js  # Rate limiting
│   │   └── errorHandler.js # Global error handling
│   ├── models/            # Sequelize models
│   │   ├── User.js        # User model
│   │   ├── RefreshToken.js # Token model
│   │   └── index.js       # Model associations
│   ├── routes/            # API route definitions
│   │   ├── auth.js        # Authentication routes
│   │   ├── users.js       # User management routes
│   │   ├── health.js      # Health check routes
│   │   └── index.js       # Route aggregation
│   ├── services/          # Business logic layer
│   │   ├── authService.js # Authentication logic
│   │   ├── userService.js # User management logic
│   │   └── emailService.js # Email handling
│   ├── utils/             # Utility functions
│   │   ├── logger.js      # Winston logger setup
│   │   ├── helpers.js     # Common helpers
│   │   └── constants.js   # Application constants
│   ├── validators/        # Request validators
│   │   ├── authValidator.js
│   │   └── userValidator.js
│   ├── migrations/        # Database migrations
│   │   └── 001-create-users.js
│   ├── seeders/          # Database seeders
│   │   └── demo-users.js
│   └── tests/            # Test files
│       ├── unit/         # Unit tests
│       ├── integration/  # Integration tests
│       └── fixtures/     # Test data
├── .github/              # GitHub Actions
│   ├── workflows/        # CI/CD workflows
│   │   ├── staging-deploy.yml    # Staging deployment
│   │   ├── render-deploy.yml     # Production deployment
│   │   ├── ci-cd.yml            # Main CI/CD pipeline
│   │   └── codeql-analysis.yml  # Security analysis
│   └── dependabot.yml   # Dependency updates
├── k8s/                 # Kubernetes manifests
│   ├── namespace.yaml   # Namespace definition
│   ├── deployment.yaml  # Application deployment
│   ├── service.yaml     # Service definition
│   ├── database.yaml    # Database services
│   ├── redis.yaml       # Redis cache
│   ├── ingress.yaml     # Ingress controller
│   └── secrets.yaml     # Secrets and configs
├── helm/                # Helm charts
│   ├── Chart.yaml       # Chart definition
│   ├── values.yaml      # Default values
│   ├── values-staging.yaml   # Staging values
│   ├── values-production.yaml # Production values
│   └── templates/       # Kubernetes templates
├── scripts/             # Utility scripts
│   ├── setup.sh         # Project setup (Unix)
│   ├── setup.ps1        # Project setup (Windows)
│   ├── deploy.sh        # Deployment script
│   └── backup.sh        # Database backup
├── docs/                # Documentation
│   ├── setup.md         # Setup guide
│   ├── api.md           # API documentation
│   ├── git-workflow.md  # Git workflow guide
│   ├── deployment.md    # Deployment guide
│   └── troubleshooting.md # Common issues
├── render.yaml          # Production Render config
├── render-staging.yaml  # Staging Render config
├── docker-compose.yml   # Local development
├── Dockerfile           # Production container
├── Dockerfile.dev       # Development container
└── .env.example         # Environment template
```

## 🚀 Quick Start

### Automated Setup

**For Windows (PowerShell):**

```powershell
.\scripts\setup.ps1
```

**For Unix/Linux/macOS:**

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This will automatically:

- ✅ Initialize Git repository with proper branching structure
- ✅ Install all dependencies
- ✅ Create environment configuration files
- ✅ Set up development workflow
- ✅ Verify required tools

### Manual Setup

If you prefer manual setup:

## 📋 Prerequisites

- **Node.js** (>= 16.0.0) - [Download](https://nodejs.org/)
- **Database**: MySQL (>= 8.0) or PostgreSQL (>= 12)
- **Package Manager**: npm (comes with Node.js) or yarn
- **Optional**: Docker for containerized development
- MySQL (>= 8.0)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd backend-template
```

2. Install dependencies

```bash
npm install
```

3. Environment setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Database setup

```bash
# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

5. Start the application

```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Required Variables

| Variable     | Description                | Example                        |
| ------------ | -------------------------- | ------------------------------ |
| `NODE_ENV`   | Environment mode           | `development`                  |
| `PORT`       | Server port                | `3000`                         |
| `DB_HOST`    | Database host              | `localhost`                    |
| `DB_PORT`    | Database port              | `3306`                         |
| `DB_NAME`    | Database name              | `backend_template_dev`         |
| `DB_USER`    | Database user              | `root`                         |
| `DB_PASS`    | Database password          | `your_secure_password`         |
| `JWT_SECRET` | JWT secret key (32+ chars) | `your_super_secure_secret_key` |

### Optional Variables

| Variable                  | Description             | Default          |
| ------------------------- | ----------------------- | ---------------- |
| `JWT_EXPIRE`              | JWT token expiration    | `7d`             |
| `REDIS_HOST`              | Redis host              | `localhost`      |
| `REDIS_PORT`              | Redis port              | `6379`           |
| `EMAIL_HOST`              | SMTP host               | `smtp.gmail.com` |
| `EMAIL_USER`              | Email username          | -                |
| `EMAIL_PASS`              | Email password          | -                |
| `CORS_ORIGIN`             | Allowed CORS origins    | `*`              |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | `100`            |
| `LOG_LEVEL`               | Logging level           | `info`           |

### Quick Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Update .env with your values
# Edit DB_USER, DB_PASS, DB_NAME, JWT_SECRET
```

For complete environment configuration, see `.env.example` which includes:

- Database connection pooling
- Email/SMTP settings
- File upload configuration
- Security headers
- Third-party integrations (AWS, Stripe, OAuth)
- Render.com deployment variables

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Database

### Migrations

```bash
# Create migration
npx sequelize-cli migration:generate --name create-users

# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo
```

### Seeders

```bash
# Create seeder
npx sequelize-cli seed:generate --name demo-users

# Run seeders
npm run db:seed

# Undo seeders
npm run db:seed:undo
```

## Deployment

The application is Docker-ready and includes comprehensive CI/CD pipelines for automated deployment.

### 🚀 Quick Deploy to Cloud

#### Render.com (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/backend-template)

- **Free tier available** with managed databases
- **Automatic SSL** and custom domains
- **Zero-downtime deployments**
- **Built-in monitoring** and logging

#### Local Development

##### Docker Compose

```bash
# Start all services (MySQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Kubernetes

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment status
kubectl get pods,services,ingress

# Port forward for local access
kubectl port-forward service/backend-api-service 3000:80
```

#### Helm (Production)

```bash
# Install with Helm
helm install backend-api helm/backend-api

# Upgrade deployment
helm upgrade backend-api helm/backend-api --set image.tag=v1.0.1
```

### CI/CD Pipelines

This template includes production-ready CI/CD pipelines:

#### GitHub Actions (`.github/workflows/`)

- ✅ Code quality checks (ESLint, Prettier)
- 🧪 Automated testing with coverage
- 🔒 Security scanning (CodeQL, Trivy)
- 🐳 Multi-platform Docker builds
- 🚀 Automated deployments to staging/production
- 📈 Performance testing with K6

#### GitLab CI (`.gitlab-ci.yml`)

- 🔄 Multi-stage pipeline (validate → test → build → deploy)
- 🛡️ Comprehensive security scanning (SAST, container, secrets)
- 📊 Code coverage and quality gates
- 🎯 Environment-specific deployments
- 🔄 Automated rollback capabilities

## Documentation

Comprehensive documentation is available in the `docs/` directory:

### 📚 Available Guides

- **[🚀 Quick Start Guide](docs/quick-start.md)** - Get up and running in 5 minutes
- **[📖 Complete Setup Guide](docs/setup-guide.md)** - Comprehensive step-by-step setup instructions
- **[🔄 CI/CD Documentation](docs/cicd.md)** - Detailed CI/CD pipeline configuration
- **[📋 API Documentation](docs/api-documentation.md)** - Complete API reference with examples
- **[☁️ Render Deployment Guide](docs/render-deployment.md)** - Deploy to Render.com with auto-deployment
- **[� Auto-Deployment Guide](docs/auto-deployment-guide.md)** - Automatic deployment setup for production
- **[�🚫 Git Ignore Guide](docs/git-ignore-guide.md)** - What files to never commit to repository

### 🎯 Choose Your Path

**New to the project?** Start with the [Quick Start Guide](docs/quick-start.md)

**Setting up for production?** Follow the [Complete Setup Guide](docs/setup-guide.md)

**Need API reference?** Check the [API Documentation](docs/api-documentation.md)

**Configuring CI/CD?** See the [CI/CD Documentation](docs/cicd.md)

**Deploying to cloud?** Follow the [Render Deployment Guide](docs/render-deployment.md)

**Setting up auto-deployment?** See the [Auto-Deployment Guide](docs/auto-deployment-guide.md)

#### Deployment Options

- **🆓 Render.com**: Free tier with managed databases, auto-deployment
- **🐳 Docker**: Container-ready with Docker Compose
- **☸️ Kubernetes**: Production-ready manifests and Helm charts
- **⚙️ CI/CD**: GitHub Actions and GitLab CI pipelines

#### Deployment Environments

- **Staging**: Auto-deployed from `develop` branch
- **Production**: Manual approval required from `main` branch
- **Features**: Preview environments for pull requests

For detailed CI/CD documentation, see [docs/cicd.md](docs/cicd.md)

### Manual Deployment

#### Docker

```bash
# Build image
docker build -t backend-template .

# Run container
docker run -p 3000:3000 backend-template
```

#### Production Scripts

```bash
# Deploy to staging
ENVIRONMENT=staging ./scripts/deploy.sh

# Deploy to production (requires approval)
ENVIRONMENT=production ./scripts/deploy.sh

# Rollback if needed
./scripts/rollback.sh
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
