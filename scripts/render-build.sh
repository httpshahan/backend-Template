#!/bin/bash

# Render Build Script
# This script runs during the build phase on Render

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Run database migrations
echo "🗄️ Running database migrations..."
if [ "$NODE_ENV" = "production" ]; then
  npx sequelize-cli db:migrate
else
  echo "Skipping migrations for non-production environment"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads

# Set permissions
chmod 755 logs
chmod 755 uploads

echo "✅ Build completed successfully!"
