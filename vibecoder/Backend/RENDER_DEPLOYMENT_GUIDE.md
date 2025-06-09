# 🚀 Render Deployment Guide - VibeCoder Backend

## 📋 **RENDER DEPLOYMENT STEPS**

### **STEP 1: Create Render Account (2 minutes)**
1. **Go to:** https://render.com
2. **Sign up with GitHub** (free account)
3. **Authorize Render** to access your repositories

### **STEP 2: Deploy Backend Service (5 minutes)**
1. **Click:** "New +" → "Web Service"
2. **Connect Repository:** Select `manan0901/Vibecoder`
3. **Configure Service:**
   ```
   Name: vibecoder-backend
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: Backend
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   ```

### **STEP 3: Configure Environment Variables (5 minutes)**
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=mysql://u238061207_vibecoder:Loveisgr8@193.203.184.212:3306/u238061207_vibecodeseller
JWT_SECRET=VibeCoder2024-Production-Super-Secure-JWT-Secret-Key-vibecodeseller-com
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=VibeCoder2024-Production-Refresh-Token-Secret-vibecodeseller-com
JWT_REFRESH_EXPIRES_IN=30d
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=noreply@vibecodeseller.com
EMAIL_PASS=Vibeisgr8@
EMAIL_FROM=VibeCoder Marketplace <noreply@vibecodeseller.com>
FRONTEND_URL=https://vibecodeseller.com
API_VERSION=v1
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
MAX_FILE_SIZE=524288000
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=zip,rar,7z,tar,gz,pdf,doc,docx,txt,md,js,ts,jsx,tsx,py,java,cpp,c,php,html,css
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
DOMAIN=vibecodeseller.com
SSL_ENABLED=true
```

### **STEP 4: Deploy and Get URL (3 minutes)**
1. **Click:** "Create Web Service"
2. **Wait for deployment** (3-5 minutes)
3. **Copy the URL:** `https://vibecoder-backend.onrender.com`

### **🎯 RENDER FREE TIER BENEFITS:**
- ✅ **750 hours/month** free compute time
- ✅ **Automatic HTTPS** with SSL certificates
- ✅ **GitHub integration** for auto-deploys
- ✅ **Custom domains** supported
- ✅ **Environment variables** management
- ✅ **Logs and monitoring** included

### **⚡ RENDER ADVANTAGES:**
- **Faster deployment** than Railway
- **Better uptime** and reliability
- **More generous free tier**
- **Excellent documentation**
- **Built-in SSL certificates**

## 🔧 **AFTER DEPLOYMENT:**

### **Update Frontend Configuration:**
1. **Copy your Render URL:** `https://your-app-name.onrender.com`
2. **Update Frontend .env.production:**
   ```
   NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com/api
   ```
3. **Build frontend** for static deployment
4. **Upload to Hostinger**

### **Test Your API:**
- **Health Check:** `https://your-app-name.onrender.com/health`
- **API Base:** `https://your-app-name.onrender.com/api`

## 🎉 **DEPLOYMENT COMPLETE!**

Your VibeCoder backend will be live on Render with:
- ✅ **Professional API hosting**
- ✅ **Automatic SSL certificates**
- ✅ **Connected to Hostinger MySQL**
- ✅ **Email system working**
- ✅ **Ready for frontend integration**

**Next: Build and upload frontend to Hostinger! 🚀**
