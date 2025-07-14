#!/bin/bash

# Backend Template Setup Script
# This script initializes the project with proper Git workflow and environments

set -e

echo "🚀 Setting up Backend Template with Git Workflow..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}📝 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_step "Initializing Git repository..."
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Check if we're already in a repository with remotes
if ! git remote | grep -q "origin"; then
    print_warning "No origin remote found. Please add your repository URL:"
    echo "Example: git remote add origin https://github.com/username/backend-template.git"
    echo ""
else
    print_success "Origin remote configured"
fi

# Create and checkout develop branch
print_step "Setting up branch structure..."

# Ensure we're on main/master
if git rev-parse --verify main >/dev/null 2>&1; then
    git checkout main
    MAIN_BRANCH="main"
elif git rev-parse --verify master >/dev/null 2>&1; then
    git checkout master
    MAIN_BRANCH="master"
else
    # Create main branch if neither exists
    git checkout -b main
    MAIN_BRANCH="main"
    print_success "Created main branch"
fi

# Create develop branch if it doesn't exist
if ! git rev-parse --verify develop >/dev/null 2>&1; then
    git checkout -b develop
    print_success "Created develop branch"
else
    git checkout develop
    print_success "Develop branch already exists"
fi

# Go back to main
git checkout $MAIN_BRANCH

print_success "Branch structure configured: $MAIN_BRANCH (production) ← develop (staging)"

# Install dependencies
print_step "Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
    npm install
    print_success "Dependencies installed"
else
    print_error "npm not found. Please install Node.js and npm first."
    exit 1
fi

# Setup environment files
print_step "Setting up environment configuration..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created .env file from template"
    print_warning "Please update .env with your local configuration"
else
    print_warning ".env file already exists. Please check if it needs updates."
fi

# Create local development database
print_step "Setting up local development..."

echo ""
echo "📋 Next steps to complete setup:"
echo ""
echo "1. 🔐 Configure environment variables in .env file:"
echo "   - Database connection details"
echo "   - JWT secret key"
echo "   - Redis configuration"
echo ""
echo "2. 🗄️  Setup local database:"
echo "   - Install MySQL/PostgreSQL locally or use Docker"
echo "   - Run: npm run db:migrate"
echo "   - Run: npm run db:seed (optional)"
echo ""
echo "3. 🚀 Start development server:"
echo "   - Run: npm run dev"
echo "   - API will be available at http://localhost:3000"
echo ""
echo "4. 🔗 Configure GitHub repository:"
echo "   - Add origin remote: git remote add origin <your-repo-url>"
echo "   - Push branches: git push -u origin main && git push -u origin develop"
echo ""
echo "5. ☁️  Setup Render deployment:"
echo "   - Connect your GitHub repository to Render"
echo "   - Create staging service from render-staging.yaml"
echo "   - Create production service from render.yaml"
echo "   - Configure environment variables in Render dashboard"
echo ""
echo "6. 🔑 Configure GitHub Secrets (for CI/CD):"
echo "   - RENDER_API_KEY: Your Render API key"
echo "   - SLACK_WEBHOOK_URL: Slack webhook for notifications (optional)"
echo ""

# Check for required tools
echo "🔍 Checking development environment..."

check_tool() {
    if command -v $1 >/dev/null 2>&1; then
        print_success "$1 is installed"
    else
        print_warning "$1 is not installed"
    fi
}

check_tool "node"
check_tool "npm"
check_tool "git"
check_tool "docker"
check_tool "mysql"

echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: docs/setup.md"
echo "   - API Documentation: docs/api.md"
echo "   - Git Workflow: docs/git-workflow.md"
echo "   - Deployment Guide: docs/deployment.md"
echo ""

# Create initial commit if this is a new repository
if [ -z "$(git log --oneline 2>/dev/null)" ]; then
    print_step "Creating initial commit..."
    git add .
    git commit -m "feat: initial backend template setup

- Express.js API with Sequelize ORM
- JWT authentication system
- MySQL/PostgreSQL database support
- Redis caching layer
- Comprehensive testing setup
- CI/CD pipelines for GitHub Actions
- Render.com deployment configuration
- Docker and Kubernetes support
- Complete documentation suite
- Git workflow with staging/production environments"
    
    print_success "Initial commit created"
    print_warning "Push to GitHub: git push -u origin $MAIN_BRANCH"
fi

echo ""
print_success "🎉 Backend Template setup completed!"
echo ""
echo "Happy coding! 🚀"
