# 🚀 VibeCoder Hostinger Deployment Guide

## 📋 **Complete Step-by-Step Deployment Guide**

### 🎯 **Prerequisites**
- ✅ Hostinger hosting account with Node.js support
- ✅ Domain name configured
- ✅ GitHub account
- ✅ Local development environment

---

## 📝 **STEP 1: Prepare Your Environment Files**

### 1.1 Create Production Environment File

Create `.env.production` in your project root:

```bash
# Production Environment Configuration
NODE_ENV=production

# Application URLs (REPLACE WITH YOUR DOMAIN)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database Configuration (Hostinger provides these)
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration (Generate secure keys)
JWT_SECRET=your-super-secure-jwt-secret-key-64-characters-long
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-64-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Use your email service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Stripe Configuration (Your Stripe keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf,application/zip

# Redis Configuration (if available on Hostinger)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Production Security
HELMET_CSP_ENABLED=true
HELMET_HSTS_ENABLED=true
TRUST_PROXY=true
```

### 1.2 Update Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "npm run start:backend",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm start",
    "deploy": "npm run build && npm start"
  }
}
```

---

## 📝 **STEP 2: Prepare Your Code for Production**

### 2.1 Update Backend Configuration

Update `backend/src/config/database.ts`:

```typescript
// Add production database configuration
const config = {
  development: {
    // ... existing config
  },
  production: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
};
```

### 2.2 Update Frontend Configuration

Update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 📝 **STEP 3: Set Up GitHub Repository**

### 3.1 Initialize Git Repository

```bash
# In your project root
git init
git add .
git commit -m "Initial commit: VibeCoder marketplace"
```

### 3.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it "vibecoder-marketplace"
4. Make it public or private
5. Don't initialize with README (you already have files)

### 3.3 Push to GitHub

```bash
# Replace with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/vibecoder-marketplace.git
git branch -M main
git push -u origin main
```

---

## 📝 **STEP 4: Configure Hostinger**

### 4.1 Access Hostinger Control Panel

1. Log in to your Hostinger account
2. Go to "Hosting" section
3. Click "Manage" on your hosting plan

### 4.2 Enable Node.js

1. In the control panel, find "Node.js"
2. Click "Setup Node.js App"
3. Select Node.js version 18 or higher
4. Set application root to `public_html`
5. Set startup file to `backend/dist/server.js`

### 4.3 Set Up Database

1. Go to "Databases" in control panel
2. Create a new PostgreSQL database
3. Note down the connection details:
   - Database name
   - Username
   - Password
   - Host
   - Port

---

## 📝 **STEP 5: Deploy to Hostinger**

### 5.1 Upload Files via File Manager

1. In Hostinger control panel, open "File Manager"
2. Navigate to `public_html`
3. Upload your project files or use Git

### 5.2 Alternative: Use Git Deployment

```bash
# SSH into your Hostinger server (if SSH access available)
cd public_html
git clone https://github.com/YOUR_USERNAME/vibecoder-marketplace.git .
```

### 5.3 Install Dependencies

```bash
# In your Hostinger terminal or SSH
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 5.4 Set Environment Variables

1. In Hostinger control panel, go to "Node.js"
2. Click on your app
3. Add environment variables from your `.env.production` file
4. **Important**: Replace placeholder values with real ones:
   - `DATABASE_URL`: Use Hostinger database details
   - `NEXT_PUBLIC_API_URL`: Your domain + /api
   - `NEXT_PUBLIC_APP_URL`: Your domain
   - `JWT_SECRET`: Generate a secure 64-character string
   - `STRIPE_*`: Your real Stripe keys
   - `EMAIL_*`: Your email service details

### 5.5 Build the Application

```bash
# In your Hostinger terminal
npm run build
```

### 5.6 Run Database Migrations

```bash
# In backend directory
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## 📝 **STEP 6: Configure Domain and SSL**

### 6.1 Point Domain to Hostinger

1. In your domain registrar, update nameservers to Hostinger's
2. Or update A records to point to Hostinger IP

### 6.2 Enable SSL Certificate

1. In Hostinger control panel, go to "SSL"
2. Enable "Free SSL Certificate"
3. Wait for activation (can take up to 24 hours)

---

## 📝 **STEP 7: Start the Application**

### 7.1 Start Backend Server

```bash
# In Hostinger Node.js app settings
# Set startup file to: backend/dist/server.js
# Click "Start Application"
```

### 7.2 Configure Web Server

1. In Hostinger control panel, go to "Advanced" → "Redirects"
2. Add redirect from root domain to Node.js app
3. Or configure subdomain for API

---

## 📝 **STEP 8: Test Your Deployment**

### 8.1 Test API Endpoints

```bash
# Test health endpoint
curl https://yourdomain.com/api/health

# Should return: {"success": true, "message": "Server is running"}
```

### 8.2 Test Frontend

1. Visit your domain in browser
2. Check if the homepage loads
3. Test user registration
4. Test login functionality

---

## 📝 **STEP 9: Set Up Monitoring**

### 9.1 Configure Uptime Monitoring

1. Use services like UptimeRobot or Pingdom
2. Monitor your domain and API endpoints
3. Set up email alerts for downtime

### 9.2 Set Up Error Logging

1. Consider services like Sentry for error tracking
2. Configure log rotation in Hostinger
3. Monitor application logs regularly

---

## 🔧 **TROUBLESHOOTING COMMON ISSUES**

### Issue 1: "Module not found" errors
**Solution**: Run `npm install` in both root and subdirectories

### Issue 2: Database connection fails
**Solution**: Check DATABASE_URL format and Hostinger firewall settings

### Issue 3: Environment variables not working
**Solution**: Ensure they're set in Hostinger Node.js app settings, not just .env files

### Issue 4: SSL certificate issues
**Solution**: Wait 24 hours for SSL activation, check domain DNS settings

### Issue 5: File upload not working
**Solution**: Check file permissions and upload directory exists

---

## 📋 **POST-DEPLOYMENT CHECKLIST**

- [ ] ✅ Domain points to Hostinger
- [ ] ✅ SSL certificate is active
- [ ] ✅ Database is connected and migrated
- [ ] ✅ Environment variables are set
- [ ] ✅ API endpoints respond correctly
- [ ] ✅ Frontend loads without errors
- [ ] ✅ User registration works
- [ ] ✅ Login/logout works
- [ ] ✅ File uploads work
- [ ] ✅ Payment processing works (test mode first)
- [ ] ✅ Email notifications work
- [ ] ✅ Error monitoring is set up
- [ ] ✅ Backups are configured

---

## 🎉 **CONGRATULATIONS!**

Your VibeCoder marketplace is now live on Hostinger! 🚀

### 📞 **Need Help?**

If you encounter any issues:
1. Check Hostinger documentation
2. Review application logs
3. Test individual components
4. Contact Hostinger support if needed

### 🔄 **Future Updates**

To update your application:
1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Pull changes on Hostinger
5. Rebuild and restart application

**Your VibeCoder marketplace is ready to serve customers worldwide!** 🌍✨
