#!/bin/bash

# Backend Template Setup Script

echo "🚀 Setting up Backend Template..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL and create a database."
    echo "   You can also use Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please edit .env with your configuration."
else
    echo "⚠️  Environment file already exists."
fi

# Create logs directory
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir logs
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database configuration"
echo "2. Create your MySQL database"
echo "3. Run: npm run db:migrate"
echo "4. Run: npm run db:seed (optional - creates demo users)"
echo "5. Run: npm run dev (for development) or npm start (for production)"
echo ""
echo "Demo users (after seeding):"
echo "- Admin: admin@example.com / Admin@123"
echo "- User: john.doe@example.com / Admin@123"
echo "- Moderator: jane.smith@example.com / Admin@123"
echo ""
echo "API Documentation will be available at: http://localhost:3000/health"
echo "Happy coding! 🚀"
