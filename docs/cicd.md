# CI/CD Pipeline Documentation

## Overview

This project includes comprehensive CI/CD pipelines for both **GitHub Actions** and **GitLab CI**, along with Kubernetes deployment configurations and Helm charts for production-ready deployments.

## 🚀 CI/CD Features

### GitHub Actions Pipeline (`.github/workflows/`)

- **Code Quality**: ESLint, Prettier, security audits
- **Testing**: Unit tests, integration tests, coverage reports
- **Security**: CodeQL analysis, Trivy container scanning, dependency review
- **Build**: Multi-platform Docker images with caching
- **Deploy**: Automated staging/production deployments
- **Performance**: K6 load testing
- **Monitoring**: Deployment notifications via Slack

### GitLab CI Pipeline (`.gitlab-ci.yml`)

- **Multi-stage Pipeline**: validate → test → build → security → deploy → performance
- **Matrix Testing**: Multiple Node.js versions
- **Security Scanning**: SAST, container scanning, secret detection, license scanning
- **Deployment**: Staging and production environments with manual approval
- **Performance Testing**: K6 integration
- **Rollback**: Manual rollback capabilities

## 📋 Pipeline Stages

### 1. Validation Stage

- **Dependency Installation**: Cache-optimized npm install
- **Code Linting**: ESLint with configurable rules
- **Format Check**: Prettier formatting validation
- **Security Audit**: npm audit with severity thresholds

### 2. Testing Stage

- **Unit Tests**: Jest with coverage reporting
- **Integration Tests**: Full database integration
- **Test Services**: MySQL 8.0 and Redis 7
- **Coverage Reports**: Cobertura format with thresholds

### 3. Build Stage

- **Docker Build**: Multi-platform (AMD64/ARM64)
- **Image Optimization**: Multi-stage builds with caching
- **Registry Push**: GitHub Container Registry / GitLab Registry
- **Image Tagging**: SHA-based and semantic versioning

### 4. Security Stage

- **Container Scanning**: Trivy vulnerability scanner
- **SAST**: Static Application Security Testing
- **Secret Detection**: Prevent credential leaks
- **License Scanning**: Open source license compliance

### 5. Deployment Stage

- **Staging Deployment**: Automated on develop branch
- **Production Deployment**: Manual approval required
- **Health Checks**: Automated service verification
- **Rollback**: One-click rollback capabilities

### 6. Performance Stage

- **Load Testing**: K6 performance tests
- **Metrics Collection**: Response times and error rates
- **Threshold Validation**: Performance SLA enforcement

## 🔧 Configuration

### Environment Variables

#### Required Secrets

```bash
# Database
DB_HOST=your-database-host
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASS=your-database-password

# JWT
JWT_SECRET=your-super-secure-jwt-secret

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# Deployment
STAGING_URL=https://api-staging.yourdomain.com
PRODUCTION_URL=https://api.yourdomain.com
```

#### Optional Secrets

```bash
# Notifications
SLACK_WEBHOOK=your-slack-webhook-url

# Code Coverage
CODECOV_TOKEN=your-codecov-token

# Container Registry
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
```

### GitHub Actions Setup

1. **Enable GitHub Container Registry**:

   ```bash
   # Settings → Packages → Container registry
   ```

2. **Configure Secrets**:

   ```bash
   # Repository → Settings → Secrets and variables → Actions
   ```

3. **Set up Environments**:
   ```bash
   # Repository → Settings → Environments
   # Create: staging, production
   # Configure protection rules and required reviewers
   ```

### GitLab CI Setup

1. **Configure Variables**:

   ```bash
   # Project → Settings → CI/CD → Variables
   ```

2. **Enable Container Registry**:

   ```bash
   # Project → Deploy → Container Registry
   ```

3. **Configure Environments**:
   ```bash
   # Project → Deployments → Environments
   ```

## 🐳 Docker Deployment

### Development

```bash
# Build and run locally
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend npm run db:migrate
```

### Production

```bash
# Pull and deploy
docker-compose -f docker-compose.prod.yml up -d

# Health check
curl -f http://localhost:3000/health
```

## ☸️ Kubernetes Deployment

### Prerequisites

```bash
# Install kubectl
# Install helm (optional)
# Configure kubeconfig
```

### Manual Deployment

```bash
# Apply configurations
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/database.yaml
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods,services,ingress
```

### Automated Deployment

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy to staging
ENVIRONMENT=staging IMAGE_TAG=v1.0.0 ./scripts/deploy.sh

# Deploy to production
ENVIRONMENT=production IMAGE_TAG=v1.0.0 ./scripts/deploy.sh
```

### Helm Deployment

```bash
# Add dependencies
helm repo add bitnami https://charts.bitnami.com/bitnami
helm dependency update helm/backend-api

# Install/upgrade
helm upgrade --install backend-api helm/backend-api \
  --set image.tag=v1.0.0 \
  --set ingress.hosts[0].host=api.yourdomain.com

# Rollback
helm rollback backend-api 1
```

## 🔄 Rollback Procedures

### Docker Compose

```bash
# Quick rollback
docker-compose down
docker-compose up -d

# Specific version
docker-compose pull
docker-compose up -d
```

### Kubernetes

```bash
# Automated rollback
./scripts/rollback.sh

# Manual rollback
kubectl rollout undo deployment/backend-api
kubectl rollout status deployment/backend-api
```

### Helm

```bash
# List releases
helm list

# Rollback to previous
helm rollback backend-api

# Rollback to specific revision
helm rollback backend-api 2
```

## 🔥 Render.com Deployment

### Render Pipeline (`.github/workflows/render-deploy.yml`)

Automated deployment to Render.com cloud platform with the following features:

- **Auto-Deployment**: Deploy on push to main branch
- **Health Checks**: Verify deployment success
- **Zero-Downtime**: Rolling deployments
- **Free Tier**: Deploy for free with managed databases

#### Render Configuration

```yaml
# render.yaml - Infrastructure as Code
services:
  - type: web
    name: backend-api
    env: node
    buildCommand: npm ci --production
    startCommand: npm run render:start
    healthCheckPath: /api/v1/health
    autoDeploy: true

  - type: pserv # PostgreSQL database
    name: mysql-db
    env: docker
    image:
      url: mysql:8.0
```

#### Required Render Secrets

```bash
# GitHub Repository Secrets for Render deployment
RENDER_API_KEY=rnd_your_api_key
RENDER_SERVICE_ID=srv_your_service_id
RENDER_APP_URL=your-app.onrender.com
```

#### Deployment Features

- **Automatic Builds**: Triggered on git push
- **Environment Management**: Staging and production environments
- **Database Migrations**: Automatic migration on deployment
- **SSL Certificates**: Automatic HTTPS with free certificates
- **Custom Domains**: Support for custom domain configuration
- **Monitoring**: Built-in health checks and logging

## 📊 Monitoring and Observability

### Health Checks

- **Endpoint**: `GET /health`
- **Kubernetes**: Liveness and readiness probes
- **Docker**: Health check commands

### Metrics Collection

- **Application**: Winston logging
- **Infrastructure**: Kubernetes metrics
- **Performance**: K6 test results

### Alerting

- **Deployment Failures**: Slack notifications
- **Performance Degradation**: K6 thresholds
- **Security Issues**: Pipeline failures

## 🛡️ Security Best Practices

### Container Security

- **Non-root user**: Application runs as nodejs user
- **Minimal base image**: Alpine Linux
- **Multi-stage builds**: Reduced attack surface
- **Vulnerability scanning**: Trivy integration

### Secrets Management

- **Kubernetes secrets**: Base64 encoded
- **CI/CD variables**: Encrypted at rest
- **Rotation**: Regular secret updates
- **Least privilege**: Minimal permissions

### Network Security

- **Rate limiting**: Nginx ingress
- **TLS termination**: Let's Encrypt certificates
- **Network policies**: Pod-to-pod communication

## 🔧 Troubleshooting

### Common Issues

#### Pipeline Failures

```bash
# Check logs
kubectl logs -f deployment/backend-api

# Debug pod
kubectl exec -it <pod-name> -- /bin/sh

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

#### Database Connection

```bash
# Test database connectivity
kubectl run mysql-test --image=mysql:8.0 --rm -it -- mysql -h mysql-service -u backend_user -p

# Check database logs
kubectl logs -f deployment/mysql
```

#### Performance Issues

```bash
# Check resource usage
kubectl top pods

# Scale deployment
kubectl scale deployment/backend-api --replicas=5

# Check HPA status
kubectl get hpa
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Helm Documentation](https://helm.sh/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test locally**
4. **Ensure all tests pass**: `npm test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

The CI/CD pipeline will automatically:

- Run code quality checks
- Execute test suite
- Build and scan container image
- Deploy to staging (if merged to develop)
- Deploy to production (if merged to main with approval)
