#!/bin/bash

# Security Testing Script for Local Development
# Run this script to perform comprehensive security testing locally

set -e

echo "🔒 Starting Security Testing for Node.js Backend Template"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Installing dependencies..."
npm ci

echo ""
echo "🔍 1. NPM Audit - Checking for known vulnerabilities"
echo "=================================================="
if npm audit --audit-level=moderate; then
    print_status "No moderate or higher vulnerabilities found"
else
    print_warning "Vulnerabilities detected. Run 'npm audit fix' to fix automatically fixable issues"
fi

echo ""
echo "🔧 2. ESLint Security Scan"
echo "=========================="
print_status "Installing ESLint security plugin..."
npm install --no-save eslint-plugin-security

if npx eslint src/ --config .eslintrc.security.js; then
    print_status "No security issues found by ESLint"
else
    print_warning "Security issues detected by ESLint. Review the output above."
fi

echo ""
echo "🔍 3. Semgrep Security Analysis"
echo "==============================="
if command -v semgrep &> /dev/null; then
    print_status "Running Semgrep security analysis..."
    if semgrep --config=auto src/; then
        print_status "No issues found by Semgrep"
    else
        print_warning "Issues detected by Semgrep. Review the output above."
    fi
else
    print_warning "Semgrep not installed. Install with: pip install semgrep"
fi

echo ""
echo "🔐 4. Secrets Detection"
echo "======================"
if command -v trufflehog &> /dev/null; then
    print_status "Running TruffleHog secrets detection..."
    if trufflehog git file://. --only-verified; then
        print_status "No secrets detected"
    else
        print_warning "Potential secrets detected. Review the output above."
    fi
else
    print_warning "TruffleHog not installed. Install from: https://github.com/trufflesecurity/trufflehog"
fi

echo ""
echo "📦 5. Package Security Check"
echo "============================"
print_status "Checking for security-related packages..."

# Check if security packages are installed
SECURITY_PACKAGES=("helmet" "bcryptjs" "express-rate-limit" "joi" "express-validator")
MISSING_PACKAGES=()

for package in "${SECURITY_PACKAGES[@]}"; do
    if npm list "$package" &> /dev/null; then
        print_status "✅ $package is installed"
    else
        print_warning "❌ $package is missing"
        MISSING_PACKAGES+=("$package")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -eq 0 ]; then
    print_status "All recommended security packages are installed"
else
    print_warning "Missing security packages: ${MISSING_PACKAGES[*]}"
fi

echo ""
echo "🗂️ 6. Configuration Security Check"
echo "=================================="
print_status "Checking configuration security..."

# Check for sensitive files
SENSITIVE_FILES=(".env" ".env.local" ".env.production" "config/database.yml")
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_warning "Sensitive file found: $file (ensure it's in .gitignore)"
    fi
done

# Check if config.json exists and has proper structure
if [ -f "config.json" ]; then
    print_status "✅ config.json found"
    
    # Check if JWT secret is properly configured
    if grep -q "your-secret-key\|changeme\|123456\|password" config.json 2>/dev/null; then
        print_error "Weak secrets detected in config.json. Run 'npm run setup:config' to generate secure secrets."
    else
        print_status "✅ Configuration appears to have secure secrets"
    fi
else
    print_warning "config.json not found. Run 'npm run setup:config' to create it."
fi

echo ""
echo "🧪 7. Security Test Suite"
echo "========================="
print_status "Running security-focused tests..."

# Run tests with security focus
if npm test -- --testNamePattern="security|auth|validation" 2>/dev/null; then
    print_status "Security tests passed"
else
    print_warning "Some security tests may have failed or no security tests found"
fi

echo ""
echo "📊 8. Dependency Analysis"
echo "========================="
print_status "Analyzing dependencies for security issues..."

# Check for outdated packages
print_status "Checking for outdated packages..."
npm outdated || print_warning "Some packages are outdated. Consider updating them."

# Check for unused dependencies
if command -v depcheck &> /dev/null; then
    print_status "Checking for unused dependencies..."
    if depcheck; then
        print_status "No unused dependencies found"
    else
        print_warning "Unused dependencies detected"
    fi
else
    print_warning "depcheck not installed. Install with: npm install -g depcheck"
fi

echo ""
echo "📋 Security Test Summary"
echo "========================"
print_status "Security testing completed!"
echo ""
print_status "Next steps:"
echo "  1. Review any warnings or errors above"
echo "  2. Fix identified security issues"
echo "  3. Update dependencies with known vulnerabilities"
echo "  4. Ensure sensitive data is not committed to version control"
echo "  5. Run this script regularly during development"
echo ""
print_status "For automated security testing in CI/CD, the GitHub Actions workflows are configured."
echo ""

exit 0
