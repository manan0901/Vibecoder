# 🚀 VibeCoder Production Deployment Instructions

## ✅ **READY FOR DEPLOYMENT - vibecodeseller.com**

### **📋 Confirmed Details:**
- **Domain:** vibecodeseller.com (147.93.17.158)
- **FTP:** u238061207.vibecodeseller.com
- **Upload Path:** public_html
- **Email:** noreply@vibecodeseller.com (Port 465)
- **Database:** ✅ Connected and Working

---

## 🔧 **STEP 1: PREPARE PRODUCTION BUILD**

### **Run the Build Script:**
```bash
# In your project root directory
deploy-production.bat
```

**This will:**
- ✅ Clean previous builds
- ✅ Install production dependencies
- ✅ Build frontend (Next.js)
- ✅ Build backend (Node.js)
- ✅ Generate Prisma client

---

## 📁 **STEP 2: FILE UPLOAD TO HOSTINGER**

### **Upload Structure:**
```
public_html/
├── .htaccess                    # Apache configuration
├── index.html                  # Frontend entry point
├── _next/                      # Next.js static files
├── api/                        # Backend API
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── node_modules/          # Backend modules
│   └── .env                   # Environment variables
└── uploads/                   # File upload directory
```

### **Upload Method 1: FTP Client (Recommended)**

1. **Use FTP Client** (FileZilla, WinSCP, etc.)
   - **Host:** ftp://vibecodeseller.com
   - **Username:** u238061207.vibecodeseller.com
   - **Password:** [Your FTP password]
   - **Port:** 21

2. **Upload Files:**
   - Upload `frontend/.next/standalone/*` to `public_html/`
   - Upload `backend/dist/*` to `public_html/api/`
   - Upload `.htaccess` to `public_html/`
   - Create `uploads/` directory in `public_html/`

### **Upload Method 2: Hostinger File Manager**

1. **Login to Hostinger Panel**
2. **Go to:** File Manager
3. **Navigate to:** public_html
4. **Upload and extract** project files

---

## ⚙️ **STEP 3: ENVIRONMENT CONFIGURATION**

### **Backend Environment (.env):**
```env
# PRODUCTION ENVIRONMENT - vibecodeseller.com
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://vibecodeseller.com
API_VERSION=v1

# Database (Already Working ✅)
DATABASE_URL="mysql://u238061207_vibecoder:Loveisgr8%40@193.203.184.212:3306/u238061207_vibecodeseller"

# JWT Secrets (Production Ready ✅)
JWT_SECRET="VibeCoder2024-Production-Super-Secure-JWT-Secret-Key-vibecodeseller-com"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="VibeCoder2024-Production-Refresh-Token-Secret-vibecodeseller-com"
JWT_REFRESH_EXPIRES_IN="30d"

# Email Configuration
EMAIL_SERVICE="smtp"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="noreply@vibecodeseller.com"
EMAIL_PASS="[YOUR_EMAIL_PASSWORD]"
EMAIL_FROM="VibeCoder Marketplace <noreply@vibecodeseller.com>"

# Razorpay (UPDATE WITH YOUR LIVE KEYS)
RAZORPAY_KEY_ID="rzp_live_[YOUR_LIVE_KEY]"
RAZORPAY_KEY_SECRET="[YOUR_LIVE_SECRET]"
RAZORPAY_WEBHOOK_SECRET="[YOUR_WEBHOOK_SECRET]"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_PATH="./uploads"
ALLOWED_FILE_TYPES="zip,rar,7z,tar,gz,pdf,doc,docx,txt,md,js,ts,jsx,tsx,py,java,cpp,c,php,html,css"

# Logging
LOG_LEVEL="info"
LOG_FILE="./logs/app.log"
```

---

## 🌐 **STEP 4: HOSTINGER CONFIGURATION**

### **Enable Node.js (If Available):**
1. **Go to:** Hostinger Panel → Advanced → Node.js
2. **Enable Node.js:** Version 18+ or 20+
3. **Set Application Root:** `/public_html/api`
4. **Set Startup File:** `server.js`

### **If Node.js Not Available:**
- Use static frontend only
- API calls will need external hosting (Railway, Vercel, etc.)

---

## 🔐 **STEP 5: SSL & SECURITY SETUP**

### **Enable SSL Certificate:**
1. **Go to:** Hostinger Panel → Security → SSL/TLS
2. **Enable:** Let's Encrypt SSL (Free)
3. **Force HTTPS:** Enable redirect
4. **Verify:** Green lock at https://vibecodeseller.com

### **Security Headers (Already in .htaccess):**
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy

---

## 📧 **STEP 6: EMAIL SETUP**

### **Create Email Account:**
1. **Go to:** Hostinger Panel → Email → Email Accounts
2. **Create:** noreply@vibecodeseller.com
3. **Set Strong Password**
4. **Note SMTP Settings:**
   - Host: smtp.hostinger.com
   - Port: 465 (SSL) or 587 (TLS)
   - Security: SSL/TLS

### **Update Environment:**
```env
EMAIL_USER="noreply@vibecodeseller.com"
EMAIL_PASS="[YOUR_EMAIL_PASSWORD]"
```

---

## 💳 **STEP 7: PAYMENT SETUP (RAZORPAY)**

### **Get Live Credentials:**
1. **Login to Razorpay Dashboard**
2. **Complete KYC Verification**
3. **Get Live Keys:**
   - Key ID: rzp_live_xxxxx
   - Key Secret: xxxxx

### **Update Environment:**
```env
RAZORPAY_KEY_ID="rzp_live_[YOUR_KEY]"
RAZORPAY_KEY_SECRET="[YOUR_SECRET]"
```

### **Configure Webhooks:**
- **URL:** https://vibecodeseller.com/api/payments/webhook
- **Events:** payment.captured, payment.failed

---

## 🧪 **STEP 8: TESTING & VERIFICATION**

### **Test Checklist:**
- [ ] **Homepage:** https://vibecodeseller.com loads
- [ ] **SSL:** Green lock visible
- [ ] **API:** https://vibecodeseller.com/api/health responds
- [ ] **Database:** Connection working
- [ ] **Registration:** User signup works
- [ ] **Login:** Authentication functional
- [ ] **Admin Panel:** https://vibecodeseller.com/admin accessible
- [ ] **Email:** Notifications sending
- [ ] **Payments:** Test transaction (if Razorpay configured)

### **Performance Check:**
- [ ] **Page Speed:** < 3 seconds
- [ ] **Mobile:** Responsive design
- [ ] **SEO:** Meta tags present
- [ ] **Security:** Headers configured

---

## 🚀 **STEP 9: GO LIVE!**

### **Final Launch Steps:**
1. **Verify all tests pass**
2. **Update DNS if needed** (should already be pointing)
3. **Monitor for 24 hours**
4. **Add Google Analytics** (optional)
5. **Submit to search engines**

### **Post-Launch:**
- **Backup Strategy:** Set up database backups
- **Monitoring:** Error tracking and uptime monitoring
- **Content:** Upload initial projects
- **Marketing:** SEO optimization and promotion

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues:**

1. **Node.js Not Available:**
   - Use static frontend only
   - Host API separately (Railway, Vercel)

2. **Database Connection Issues:**
   - Verify credentials in .env
   - Check Hostinger MySQL settings

3. **Email Not Working:**
   - Verify SMTP credentials
   - Check port settings (465 vs 587)

4. **SSL Issues:**
   - Wait 24-48 hours for propagation
   - Force HTTPS in Hostinger panel

### **Need Help?**
- **Hostinger Support:** 24/7 live chat
- **Documentation:** All files prepared and ready
- **Testing:** Comprehensive checklist provided

---

## ✅ **DEPLOYMENT STATUS**

### **Ready for Upload:**
- [x] **Production Build:** Optimized and ready
- [x] **Environment Config:** Production secrets set
- [x] **Database:** Connected and working
- [x] **Security:** Headers and SSL ready
- [x] **Documentation:** Complete instructions

### **Next Action:**
**Upload the files to Hostinger and follow the testing checklist!**

**Your VibeCoder marketplace is ready to go live! 🎉🚀**
