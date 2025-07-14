# Backend Template Setup Script (PowerShell)
# This script initializes the project with proper Git workflow and environments

param(
  [switch]$SkipDependencies,
  [switch]$Verbose
)

# Enable strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
  Red    = "Red"
  Green  = "Green"
  Yellow = "Yellow"
  Blue   = "Blue"
  Cyan   = "Cyan"
}

# Helper functions
function Write-Step {
  param([string]$Message)
  Write-Host "📝 $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
  param([string]$Message)
  Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
  param([string]$Message)
  Write-Host "⚠️  $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
  param([string]$Message)
  Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Test-Command {
  param([string]$Command)
  try {
    if (Get-Command $Command -ErrorAction SilentlyContinue) {
      return $true
    }
    return $false
  }
  catch {
    return $false
  }
}

# Main setup process
try {
  Write-Host "🚀 Setting up Backend Template with Git Workflow..." -ForegroundColor $Colors.Cyan
  Write-Host ""

  # Check if git is initialized
  if (-not (Test-Path ".git")) {
    Write-Step "Initializing Git repository..."
    git init
    Write-Success "Git repository initialized"
  }
  else {
    Write-Success "Git repository already exists"
  }

  # Check for origin remote
  $remotes = git remote 2>$null
  if ($remotes -notcontains "origin") {
    Write-Warning "No origin remote found. Please add your repository URL:"
    Write-Host "Example: git remote add origin https://github.com/username/backend-template.git" -ForegroundColor $Colors.Cyan
    Write-Host ""
  }
  else {
    Write-Success "Origin remote configured"
  }

  # Set up branch structure
  Write-Step "Setting up branch structure..."

  # Determine main branch
  $mainBranch = "main"
  try {
    git rev-parse --verify main 2>$null | Out-Null
    git checkout main 2>$null
  }
  catch {
    try {
      git rev-parse --verify master 2>$null | Out-Null
      git checkout master 2>$null
      $mainBranch = "master"
    }
    catch {
      # Create main branch if neither exists
      git checkout -b main 2>$null
      Write-Success "Created main branch"
    }
  }

  # Create develop branch if it doesn't exist
  try {
    git rev-parse --verify develop 2>$null | Out-Null
    git checkout develop 2>$null
    Write-Success "Develop branch already exists"
  }
  catch {
    git checkout -b develop 2>$null
    Write-Success "Created develop branch"
  }

  # Go back to main
  git checkout $mainBranch 2>$null
  Write-Success "Branch structure configured: $mainBranch (production) ← develop (staging)"

  # Install dependencies
  if (-not $SkipDependencies) {
    Write-Step "Installing dependencies..."
    if (Test-Command "npm") {
      npm install
      Write-Success "Dependencies installed"
    }
    else {
      Write-Error "npm not found. Please install Node.js and npm first."
      Write-Host "Download from: https://nodejs.org/" -ForegroundColor $Colors.Cyan
    }
  }

  # Setup configuration files
  Write-Step "Setting up JSON configuration..."

  if (-not (Test-Path "config.json")) {
    node scripts/setup-config.js
    Write-Success "Created config.json from template with secure secrets"
    Write-Warning "Please update config.json with your local configuration"
  }
  else {
    Write-Warning "config.json file already exists. Please check if it needs updates."
  }

  # Display next steps
  Write-Host ""
  Write-Host "📋 Next steps to complete setup:" -ForegroundColor $Colors.Cyan
  Write-Host ""
  Write-Host "1. 🔐 Configure your settings in config.json file:" -ForegroundColor $Colors.Yellow
  Write-Host "   - Database connection details"
  Write-Host "   - JWT secret key"
  Write-Host "   - Redis configuration"
  Write-Host ""
  Write-Host "2. 🗄️  Setup local database:" -ForegroundColor $Colors.Yellow
  Write-Host "   - Install MySQL/PostgreSQL locally or use Docker"
  Write-Host "   - Run: npm run db:migrate"
  Write-Host "   - Run: npm run db:seed (optional)"
  Write-Host ""
  Write-Host "3. 🚀 Start development server:" -ForegroundColor $Colors.Yellow
  Write-Host "   - Run: npm run dev"
  Write-Host "   - API will be available at http://localhost:3000"
  Write-Host ""
  Write-Host "4. 🔗 Configure GitHub repository:" -ForegroundColor $Colors.Yellow
  Write-Host "   - Add origin remote: git remote add origin <your-repo-url>"
  Write-Host "   - Push branches: git push -u origin $mainBranch; git push -u origin develop"
  Write-Host ""
  Write-Host "5. ☁️  Setup Render deployment:" -ForegroundColor $Colors.Yellow
  Write-Host "   - Connect your GitHub repository to Render"
  Write-Host "   - Create staging service from render-staging.yaml"
  Write-Host "   - Create production service from render.yaml"
  Write-Host "   - Configure settings in config.json or override with environment variables"
  Write-Host ""
  Write-Host "6. 🔑 Configure GitHub Secrets (for CI/CD):" -ForegroundColor $Colors.Yellow
  Write-Host "   - RENDER_API_KEY: Your Render API key"
  Write-Host "   - SLACK_WEBHOOK_URL: Slack webhook for notifications (optional)"
  Write-Host ""

  # Check for required tools
  Write-Host "🔍 Checking development environment..." -ForegroundColor $Colors.Cyan

  $tools = @("node", "npm", "git", "docker")
  foreach ($tool in $tools) {
    if (Test-Command $tool) {
      Write-Success "$tool is installed"
    }
    else {
      Write-Warning "$tool is not installed"
    }
  }

  # Check for MySQL
  if (Test-Command "mysql") {
    Write-Success "mysql is installed"
  }
  elseif (Test-Command "docker") {
    Write-Warning "mysql not found, but Docker is available (can use Docker for MySQL)"
  }
  else {
    Write-Warning "mysql is not installed"
  }

  Write-Host ""
  Write-Host "📚 Documentation:" -ForegroundColor $Colors.Cyan
  Write-Host "   - Setup Guide: docs\setup.md"
  Write-Host "   - API Documentation: docs\api.md"
  Write-Host "   - Git Workflow: docs\git-workflow.md"
  Write-Host "   - Deployment Guide: docs\deployment.md"
  Write-Host ""

  # Create initial commit if this is a new repository
  $gitLog = git log --oneline 2>$null
  if (-not $gitLog) {
    Write-Step "Creating initial commit..."
    git add .
    git commit -m @"
feat: initial backend template setup

- Express.js API with Sequelize ORM
- JWT authentication system
- MySQL/PostgreSQL database support
- Redis caching layer
- Comprehensive testing setup
- CI/CD pipelines for GitHub Actions
- Render.com deployment configuration
- Docker and Kubernetes support
- Complete documentation suite
- Git workflow with staging/production environments
"@
        
    Write-Success "Initial commit created"
    Write-Warning "Push to GitHub: git push -u origin $mainBranch"
  }

  Write-Host ""
  Write-Success "🎉 Backend Template setup completed!"
  Write-Host ""
  Write-Host "Happy coding! 🚀" -ForegroundColor $Colors.Green
}
catch {
  Write-Error "Setup failed: $($_.Exception.Message)"
  exit 1
}

# Usage examples
Write-Host ""
Write-Host "💡 PowerShell Usage Examples:" -ForegroundColor $Colors.Cyan
Write-Host "   .\scripts\setup.ps1                    # Full setup"
Write-Host "   .\scripts\setup.ps1 -SkipDependencies  # Skip npm install"
Write-Host "   .\scripts\setup.ps1 -Verbose           # Verbose output"
