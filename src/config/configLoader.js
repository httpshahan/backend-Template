const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor() {
    this.config = null;
    this.environment = process.env.NODE_ENV || 'development';
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config.json');

      if (!fs.existsSync(configPath)) {
        throw new Error(`Config file not found at ${configPath}`);
      }

      const configData = fs.readFileSync(configPath, 'utf8');
      const fullConfig = JSON.parse(configData);

      // Get environment-specific config
      this.config = fullConfig[this.environment];

      if (!this.config) {
        throw new Error(`Configuration for environment "${this.environment}" not found`);
      }

      // Override with environment variables if they exist
      this.overrideWithEnvVars();

      console.log(`✓ Configuration loaded for environment: ${this.environment}`);
    } catch (error) {
      console.error('Failed to load configuration:', error.message);
      process.exit(1);
    }
  }

  overrideWithEnvVars() {
    // Override database config if env vars exist
    if (process.env.DB_HOST) {
      this.config.database.host = process.env.DB_HOST;
    }
    if (process.env.DB_PORT) {
      this.config.database.port = parseInt(process.env.DB_PORT);
    }
    if (process.env.DB_NAME) {
      this.config.database.name = process.env.DB_NAME;
    }
    if (process.env.DB_USER) {
      this.config.database.username = process.env.DB_USER;
    }
    if (process.env.DB_PASS) {
      this.config.database.password = process.env.DB_PASS;
    }

    // Override server config
    if (process.env.PORT) {
      this.config.server.port = parseInt(process.env.PORT);
    }
    if (process.env.API_PREFIX) {
      this.config.server.apiPrefix = process.env.API_PREFIX;
    }

    // Override JWT config
    if (process.env.JWT_SECRET) {
      this.config.jwt.secret = process.env.JWT_SECRET;
    }
    if (process.env.JWT_EXPIRE) {
      this.config.jwt.accessTokenExpire = process.env.JWT_EXPIRE;
    }

    // Override email config
    if (process.env.EMAIL_HOST) {
      this.config.email = this.config.email || { smtp: { auth: {} }, from: {} };
      this.config.email.smtp.host = process.env.EMAIL_HOST;
    }
    if (process.env.EMAIL_PORT) {
      this.config.email.smtp.port = parseInt(process.env.EMAIL_PORT);
    }
    if (process.env.EMAIL_USER) {
      this.config.email.smtp.auth.user = process.env.EMAIL_USER;
    }
    if (process.env.EMAIL_PASS) {
      this.config.email.smtp.auth.pass = process.env.EMAIL_PASS;
    }

    // Override CORS origins
    if (process.env.CORS_ORIGIN) {
      this.config.security = this.config.security || { cors: {} };
      this.config.security.cors.origin = process.env.CORS_ORIGIN.split(',');
    }
  }

  get(path = '') {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    if (!path) {
      return this.config;
    }

    // Support nested path access like 'database.host'
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  getEnvironment() {
    return this.environment;
  }

  isDevelopment() {
    return this.environment === 'development';
  }

  isProduction() {
    return this.environment === 'production';
  }

  isTest() {
    return this.environment === 'test';
  }

  // Validate required configuration
  validate() {
    const required = [
      'server.port',
      'database.host',
      'database.name',
      'database.username',
      'jwt.secret'
    ];

    const missing = [];

    for (const path of required) {
      if (this.get(path) === undefined) {
        missing.push(path);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }

    // Validate JWT secret length
    if (this.get('jwt.secret').length < 32) {
      throw new Error('JWT secret must be at least 32 characters long');
    }

    console.log('✓ Configuration validation passed');
  }
}

// Create and export singleton instance
const configLoader = new ConfigLoader();
configLoader.validate();

module.exports = configLoader;
