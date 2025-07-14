# Git Workflow Guide

This document outlines the Git branching strategy and deployment workflow for the Backend Template project.

## Branching Strategy

### Branch Structure

```
main/master (Production)
└── develop (Staging)
    └── feature/feature-name
    └── bugfix/bug-name
    └── hotfix/urgent-fix
```

### Branch Descriptions

- **`main/master`**: Production branch - contains stable, production-ready code
- **`develop`**: Staging branch - integration branch for new features and bug fixes
- **`feature/*`**: Feature branches - for developing new features
- **`bugfix/*`**: Bug fix branches - for fixing non-critical bugs
- **`hotfix/*`**: Hotfix branches - for urgent production fixes

## Deployment Environments

### Staging Environment (develop branch)

- **Branch**: `develop`
- **Deployment**: Automatic on push to develop
- **Purpose**: Testing and QA
- **URL**: `https://backend-api-staging.onrender.com`
- **Database**: `backend_template_staging`
- **Resources**: Smaller instance (free tier)
- **Features**: Debug enabled, API docs enabled

### Production Environment (main branch)

- **Branch**: `main` (or `master`)
- **Deployment**: Automatic on push to main
- **Purpose**: Live production environment
- **URL**: `https://backend-api-production.onrender.com`
- **Database**: `backend_template_prod`
- **Resources**: Standard plan (paid tier)
- **Features**: Debug disabled, API docs disabled

## Workflow Steps

### 1. Feature Development

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/user-authentication

# Make your changes
# ... code development ...

# Commit changes
git add .
git commit -m "feat: implement user authentication with JWT"

# Push feature branch
git push origin feature/user-authentication
```

### 2. Code Review & Testing

```bash
# Create Pull Request from feature/user-authentication to develop
# - Add reviewers
# - Ensure all tests pass
# - Wait for approval

# After approval, merge to develop
git checkout develop
git pull origin develop
```

### 3. Staging Deployment

When code is merged to `develop`:

1. **Automatic deployment** to staging environment
2. **Automated tests** run via GitHub Actions
3. **Health checks** verify deployment
4. **Notifications** sent to team

```bash
# Verify staging deployment
curl https://backend-api-staging.onrender.com/api/v1/health

# Test your feature in staging
# ... manual testing ...
```

### 4. Production Release

When ready for production:

```bash
# Create Pull Request from develop to main
git checkout main
git pull origin main

# Merge develop into main (after approval)
git merge develop
git push origin main
```

### 5. Production Deployment

When code is pushed to `main`:

1. **Automatic deployment** to production environment
2. **Production tests** run via GitHub Actions
3. **Health checks** verify deployment
4. **Slack/Teams notifications** sent
5. **Database migrations** applied automatically

## Emergency Hotfixes

For urgent production fixes:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Make the fix
# ... urgent changes ...

# Commit and push
git commit -m "hotfix: fix critical security vulnerability"
git push origin hotfix/critical-security-fix

# Create PR to main (expedited review)
# After merge, also merge main back to develop
git checkout develop
git merge main
git push origin develop
```

## Environment Variables

### Staging Environment

```env
NODE_ENV=staging
DB_NAME=backend_template_staging
LOG_LEVEL=debug
ENABLE_API_DOCS=true
ENABLE_DEBUG_ROUTES=true
CORS_ORIGIN=https://staging.yourdomain.com
```

### Production Environment

```env
NODE_ENV=production
DB_NAME=backend_template_prod
LOG_LEVEL=warn
ENABLE_API_DOCS=false
ENABLE_DEBUG_ROUTES=false
CORS_ORIGIN=https://app.yourdomain.com
```

## CI/CD Pipeline Features

### Staging Pipeline (develop branch)

- ✅ Lint and code quality checks
- ✅ Unit and integration tests
- ✅ Security vulnerability scanning
- ✅ Build and deploy to staging
- ✅ Health checks and smoke tests
- ✅ Slack notifications

### Production Pipeline (main branch)

- ✅ All staging checks plus:
- ✅ Production environment protection
- ✅ Database migration validation
- ✅ Performance monitoring setup
- ✅ Rollback capabilities
- ✅ Enhanced notifications

## Database Migrations

### Staging

```bash
# Migrations run automatically on deployment
# Check migration status in staging
npm run db:status
```

### Production

```bash
# Migrations run automatically on deployment
# Zero-downtime migrations with health checks
# Automatic rollback on failure
```

## Monitoring & Alerts

### Health Checks

- **Endpoint**: `/api/v1/health`
- **Frequency**: Every 5 minutes
- **Timeout**: 30 seconds

### Alerts

- **Failed deployments**: Immediate Slack notification
- **Health check failures**: Alert after 3 consecutive failures
- **Performance issues**: Monitor response times > 500ms

## Best Practices

### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: improve error handling
test: add integration tests for auth
```

### Pull Requests

- **Title**: Clear, descriptive title
- **Description**: What changed and why
- **Tests**: Ensure all tests pass
- **Reviewers**: At least one team member
- **Labels**: Use appropriate labels (feature, bugfix, hotfix)

### Branch Naming

```
feature/user-authentication
feature/email-notifications
bugfix/login-validation
hotfix/security-patch
```

### Code Quality

- **ESLint**: All code must pass linting
- **Prettier**: Code formatting enforced
- **Tests**: Minimum 80% code coverage
- **Documentation**: Update docs for new features

## Troubleshooting

### Deployment Failures

1. **Check GitHub Actions logs**
2. **Verify environment variables**
3. **Check Render service logs**
4. **Run tests locally**

### Database Issues

1. **Check migration logs**
2. **Verify database connectivity**
3. **Check environment-specific configs**

### Environment Synchronization

```bash
# Sync develop with latest main
git checkout develop
git merge main
git push origin develop

# Update feature branch with latest develop
git checkout feature/my-feature
git merge develop
```

## Team Responsibilities

### Developers

- Create feature branches from develop
- Write tests for new features
- Follow code review process
- Test in staging before production

### Tech Lead

- Review and approve PRs to main
- Monitor production deployments
- Manage hotfix releases

### DevOps

- Maintain CI/CD pipelines
- Monitor infrastructure
- Manage environment configurations

## Getting Started

1. **Clone repository**

```bash
git clone <repository-url>
cd backend-template
```

2. **Setup development environment**

```bash
npm install
cp .env.example .env
# Configure your local environment variables
```

3. **Start development**

```bash
npm run dev
```

4. **Create your first feature**

```bash
git checkout develop
git checkout -b feature/my-awesome-feature
# ... make changes ...
git commit -m "feat: add awesome feature"
git push origin feature/my-awesome-feature
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deployment Guide](https://render.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

**Questions?** Contact the development team or create an issue in the repository.
