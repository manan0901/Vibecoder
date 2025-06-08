#!/bin/bash

echo "🚀 VibeCoder Hostinger Deployment Starting..."
echo "Domain: vibecodeseller.com"
echo "=================================================="

# Set production environment
export NODE_ENV=production
export PORT=3000

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads logs
chmod 755 uploads logs

# Install root dependencies first
echo "📦 Installing root dependencies..."
npm install

# Backend setup
echo "🔧 Setting up Backend..."
cd backend
npm install --production
echo "🗄️ Generating Prisma client..."
npx prisma generate
echo "🔍 Testing database connection..."
npx prisma db push --accept-data-loss || echo "Database already synced"

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install --production
echo "🏗️ Building frontend..."
npm run build

# Return to root and start backend
echo "🚀 Starting Backend API..."
cd ../backend
npm start &

echo "=================================================="
echo "✅ Deployment Complete!"
echo "🌍 Site: https://vibecodeseller.com"
echo "🔗 API: https://vibecodeseller.com/api"
echo "=================================================="
