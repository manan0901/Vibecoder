# 🚀 VibeCoder GitHub Auto-Deployment Guide

## 🎯 **HOSTINGER AUTO-DEPLOYMENT FROM GITHUB**

### **✅ Target Configuration:**
- **Repository:** https://github.com/manan0901/Vibecoder.git
- **Domain:** vibecodeseller.com
- **Hosting:** Hostinger Premium with Git deployment
- **Auto-Deploy:** Push to GitHub → Auto deploy to Hostinger

---

## 📋 **STEP 1: PREPARE GITHUB REPOSITORY**

### **Option A: Use GitHub Desktop (Recommended)**

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and Login** with your GitHub account
3. **Clone Repository:**
   - File → Clone Repository
   - URL: https://github.com/manan0901/Vibecoder.git
   - Local Path: Choose your project directory

4. **Add All Changes:**
   - GitHub Desktop will show all modified files
   - Add commit message: "Production deployment ready for vibecodeseller.com"
   - Click "Commit to main"
   - Click "Push origin"

### **Option B: Use Git Command Line**

1. **Install Git:** https://git-scm.com/download/windows
2. **Navigate to project directory**
3. **Initialize and push:**
   ```bash
   git init
   git remote add origin https://github.com/manan0901/Vibecoder.git
   git add .
   git commit -m "Production deployment ready for vibecodeseller.com"
   git push -u origin main
   ```

### **Option C: Upload via GitHub Web Interface**

1. **Go to:** https://github.com/manan0901/Vibecoder
2. **Upload files** via web interface
3. **Commit changes** with message

---

## 🌐 **STEP 2: HOSTINGER GIT DEPLOYMENT SETUP**

### **Enable Git Deployment in Hostinger:**

1. **Login to Hostinger Panel:** https://hpanel.hostinger.com
2. **Go to:** Advanced → Git
3. **Create New Repository:**
   - **Repository URL:** https://github.com/manan0901/Vibecoder.git
   - **Branch:** main
   - **Target Directory:** public_html
   - **Auto Deploy:** Enable

4. **Configure Deployment:**
   - **Deploy Key:** Hostinger will generate SSH key
   - **Webhook:** Hostinger will provide webhook URL
   - **Auto Deploy on Push:** Enable

### **GitHub Webhook Configuration:**

1. **Go to GitHub Repository:** https://github.com/manan0901/Vibecoder
2. **Settings → Webhooks → Add webhook**
3. **Payload URL:** [Hostinger webhook URL]
4. **Content Type:** application/json
5. **Events:** Just the push event
6. **Active:** ✓ Checked

---

## ⚙️ **STEP 3: PRODUCTION ENVIRONMENT SETUP**

### **Create Production Environment Files:**

**1. Backend Production Environment (.env.production):**
```env
# VibeCoder Production Environment - vibecodeseller.com
NODE_ENV=production
PORT=3000

# Database - Hostinger MySQL (Working ✅)
DATABASE_URL="mysql://u238061207_vibecoder:Loveisgr8%40@193.203.184.212:3306/u238061207_vibecodeseller"

# JWT Secrets - Production
JWT_SECRET="VibeCoder2024-Production-Super-Secure-JWT-Secret-Key-vibecodeseller-com"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="VibeCoder2024-Production-Refresh-Token-Secret-vibecodeseller-com"
JWT_REFRESH_EXPIRES_IN="30d"

# Email Configuration - Hostinger SMTP
EMAIL_SERVICE="smtp"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="noreply@vibecodeseller.com"
EMAIL_PASS="Vibeisgr8@"
EMAIL_FROM="VibeCoder Marketplace <noreply@vibecodeseller.com>"

# Application URLs
FRONTEND_URL="https://vibecodeseller.com"
API_VERSION="v1"

# Razorpay (Update with live keys)
RAZORPAY_KEY_ID="rzp_live_YOUR_LIVE_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_LIVE_SECRET_KEY"
RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_PATH="./uploads"
ALLOWED_FILE_TYPES="zip,rar,7z,tar,gz,pdf,doc,docx,txt,md,js,ts,jsx,tsx,py,java,cpp,c,php,html,css"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
LOG_FILE="./logs/app.log"

# Domain
DOMAIN="vibecodeseller.com"
SSL_ENABLED="true"
```

**2. Frontend Production Environment (.env.production):**
```env
# VibeCoder Frontend Production - vibecodeseller.com
NEXT_PUBLIC_API_URL=https://vibecodeseller.com/api
NEXT_PUBLIC_APP_URL=https://vibecodeseller.com

# Razorpay (Update with live keys)
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_YOUR_LIVE_KEY_ID

# Application
NEXT_PUBLIC_APP_NAME="VibeCoder Marketplace"
NEXT_PUBLIC_DOMAIN="vibecodeseller.com"

# SEO
NEXT_PUBLIC_SITE_NAME="VibeCoder - Premium Coding Projects Marketplace"
NEXT_PUBLIC_SITE_DESCRIPTION="Discover and sell premium coding projects. From React dashboards to Node.js APIs, find quality code solutions for your business."

# Analytics (Add your tracking IDs)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Contact
NEXT_PUBLIC_SUPPORT_EMAIL="support@vibecodeseller.com"
```

---

## 🔧 **STEP 4: DEPLOYMENT SCRIPTS**

### **Create package.json Scripts for Auto-Deployment:**

**Backend package.json (add to scripts):**
```json
{
  "scripts": {
    "deploy": "npm install && npx prisma generate && npm start",
    "start:prod": "NODE_ENV=production tsx src/server.ts",
    "postinstall": "npx prisma generate"
  }
}
```

**Frontend package.json (add to scripts):**
```json
{
  "scripts": {
    "deploy": "npm install && npm run build && npm start",
    "build:prod": "NODE_ENV=production next build",
    "start:prod": "NODE_ENV=production next start"
  }
}
```

### **Create Deployment Hook Script (.hostinger-deploy.sh):**
```bash
#!/bin/bash
echo "🚀 Starting VibeCoder deployment..."

# Backend deployment
cd backend
echo "📦 Installing backend dependencies..."
npm install
echo "🗄️ Generating Prisma client..."
npx prisma generate
echo "🔄 Starting backend service..."
npm run start:prod &

# Frontend deployment
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install
echo "🏗️ Building frontend..."
npm run build
echo "🌐 Starting frontend service..."
npm run start:prod &

echo "✅ VibeCoder deployment completed!"
echo "🌍 Site available at: https://vibecodeseller.com"
```

---

## 🧪 **STEP 5: TESTING AUTO-DEPLOYMENT**

### **Test Deployment Process:**

1. **Make a Small Change:**
   - Edit README.md or add a comment
   - Commit and push to GitHub

2. **Monitor Hostinger:**
   - Check Git deployment logs in Hostinger panel
   - Verify files are updated in public_html

3. **Test Website:**
   - Visit https://vibecodeseller.com
   - Verify changes are live

### **Deployment Verification:**
- [ ] **GitHub Push** triggers deployment
- [ ] **Files Updated** in Hostinger
- [ ] **Services Restarted** automatically
- [ ] **Website Live** with changes

---

## 📊 **STEP 6: MONITORING & MAINTENANCE**

### **Auto-Deployment Benefits:**
- ✅ **Instant Updates** - Push to GitHub, live in minutes
- ✅ **Version Control** - Full Git history
- ✅ **Rollback Capability** - Easy to revert changes
- ✅ **Team Collaboration** - Multiple developers can contribute
- ✅ **Automated Testing** - Can add CI/CD pipelines

### **Monitoring Setup:**
- **Hostinger Logs** - Monitor deployment status
- **GitHub Actions** - Optional CI/CD pipeline
- **Uptime Monitoring** - Track website availability
- **Performance Monitoring** - Track site speed

---

## 🚀 **STEP 7: GO LIVE PROCESS**

### **Final Deployment Steps:**

1. **Push to GitHub** ✅ All production code
2. **Configure Hostinger Git** ⏳ Your action
3. **Set Environment Variables** ⏳ Your action
4. **Test Auto-Deployment** ⏳ Your action
5. **Verify Website** ⏳ Your action
6. **Go Live!** 🎉 Success

### **Expected Timeline:**
- **GitHub Setup:** 10-15 minutes
- **Hostinger Configuration:** 15-20 minutes
- **Testing:** 10-15 minutes
- **Total:** 35-50 minutes

---

## 📞 **IMMEDIATE NEXT STEPS**

### **What You Need to Do:**

1. **Choose GitHub Method:**
   - GitHub Desktop (easiest)
   - Git command line
   - Web interface upload

2. **Push All Code to GitHub:**
   - Include all production configurations
   - Commit with clear message
   - Push to main branch

3. **Configure Hostinger Git Deployment:**
   - Enable Git in Hostinger panel
   - Connect to your GitHub repository
   - Set up auto-deployment

4. **Test the Process:**
   - Make a small change
   - Push to GitHub
   - Verify auto-deployment works

### **I'll Help You With:**
- **GitHub setup** if you need assistance
- **Hostinger configuration** guidance
- **Troubleshooting** any deployment issues
- **Testing** the complete workflow

---

## 🎉 **BENEFITS OF AUTO-DEPLOYMENT**

### **Professional Workflow:**
- **Version Control** - Complete project history
- **Automated Deployment** - No manual file uploads
- **Team Collaboration** - Multiple developers can contribute
- **Easy Updates** - Push code, site updates automatically
- **Rollback Capability** - Quick revert if issues arise

### **Business Advantages:**
- **Faster Updates** - New features live in minutes
- **Reduced Errors** - Automated process eliminates mistakes
- **Better Maintenance** - Easy to track and manage changes
- **Scalable Process** - Supports team growth

**Your VibeCoder marketplace will have enterprise-level deployment workflow! 🚀**

---

## 📧 **Ready to Start?**

Choose your preferred method and let's get your auto-deployment set up:

1. **GitHub Desktop** (recommended for beginners)
2. **Git Command Line** (for developers)
3. **Web Interface** (quick and simple)

**Once you choose, I'll guide you through each step to get vibecodeseller.com live with auto-deployment! 🌟**
