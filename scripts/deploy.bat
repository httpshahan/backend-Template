@echo off
REM Windows deployment script for Docker Compose

echo 🚀 Deploying Backend API with Docker Compose...

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=staging

echo Environment: %ENVIRONMENT%

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

REM Check if docker-compose.yml exists
if not exist docker-compose.yml (
    echo ❌ docker-compose.yml not found!
    exit /b 1
)

REM Pull latest images
echo 📦 Pulling latest images...
docker-compose pull

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Start services
echo 🚀 Starting services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak

REM Run database migrations
echo 🗄️ Running database migrations...
docker-compose exec backend npm run db:migrate

REM Health check
echo 🏥 Performing health check...
curl -f http://localhost:3000/health
if errorlevel 1 (
    echo ❌ Health check failed!
    docker-compose logs backend
    exit /b 1
)

echo ✅ Deployment completed successfully!
echo 📊 Running containers:
docker-compose ps
