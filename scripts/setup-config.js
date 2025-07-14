#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG_EXAMPLE_PATH = path.join(__dirname, '..', 'config.example.json');
const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

function generateSecureSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function createConfigFromExample() {
  console.log('🔧 Setting up configuration...\n');

  // Check if config.json already exists
  if (fs.existsSync(CONFIG_PATH)) {
    console.log('⚠️  config.json already exists!');
    console.log('   If you want to recreate it, please delete the existing file first.\n');
    return;
  }

  // Check if config.example.json exists
  if (!fs.existsSync(CONFIG_EXAMPLE_PATH)) {
    console.error('❌ config.example.json not found!');
    console.error('   This file should be in the project root directory.\n');
    process.exit(1);
  }

  try {
    // Read and parse the example config
    const exampleConfig = JSON.parse(fs.readFileSync(CONFIG_EXAMPLE_PATH, 'utf8'));

    // Generate secure JWT secrets
    const devSecret = generateSecureSecret();
    const testSecret = generateSecureSecret();
    const prodSecret = generateSecureSecret();

    // Update JWT secrets with generated ones
    if (exampleConfig.development && exampleConfig.development.jwt) {
      exampleConfig.development.jwt.secret = devSecret;
    }
    if (exampleConfig.test && exampleConfig.test.jwt) {
      exampleConfig.test.jwt.secret = testSecret;
    }
    if (exampleConfig.production && exampleConfig.production.jwt) {
      exampleConfig.production.jwt.secret = prodSecret;
    }

    // Write the new config file
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(exampleConfig, null, 2));

    console.log('✅ Successfully created config.json!');
    console.log('✅ Generated secure JWT secrets for all environments\n');

    console.log('📝 Next steps:');
    console.log('   1. Update database credentials in config.json');
    console.log('   2. Configure email settings if needed');
    console.log('   3. Update CORS origins for your frontend URLs');
    console.log('   4. Review and adjust other settings as needed\n');

    console.log('🔒 Security reminder:');
    console.log('   - Never commit config.json to version control');
    console.log('   - Use environment variables to override sensitive settings in production');
    console.log('   - Keep your JWT secrets secure and unique per environment\n');
  } catch (error) {
    console.error('❌ Failed to create config.json:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createConfigFromExample();
}

module.exports = { createConfigFromExample };
