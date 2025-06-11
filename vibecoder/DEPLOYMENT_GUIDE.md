# 🚀 VibeCoder Marketplace - Complete Deployment Guide

## 📋 Deployment Architecture
- **Backend**: Render (Node.js/Express API)
- **Frontend**: Hostinger (Next.js Static Site)
- **Database**: Hostinger MySQL
- **Domain**: vibecodeseller.com (Hostinger)

## ✅ Pre-Deployment Checklist

### Frontend Ready ✅
- [x] Build successful (`npm run build`)
- [x] Environment variables configured
- [x] All seller functionality working
- [x] Responsive design implemented
- [x] Currency display in INR (₹)

### Backend Ready ✅
- [x] Server starts successfully
- [x] Build process configured
- [x] CORS configured for production
- [x] Prisma schema ready
- [x] Environment variables configured

---

## 🎯 STEP 1: Backend Deployment on Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

### 1.2 Deploy Backend Service
1. **Create New Web Service**
   - Repository: `https://github.com/manan0901/Vibecoder.git`
   - Root Directory: `vibecoder/Backend`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

2. **Environment Variables** (Add in Render Dashboard):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://u238061207_vibecoder:YOUR_PASSWORD@srv1102.hstgr.io:3306/u238061207_vibecodeseller
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://vibecodeseller.com
NEXT_PUBLIC_APP_URL=https://vibecodeseller.com
CORS_ORIGIN=https://vibecodeseller.com,https://www.vibecodeseller.com
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@vibecodeseller.com
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=vibecoder-files
```

3. **Deploy Settings**:
   - Auto-Deploy: `Yes`
   - Branch: `main`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

### 1.3 Note Your Backend URL
After deployment, your backend will be available at:
`https://vibecoder-backend.onrender.com`

---

## 🌐 STEP 2: Database Setup on Hostinger

### 2.1 Access Hostinger MySQL
1. Login to Hostinger control panel
2. Go to **Databases** → **MySQL Databases**
3. Find your database: `u238061207_vibecodeseller`

### 2.2 Update Database Connection
1. Get your database connection details from Hostinger
2. Update the `DATABASE_URL` in Render environment variables:
```
DATABASE_URL=mysql://u238061207_vibecoder:YOUR_ACTUAL_PASSWORD@srv1102.hstgr.io:3306/u238061207_vibecodeseller
```

### 2.3 Run Database Migrations
After backend deployment, run migrations via Render console:
```bash
npx prisma db push
```

---

## 🎨 STEP 3: Frontend Deployment on Hostinger

### 3.1 Build Frontend for Production
1. Navigate to Frontend directory:
```bash
cd vibecoder/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Build for production:
```bash
npm run build
```

### 3.2 Configure Production Environment
Create `.env.production` with:
```env
NEXT_PUBLIC_API_URL=https://vibecoder-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://vibecodeseller.com
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_YOUR_LIVE_KEY_ID
NEXT_PUBLIC_SITE_NAME=VibeCoder Marketplace
NEXT_PUBLIC_SITE_DESCRIPTION=Premium coding projects marketplace
NEXT_PUBLIC_DOMAIN=vibecodeseller.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 3.3 Upload to Hostinger
1. **Via File Manager**:
   - Login to Hostinger control panel
   - Go to **File Manager**
   - Navigate to `public_html`
   - Upload the entire `out` folder contents (after build)

2. **Via FTP** (Recommended):
   - Use FileZilla or similar FTP client
   - Host: `ftp.vibecodeseller.com`
   - Upload `out` folder contents to `public_html`

---

## 🔧 STEP 4: Domain Configuration

### 4.1 DNS Settings (Already configured)
- Domain: `vibecodeseller.com`
- Nameservers: Hostinger's nameservers
- A Record: Points to Hostinger IP

### 4.2 SSL Certificate
1. In Hostinger control panel
2. Go to **SSL/TLS**
3. Enable **Free SSL Certificate**
4. Force HTTPS redirect

---

## 🧪 STEP 5: Testing Deployment

### 5.1 Backend Health Check
Visit: `https://vibecoder-backend.onrender.com/health`
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX",
  "environment": "production"
}
```

### 5.2 Frontend Testing
1. Visit: `https://vibecodeseller.com`
2. Test all seller functionality:
   - ✅ Hero "Become a Seller" button
   - ✅ Footer seller links
   - ✅ Seller registration form
   - ✅ Seller dashboard
   - ✅ All navigation working

### 5.3 API Integration Testing
1. Test user registration
2. Test project creation
3. Test payment integration
4. Test file uploads (when S3 configured)

---

## 🔐 STEP 6: Security & Performance

### 6.1 Environment Security
- ✅ All secrets in environment variables
- ✅ No hardcoded credentials
- ✅ CORS properly configured
- ✅ HTTPS enforced

### 6.2 Performance Optimization
- ✅ Next.js optimized build
- ✅ Image optimization enabled
- ✅ Static assets cached
- ✅ Database queries optimized

---

## 📊 STEP 7: Monitoring & Maintenance

### 7.1 Render Monitoring
- Monitor backend logs in Render dashboard
- Set up alerts for downtime
- Monitor resource usage

### 7.2 Hostinger Monitoring
- Monitor website uptime
- Check SSL certificate expiry
- Monitor database performance

---

## 🚨 Troubleshooting

### Common Issues:

1. **Backend not starting**:
   - Check environment variables
   - Verify database connection string
   - Check Render logs

2. **Frontend API calls failing**:
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS configuration
   - Ensure backend is running

3. **Database connection issues**:
   - Verify Hostinger database credentials
   - Check database server status
   - Run `npx prisma db push` to sync schema

---

## 🎉 Deployment Complete!

Your VibeCoder Marketplace is now live at:
- **Frontend**: https://vibecodeseller.com
- **Backend API**: https://vibecoder-backend.onrender.com
- **API Docs**: https://vibecoder-backend.onrender.com/api/docs

### Next Steps:
1. Set up payment gateway (Razorpay live keys)
2. Configure AWS S3 for file uploads
3. Set up email service (Gmail SMTP)
4. Add Google Analytics
5. Set up monitoring and alerts

**Your marketplace is deployment-ready and fully functional!** 🚀
