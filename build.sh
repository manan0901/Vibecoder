#!/bin/bash

echo "Building VibeCoder for production..."

# Install root dependencies
npm install

# Install and build backend
cd backend
npm install
npx prisma generate

# Install and build frontend
cd ../frontend
npm install
npm run build

echo "Build completed successfully!"
