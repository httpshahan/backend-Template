# Render Deployment Guide

Complete guide for deploying your backend template to Render.com with automatic deployments.

## Overview

Render is a modern cloud platform that provides automatic deployments, built-in CI/CD, and managed databases. This guide covers both manual deployment and automatic deployment with GitHub integration.

## 🚀 Quick Deploy to Render

### Option 1: One-Click Deploy (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/backend-template)

### Option 2: Manual Setup

Follow the steps below for manual configuration.

## Prerequisites

- Render account (free tier available)
- GitHub repository with your backend code
- Basic understanding of environment variables

## Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up using GitHub (recommended for auto-deployment)
3. Verify your email address

## Step 2: Connect GitHub Repository

1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Choose **"Connect account"** for GitHub
4. Authorize Render to access your repositories
5. Select your backend repository

## Step 3: Configure Web Service

### Basic Configuration

| Setting           | Value                                            |
| ----------------- | ------------------------------------------------ |
| **Name**          | `backend-api` (or your preferred name)           |
| **Environment**   | `Node`                                           |
| **Build Command** | `npm ci --production`                            |
| **Start Command** | `npm run render:start`                           |
| **Plan**          | `Starter` (free tier) or `Standard` (production) |

### Advanced Settings

| Setting               | Value                               |
| --------------------- | ----------------------------------- |
| **Auto-Deploy**       | `Yes` (deploys on git push)         |
| **Branch**            | `main` or `master`                  |
| **Root Directory**    | Leave blank (if backend is in root) |
| **Health Check Path** | `/api/v1/health`                    |

## Step 4: Environment Variables

Add these environment variables in Render dashboard:

### Required Variables

```env
NODE_ENV=production
PORT=10000
API_VERSION=v1
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRE=7d
```

### Database Variables (will be auto-populated when you add MySQL service)

```env
DB_HOST=[Auto-filled by Render]
DB_PORT=[Auto-filled by Render]
DB_NAME=backend_template_prod
DB_USER=[Auto-filled by Render]
DB_PASS=[Auto-filled by Render]
DB_DIALECT=mysql
```

### Optional Variables

```env
CORS_ORIGIN=*
LOG_LEVEL=info
LOG_FILE_ENABLED=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Step 5: Add MySQL Database

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"** or use external MySQL service
3. Configure database:
   - **Name**: `mysql-db`
   - **Plan**: `Starter` (free) or `Standard` (production)
   - **Database Name**: `backend_template_prod`
   - **User**: Will be auto-generated

### Alternative: External MySQL

If you prefer external MySQL (like PlanetScale, AWS RDS):

```env
DB_HOST=your-mysql-host
DB_PORT=3306
DB_NAME=your-database-name
DB_USER=your-username
DB_PASS=your-password
```

## Step 6: Add Redis (Optional)

For session storage and caching:

1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name**: `redis-cache`
   - **Plan**: `Starter` (free)

Environment variables will be auto-populated:

```env
REDIS_HOST=[Auto-filled]
REDIS_PORT=[Auto-filled]
```

## Step 7: Deploy and Test

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Monitor the build logs for any errors
4. Once deployed, test the health endpoint:

```bash
curl https://your-app-name.onrender.com/api/v1/health
```

## Auto-Deployment with GitHub Actions

### Step 1: Get Render API Key

1. Go to Render dashboard → **Account Settings**
2. Click **"API Keys"**
3. Create new API key
4. Copy the key (starts with `rnd_`)

### Step 2: Configure GitHub Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**:

```
RENDER_API_KEY=rnd_your_api_key_here
RENDER_SERVICE_ID=srv-your_service_id
RENDER_APP_URL=your-app-name.onrender.com
```

To find your Service ID:

1. Go to your service in Render dashboard
2. Copy the ID from URL: `https://dashboard.render.com/web/srv-XXXXXXXXX`

### Step 3: Enable Auto-Deployment

The repository includes `.github/workflows/render-deploy.yml` which will:

1. Run tests on every push
2. Deploy to Render on push to main branch
3. Perform health checks after deployment
4. Send notifications (if configured)

## Environment-Specific Deployments

### Staging Environment

1. Create a new web service for staging
2. Connect to a different branch (e.g., `develop`)
3. Use different environment variables:

```env
NODE_ENV=staging
DB_NAME=backend_template_staging
# ... other staging-specific variables
```

### Production Environment

1. Use `Standard` or `Pro` plan for production
2. Enable **"Auto-Deploy"** only for main branch
3. Set up custom domain:
   - Go to service settings
   - Add custom domain
   - Configure DNS records

## Database Migrations

### Automatic Migrations

Migrations run automatically during deployment via the `render:start` script:

```json
{
  "scripts": {
    "render:start": "npm run db:migrate && npm start"
  }
}
```

### Manual Migrations

To run migrations manually:

1. Go to Render dashboard → your service
2. Open **"Shell"** tab
3. Run commands:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all  # Optional: seed data
```

## Monitoring and Logs

### View Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs and errors

### Health Monitoring

Render automatically monitors your service health via:

- Health check endpoint: `/api/v1/health`
- Automatic restarts on failures
- Email notifications on downtime

### Custom Monitoring

Add monitoring endpoints to your app:

```javascript
// src/routes/monitoring.js
app.get('/api/v1/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  });
});
```

## Performance Optimization

### For Production Deployment

1. **Upgrade Plan**: Use `Standard` or `Pro` for production
2. **Enable Scaling**: Configure auto-scaling based on CPU/memory
3. **Add CDN**: Use Render's built-in CDN for static assets
4. **Database Optimization**:
   - Use connection pooling
   - Add database indexes
   - Enable query caching

### Build Optimization

```dockerfile
# Optional: Create a Dockerfile for faster builds
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 10000
CMD ["npm", "start"]
```

## SSL and Custom Domains

### SSL Certificate

Render provides free SSL certificates automatically for:

- `.onrender.com` subdomains
- Custom domains

### Custom Domain Setup

1. Go to service settings → **"Custom Domains"**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Configure DNS records:
   ```
   Type: CNAME
   Name: api
   Value: your-app-name.onrender.com
   ```

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails with dependency errors

```bash
# Solution: Clear cache and rebuild
# In Render dashboard: Settings → Clear Build Cache
```

**Problem**: Migration fails

```bash
# Check database connection
# Verify environment variables
# Check migration files for syntax errors
```

#### Runtime Errors

**Problem**: 502 Bad Gateway

```bash
# Check if app is listening on correct port (10000)
# Verify start command
# Check application logs
```

**Problem**: Database connection issues

```bash
# Verify database service is running
# Check environment variables
# Ensure database allows connections
```

#### Performance Issues

**Problem**: Slow response times

```bash
# Upgrade to Standard plan
# Enable auto-scaling
# Optimize database queries
# Add Redis caching
```

### Debugging Steps

1. **Check Logs**: Always start with application logs
2. **Environment Variables**: Verify all required variables are set
3. **Database Status**: Check if database service is healthy
4. **Network Issues**: Test connectivity between services
5. **Resource Limits**: Monitor CPU and memory usage

## Cost Optimization

### Free Tier Limits

Render's free tier includes:

- 750 hours/month of usage
- 512MB RAM
- Sleeps after 15 minutes of inactivity
- Limited to 1 service

### Production Considerations

For production use:

- **Standard Plan**: $7/month, no sleep, more resources
- **Database Plan**: $7/month for managed PostgreSQL
- **Custom Domains**: Free with any paid plan

## Security Best Practices

### Environment Variables

- Never commit secrets to git
- Use Render's environment variable encryption
- Rotate API keys regularly
- Use different secrets for each environment

### Network Security

- Enable CORS with specific origins
- Use HTTPS only (automatic on Render)
- Implement rate limiting
- Add request validation

### Database Security

- Use strong passwords
- Enable connection encryption
- Restrict database access
- Regular security updates

## Backup and Recovery

### Database Backups

```bash
# Manual backup (run in Render shell)
pg_dump $DATABASE_URL > backup.sql

# Automated backups (Render Pro feature)
# Enable in database settings
```

### Disaster Recovery

1. **Multiple Environments**: Always have staging environment
2. **Database Replication**: Use read replicas for critical data
3. **Monitoring**: Set up alerts for downtime
4. **Rollback Strategy**: Keep previous deployments for quick rollback

## Support and Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Community Forum**: [community.render.com](https://community.render.com)
- **Support**: Available for paid plans
- **Status Page**: [status.render.com](https://status.render.com)

## Next Steps

After successful deployment:

1. **Set up monitoring**: Add error tracking (Sentry, Bugsnag)
2. **Performance monitoring**: Add APM tools
3. **Analytics**: Track API usage and performance
4. **Documentation**: Update API documentation with live URLs
5. **Testing**: Set up automated testing against production

Your backend is now deployed on Render with automatic deployments! 🚀

For more advanced configurations, see the main [Setup Guide](./setup-guide.md) and [CI/CD Documentation](./cicd.md).
