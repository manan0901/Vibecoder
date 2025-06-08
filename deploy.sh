#!/bin/bash

# VibeCoder Hostinger Deployment Script
echo "Starting VibeCoder deployment..."

# Install dependencies
npm install

# Setup backend
cd backend
npm install
npx prisma generate

# Setup frontend  
cd ../frontend
npm install
npm run build

# Start backend
cd ../backend
npm start

echo "Deployment completed!"
