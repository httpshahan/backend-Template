#!/usr/bin/env node

// Security Testing Script for Cross-Platform Support
// Node.js version of the security testing script

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function printStatus(message) {
  console.log(`${colors.green}[INFO]${colors.reset} ${message}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function printError(message) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

function checkPackageInstalled(packageName) {
  const result = runCommand(`npm list ${packageName}`, { silent: true });
  return result.success;
}

async function main() {
  console.log('🔒 Starting Security Testing for Node.js Backend Template');
  console.log('==================================================');

  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    printError('package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  // 1. Install dependencies
  printStatus('Installing dependencies...');
  const installResult = runCommand('npm ci');
  if (!installResult.success) {
    printError('Failed to install dependencies');
    process.exit(1);
  }

  console.log('\n🔍 1. NPM Audit - Checking for known vulnerabilities');
  console.log('==================================================');
  const auditResult = runCommand('npm audit --audit-level=moderate');
  if (auditResult.success) {
    printStatus('No moderate or higher vulnerabilities found');
  } else {
    printWarning(
      'Vulnerabilities detected. Run "npm audit fix" to fix automatically fixable issues'
    );
  }

  console.log('\n🔧 2. ESLint Security Scan');
  console.log('==========================');

  // Install ESLint security plugin if not installed
  if (!checkPackageInstalled('eslint-plugin-security')) {
    printStatus('Installing ESLint security plugin...');
    runCommand('npm install --no-save eslint-plugin-security');
  }

  const eslintResult = runCommand('npx eslint src/ --config .eslintrc.security.js');
  if (eslintResult.success) {
    printStatus('No security issues found by ESLint');
  } else {
    printWarning('Security issues detected by ESLint. Review the output above.');
  }

  console.log('\n📦 3. Package Security Check');
  console.log('============================');
  printStatus('Checking for security-related packages...');

  const securityPackages = ['helmet', 'bcryptjs', 'express-rate-limit', 'joi', 'express-validator'];
  const missingPackages = [];

  for (const pkg of securityPackages) {
    if (checkPackageInstalled(pkg)) {
      printStatus(`✅ ${pkg} is installed`);
    } else {
      printWarning(`❌ ${pkg} is missing`);
      missingPackages.push(pkg);
    }
  }

  if (missingPackages.length === 0) {
    printStatus('All recommended security packages are installed');
  } else {
    printWarning(`Missing security packages: ${missingPackages.join(', ')}`);
  }

  console.log('\n🗂️ 4. Configuration Security Check');
  console.log('==================================');
  printStatus('Checking configuration security...');

  // Check for sensitive files
  const sensitiveFiles = ['.env', '.env.local', '.env.production', 'config/database.yml'];
  for (const file of sensitiveFiles) {
    if (fs.existsSync(file)) {
      printWarning(`Sensitive file found: ${file} (ensure it's in .gitignore)`);
    }
  }

  // Check config.json
  if (fs.existsSync('config.json')) {
    printStatus('✅ config.json found');

    try {
      const configContent = fs.readFileSync('config.json', 'utf8');
      const weakSecrets = ['your-secret-key', 'changeme', '123456', 'password'];

      if (weakSecrets.some(secret => configContent.includes(secret))) {
        printError(
          'Weak secrets detected in config.json. Run "npm run setup:config" to generate secure secrets.'
        );
      } else {
        printStatus('✅ Configuration appears to have secure secrets');
      }
    } catch (error) {
      printWarning('Could not read config.json');
    }
  } else {
    printWarning('config.json not found. Run "npm run setup:config" to create it.');
  }

  console.log('\n🧪 5. Security Test Suite');
  console.log('=========================');
  printStatus('Running security-focused tests...');

  const testResult = runCommand('npm test', { silent: true });
  if (testResult.success) {
    printStatus('Tests passed');
  } else {
    printWarning('Some tests may have failed');
  }

  console.log('\n📊 6. Dependency Analysis');
  console.log('=========================');
  printStatus('Analyzing dependencies for security issues...');

  // Check for outdated packages
  printStatus('Checking for outdated packages...');
  const outdatedResult = runCommand('npm outdated', { silent: true });
  if (outdatedResult.success) {
    printStatus('All packages are up to date');
  } else {
    printWarning('Some packages are outdated. Consider updating them.');
  }

  console.log('\n📋 Security Test Summary');
  console.log('========================');
  printStatus('Security testing completed!');
  console.log('');
  printStatus('Next steps:');
  console.log('  1. Review any warnings or errors above');
  console.log('  2. Fix identified security issues');
  console.log('  3. Update dependencies with known vulnerabilities');
  console.log('  4. Ensure sensitive data is not committed to version control');
  console.log('  5. Run "npm run security" regularly during development');
  console.log('');
  printStatus(
    'For automated security testing in CI/CD, the GitHub Actions workflows are configured.'
  );
  console.log('');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  printError('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  printError('Security testing failed:', error.message);
  process.exit(1);
});
