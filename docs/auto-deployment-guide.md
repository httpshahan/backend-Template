# Auto-Deployment Setup Guide

Complete guide for setting up automatic redeployment on Render when code is merged to main/master branch.

## 🚀 Auto-Deployment Overview

This setup ensures that:

1. **Code pushed to main/master** → Automatic deployment to production
2. **Tests pass first** → Deployment only happens if all tests succeed
3. **Health checks** → Verify deployment success automatically
4. **Notifications** → Get notified about deployment status
5. **Rollback ready** → Easy rollback if issues are detected

## ⚙️ Configuration Files

### 1. GitHub Actions Workflow (`.github/workflows/render-deploy.yml`)

```yaml
# Triggers automatic deployment on:
on:
  push:
    branches: [main, master] # Only main/master branch
  workflow_dispatch: # Manual trigger option
```

**Key Features:**

- ✅ Runs tests before deployment
- ✅ Only deploys on main/master branch push
- ✅ Skips deployment on pull requests
- ✅ Includes health checks and API tests
- ✅ Sends deployment notifications

### 2. Render Configuration (`render.yaml`)

```yaml
services:
  - type: web
    name: backend-api
    autoDeploy: true # Enable auto-deployment
    branch: main # Track main branch
    buildCommand: npm ci --production
    startCommand: npm run render:start
```

## 📋 Setup Steps

### Step 1: Enable Auto-Deployment in Render

#### Option A: Using Render Dashboard

1. Go to your service in Render dashboard
2. Click **Settings** → **Build & Deploy**
3. Enable **"Auto-Deploy"**
4. Set **Branch** to `main` or `master`
5. Click **Save Changes**

#### Option B: Using render.yaml (Infrastructure as Code)

The `render.yaml` file in your repository already has `autoDeploy: true` configured.

### Step 2: Configure GitHub Repository Secrets

Add these secrets in GitHub repository **Settings** → **Secrets and variables** → **Actions**:

```bash
# Required for Render deployment
RENDER_API_KEY=rnd_your_api_key_here
RENDER_SERVICE_ID=srv_your_service_id
RENDER_APP_URL=your-app-name.onrender.com

# Optional for notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

#### Getting Render API Key:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **Account Settings** → **API Keys**
3. Create new API key
4. Copy the key (starts with `rnd_`)

#### Getting Service ID:

1. Go to your service in Render dashboard
2. Copy ID from URL: `https://dashboard.render.com/web/srv-XXXXXXXXX`
3. Use `srv-XXXXXXXXX` as the service ID

### Step 3: Verify Auto-Deployment Setup

#### Test the Workflow:

1. Make a small change to your code
2. Commit and push to main/master branch:
   ```bash
   git add .
   git commit -m "test: trigger auto-deployment"
   git push origin main
   ```
3. Check GitHub Actions tab to see the workflow running
4. Monitor Render dashboard for deployment progress

## 🔄 Deployment Flow

### Automatic Flow (on push to main/master):

```
1. 📝 Code pushed to main/master
2. 🔄 GitHub Actions triggered
3. 🧪 Run tests (unit + integration)
4. ✅ Tests pass → Continue
5. 🚀 Deploy to Render
6. ⏳ Wait for deployment completion
7. 🔍 Health check API endpoints
8. 🧪 Run integration tests
9. 📊 Performance test
10. ✅ Deployment complete
11. 📧 Send notifications
```

### Manual Flow (if needed):

```bash
# Trigger manual deployment
gh workflow run render-deploy.yml

# Or via GitHub web interface:
# Actions → Deploy to Render → Run workflow
```

## 🛡️ Safety Features

### 1. Test Gates

- **Unit tests** must pass before deployment
- **Integration tests** verify database connectivity
- **Linting** ensures code quality
- **Security scans** check for vulnerabilities

### 2. Health Checks

- **API health endpoint** verification
- **Database connectivity** check
- **Response time** monitoring
- **Integration tests** on live environment

### 3. Rollback Strategy

```bash
# Quick rollback via Render dashboard:
# 1. Go to Deployments tab
# 2. Find previous successful deployment
# 3. Click "Redeploy"

# Or via API:
curl -X POST "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"commitId": "PREVIOUS_COMMIT_SHA"}'
```

## 📊 Monitoring Deployment

### GitHub Actions Logs

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Expand job steps to see detailed logs

### Render Deployment Logs

1. Go to Render dashboard → your service
2. Click **Logs** tab
3. View real-time deployment and application logs

### Health Monitoring

The workflow automatically tests these endpoints after deployment:

- `GET /api/v1/health` - Basic health check
- `POST /api/v1/auth/register` - API functionality test

## 🔧 Customization Options

### Environment-Specific Deployments

#### Staging Environment

```yaml
# Create separate staging service
- type: web
  name: backend-api-staging
  autoDeploy: true
  branch: develop # Deploy from develop branch
  envVars:
    - key: NODE_ENV
      value: staging
    - key: DB_NAME
      value: backend_template_staging
```

#### Feature Branch Previews

```yaml
# Enable preview deployments for PRs
- type: web
  name: backend-api
  pullRequestPreviewsEnabled: true
  previewsExpireAfterDays: 7
```

### Custom Deployment Triggers

```yaml
# Deploy only on specific paths
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
      - 'Dockerfile'
```

### Notification Customization

```yaml
# Custom Slack notification
- name: Custom Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      🚀 Deployment ${{ job.status }}!
      📦 Commit: ${{ github.sha }}
      🌿 Branch: ${{ github.ref }}
      🔗 URL: https://${{ secrets.RENDER_APP_URL }}
```

## ⚡ Performance Optimization

### Build Optimization

```yaml
# Faster builds with caching
buildCommand: |
  npm ci --cache .npm --prefer-offline --production
  npm run build:optimized
```

### Deployment Speed

```yaml
# Skip unnecessary steps in production
startCommand: |
  if [ "$NODE_ENV" = "production" ]; then
    npm run start:prod
  else
    npm run render:start
  fi
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Deployment Fails

**Check:**

- GitHub Actions logs for errors
- Render deployment logs
- Environment variables are set correctly
- Build command succeeds locally

**Fix:**

```bash
# Test build locally
npm ci --production
npm run render:start

# Check environment variables
echo $NODE_ENV $DB_HOST $JWT_SECRET
```

#### 2. Health Check Fails

**Check:**

- API is responding on correct port (10000)
- Health endpoint returns 200 status
- Database connectivity
- All required environment variables set

**Fix:**

```bash
# Test health endpoint
curl https://your-app.onrender.com/api/v1/health

# Check logs in Render dashboard
```

#### 3. Auto-Deploy Not Triggering

**Check:**

- `autoDeploy: true` in render.yaml
- Correct branch name in configuration
- GitHub webhook is configured
- No deployment locks in Render

**Fix:**

1. Go to Render dashboard → Service Settings
2. Verify Auto-Deploy is enabled
3. Check branch name matches your default branch
4. Manual deploy once to refresh webhook

### Emergency Procedures

#### Stop Auto-Deployment

```bash
# Disable via Render dashboard:
# Settings → Build & Deploy → Turn off Auto-Deploy

# Or update render.yaml:
autoDeploy: false
```

#### Emergency Rollback

```bash
# Via Render dashboard:
# Deployments → Previous Version → Redeploy

# Via GitHub:
# Revert the commit and push
git revert HEAD
git push origin main
```

## 📈 Best Practices

### 1. Branch Protection

```yaml
# Setup branch protection rules:
# Settings → Branches → Add rule for main
# ✅ Require status checks to pass
# ✅ Require pull request reviews
# ✅ Restrict pushes to main
```

### 2. Staged Deployments

```bash
# Use staging → production flow:
develop → staging-auto-deploy
main → production-auto-deploy
```

### 3. Database Migrations

```bash
# Migrations run automatically via render:start script
# Package.json:
"render:start": "npm run db:migrate && npm start"
```

### 4. Environment Isolation

```bash
# Use different databases per environment:
# Development: backend_template_dev
# Staging: backend_template_staging
# Production: backend_template_prod
```

## ✅ Deployment Checklist

Before enabling auto-deployment:

- [ ] All tests are passing locally
- [ ] Environment variables configured in Render
- [ ] GitHub secrets added (RENDER_API_KEY, RENDER_SERVICE_ID)
- [ ] Health check endpoint working
- [ ] Database migrations tested
- [ ] Branch protection rules enabled
- [ ] Staging environment tested
- [ ] Rollback procedure documented
- [ ] Team notified about auto-deployment

## 🎯 Summary

With this setup, your deployment flow becomes:

1. **Developer pushes to main** → Automatic deployment starts
2. **Tests run and pass** → Deployment continues
3. **Code deploys to Render** → Server automatically restarts
4. **Health checks pass** → Deployment confirmed successful
5. **Team gets notified** → Everyone knows deployment status

Your production server will now automatically restart and update whenever code is merged to the main/master branch! 🚀

## 📞 Support

If you encounter issues:

1. Check GitHub Actions logs
2. Review Render deployment logs
3. Verify all environment variables
4. Test endpoints manually
5. Check this guide's troubleshooting section

For advanced configurations, see the main [Setup Guide](./setup-guide.md) and [CI/CD Documentation](./cicd.md).
