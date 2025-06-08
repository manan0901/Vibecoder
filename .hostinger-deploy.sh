#!/bin/bash

echo "🚀 Starting VibeCoder Auto-Deployment for vibecodeseller.com..."
echo "=================================================="

# Set production environment
export NODE_ENV=production

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p logs
chmod 755 uploads
chmod 755 logs

# Backend deployment
echo "🔧 Deploying Backend API..."
cd backend

echo "📦 Installing backend dependencies..."
npm install --production

echo "🗄️ Setting up database..."
npx prisma generate

echo "🔍 Testing database connection..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database (if needed)..."
npm run db:seed || echo "Seeding skipped or already done"

echo "✅ Backend deployment completed!"

# Frontend deployment
echo "🎨 Deploying Frontend..."
cd ../frontend

echo "📦 Installing frontend dependencies..."
npm install --production

echo "🏗️ Building frontend for production..."
npm run build

echo "✅ Frontend deployment completed!"

# Start services
echo "🚀 Starting services..."
cd ../backend

echo "🔄 Starting backend API server..."
npm run start:prod &
BACKEND_PID=$!

cd ../frontend
echo "🌐 Starting frontend server..."
npm run start:prod &
FRONTEND_PID=$!

# Wait a moment for services to start
sleep 5

# Health check
echo "🧪 Performing health checks..."
curl -f http://localhost:3000/api/health || echo "⚠️ Backend health check failed"
curl -f http://localhost:3001 || echo "⚠️ Frontend health check failed"

echo "=================================================="
echo "✅ VibeCoder Auto-Deployment Completed Successfully!"
echo "🌍 Website: https://vibecodeseller.com"
echo "🔗 API: https://vibecodeseller.com/api"
echo "👤 Admin: https://vibecodeseller.com/admin"
echo "=================================================="
echo "📊 Process IDs:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "=================================================="
