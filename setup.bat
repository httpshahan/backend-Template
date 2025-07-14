@echo off
echo 🚀 Setting up Backend Template...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js version 16 or higher first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if MySQL is available
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MySQL is not installed. Please install MySQL and create a database.
    echo    You can also use Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment file
if not exist .env (
    echo 📝 Creating environment file...
    copy .env.example .env
    echo ✅ Environment file created. Please edit .env with your configuration.
) else (
    echo ⚠️  Environment file already exists.
)

REM Create logs directory
if not exist logs (
    echo 📁 Creating logs directory...
    mkdir logs
)

REM Create uploads directory
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
)

echo.
echo 🎉 Setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your database configuration
echo 2. Create your MySQL database
echo 3. Run: npm run db:migrate
echo 4. Run: npm run db:seed (optional - creates demo users)
echo 5. Run: npm run dev (for development) or npm start (for production)
echo.
echo Demo users (after seeding):
echo - Admin: admin@example.com / Admin@123
echo - User: john.doe@example.com / Admin@123
echo - Moderator: jane.smith@example.com / Admin@123
echo.
echo API Documentation will be available at: http://localhost:3000/health
echo Happy coding! 🚀
pause
