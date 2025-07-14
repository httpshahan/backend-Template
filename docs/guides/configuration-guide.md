# Configuration Guide

This project uses a JSON-based configuration system instead of environment variables for better organization and structure.

## 📁 Configuration Files

- **`config.example.json`** - Template configuration file (committed to git)
- **`config.json`** - Your actual configuration file (NOT committed to git)
- **`src/config/configLoader.js`** - Configuration loader utility

## 🚀 Quick Setup

### Automatic Setup (Recommended)

```bash
npm run setup
```

This will:

- Copy `config.example.json` to `config.json`
- Generate secure JWT secrets automatically
- Guide you through next steps

### Manual Setup

```bash
cp config.example.json config.json
```

Then edit `config.json` with your specific settings.

## 📋 Configuration Structure

### Environment-Based Configuration

The config file contains separate configurations for each environment:

```json
{
  "development": { ... },
  "test": { ... },
  "production": { ... }
}
```

The active environment is determined by the `NODE_ENV` environment variable.

### Configuration Sections

#### 🖥️ Server Configuration

```json
"server": {
  "port": 3000,
  "environment": "development",
  "apiVersion": "v1",
  "apiPrefix": "/api/v1"
}
```

#### 🗄️ Database Configuration

```json
"database": {
  "host": "localhost",
  "port": 3306,
  "name": "backend_template_dev",
  "username": "your_database_user",
  "password": "your_database_password",
  "dialect": "mysql",
  "pool": {
    "max": 10,
    "min": 0,
    "acquire": 30000,
    "idle": 10000
  }
}
```

#### 🔐 JWT Configuration

```json
"jwt": {
  "secret": "your_secure_secret_key",
  "accessTokenExpire": "7d",
  "refreshTokenExpire": "30d"
}
```

#### 📧 Email Configuration

```json
"email": {
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "your_email@gmail.com",
      "pass": "your_app_password"
    }
  },
  "from": {
    "address": "noreply@yourdomain.com",
    "name": "Backend Template"
  }
}
```

#### 🛡️ Security Configuration

```json
"security": {
  "cors": {
    "origin": ["http://localhost:3000"],
    "credentials": true
  },
  "rateLimit": {
    "windowMs": 900000,
    "maxRequests": 100,
    "skipSuccessfulRequests": true
  }
}
```

#### 📝 Logging Configuration

```json
"logging": {
  "level": "debug",
  "fileEnabled": true,
  "dir": "./logs",
  "maxSize": "10m",
  "maxFiles": 5,
  "datePattern": "YYYY-MM-DD"
}
```

## 🔧 Using Configuration in Code

### Basic Usage

```javascript
const config = require('./config/configLoader');

// Get server port
const port = config.get('server.port');

// Get database configuration
const dbConfig = config.get('database');

// Get nested values
const jwtSecret = config.get('jwt.secret');
```

### Environment Checks

```javascript
const config = require('./config/configLoader');

if (config.isDevelopment()) {
  // Development-only code
}

if (config.isProduction()) {
  // Production-only code
}
```

### Configuration Validation

The configuration loader automatically validates required settings:

- Server port
- Database connection details
- JWT secret (minimum 32 characters)

## 🌍 Environment Variable Override

You can still override configuration values with environment variables:

```bash
# Override database settings
export DB_HOST=production-db.example.com
export DB_USER=prod_user
export DB_PASS=secure_password

# Override JWT secret
export JWT_SECRET=super_secure_production_secret

# Override server port
export PORT=8080
```

This is useful for:

- Production deployments
- CI/CD pipelines
- Docker containers
- Sensitive data that shouldn't be in config files

## 🔒 Security Best Practices

### 1. JWT Secrets

- Use the auto-generated secrets from `npm run setup`
- Minimum 32 characters long
- Unique per environment
- Never commit to version control

### 2. Database Passwords

- Use strong, unique passwords
- Consider using environment variables for production
- Rotate passwords regularly

### 3. Configuration Files

- Never commit `config.json` to git
- Use `config.example.json` as a template
- Document sensitive settings

### 4. Production Settings

- Use shorter JWT expiration times
- Enable stricter rate limiting
- Disable debug features
- Use environment variables for secrets

## 🚀 Deployment

### Development

```bash
NODE_ENV=development npm start
```

### Testing

```bash
NODE_ENV=test npm test
```

### Production

```bash
NODE_ENV=production npm start
```

## ❌ Troubleshooting

### Configuration Not Found Error

```
Error: Configuration for environment "development" not found
```

**Solution:** Ensure `config.json` exists and has the correct environment section.

### Missing Required Configuration Error

```
Error: Missing required configuration: jwt.secret
```

**Solution:** Run `npm run setup` or manually add the missing configuration values.

### JWT Secret Too Short Error

```
Error: JWT secret must be at least 32 characters long
```

**Solution:** Generate a new secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📚 Migration from .env

If you're migrating from environment variables:

1. Run the setup script: `npm run setup`
2. Copy values from your `.env` file to the appropriate sections in `config.json`
3. Remove the old `.env` file (keep `.env.example` for reference)
4. Update any custom code that directly uses `process.env`

## 🔄 Configuration Updates

When updating configuration:

1. Update `config.example.json` for new settings
2. Add validation in `configLoader.js` if needed
3. Update this documentation
4. Update the setup script if necessary

This ensures all developers have access to the latest configuration options.
