@echo off
REM Render Build Script for Windows
REM This script runs during the build phase on Render

echo 🚀 Starting Render build process...

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci --production

REM Run database migrations
echo 🗄️ Running database migrations...
if "%NODE_ENV%"=="production" (
    call npx sequelize-cli db:migrate
) else (
    echo Skipping migrations for non-production environment
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads

echo ✅ Build completed successfully!
