# 🗄️ VibeCoder Database Setup Guide

## 🚀 Quick Setup Options

### Option 1: Supabase (Recommended - Free Tier)

1. **Create Supabase Account:**
   - Go to: https://supabase.com
   - Sign up with GitHub account
   - Create new project

2. **Get Database URL:**
   - Go to Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Update Environment:**
   ```bash
   # Create .env file in backend folder
   DATABASE_URL="your_supabase_connection_string"
   ```

4. **Run Migrations:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

### Option 2: Railway (Free Tier)

1. **Create Railway Account:**
   - Go to: https://railway.app
   - Sign up with GitHub
   - Create new project
   - Add PostgreSQL service

2. **Get Database URL:**
   - Click on PostgreSQL service
   - Copy DATABASE_URL from Variables tab

3. **Update Environment:**
   ```bash
   DATABASE_URL="your_railway_connection_string"
   ```

### Option 3: Local PostgreSQL

1. **Install PostgreSQL:**
   - Download from: https://www.postgresql.org/download/
   - Install with default settings
   - Remember the password you set

2. **Create Database:**
   ```sql
   CREATE DATABASE vibecoder;
   CREATE USER vibecoder_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vibecoder TO vibecoder_user;
   ```

3. **Update Environment:**
   ```bash
   DATABASE_URL="postgresql://vibecoder_user:secure_password@localhost:5432/vibecoder"
   ```

## 🔧 After Database Setup

### 1. Install Dependencies (if not done)
```bash
cd backend
npm install
```

### 2. Run Database Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Seed Database (Optional)
```bash
npx prisma db seed
```

### 4. Restart Backend Server
```bash
npm run dev
```

## ✅ Verification

After setup, you should see:
- ✅ Database connection successful
- ✅ No more PostgreSQL errors
- ✅ API endpoints working with data
- ✅ User registration/login functional

## 🚀 Quick Test

1. **Test API Health:**
   - Visit: http://localhost:5000/health
   - Should show database: connected

2. **Test User Registration:**
   - POST to: http://localhost:5000/api/auth/register
   - Should create user in database

3. **Test Admin Panel:**
   - Visit: http://localhost:3000/admin
   - Should show real data from database

## 🎯 Production Ready

Once database is connected:
- ✅ Full user authentication
- ✅ Project upload/download
- ✅ Payment processing ready
- ✅ Admin panel functional
- ✅ Analytics working
- ✅ Ready for Hostinger deployment
