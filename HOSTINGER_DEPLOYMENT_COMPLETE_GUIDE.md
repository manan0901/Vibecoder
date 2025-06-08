# 🚀 VibeCoder Complete Hostinger Deployment Guide

## 📋 **DEPLOYMENT OVERVIEW**

### **🎯 Target Configuration:**
- **Domain:** vibecodeseller.com
- **Platform:** Hostinger Hosting
- **Database:** MySQL (Already Connected ✅)
- **Frontend:** Next.js (Static Export)
- **Backend:** Node.js API
- **SSL:** Let's Encrypt (Free)

### **✅ Current Status:**
- ✅ **Code Ready:** GitHub repository live
- ✅ **Database Connected:** MySQL working
- ✅ **Local Testing:** Application running perfectly
- ✅ **Domain Available:** vibecodeseller.com

---

## 🗄️ **PHASE 1: DATABASE SETUP (COMPLETED ✅)**

### **✅ MySQL Configuration:**
```
Database: u238061207_vibecodeseller
User: u238061207_vibecoder
Password: Loveisgr8@
Host: srv1834.hstgr.io (193.203.184.212)
Status: ✅ Connected and Working
```

### **✅ Database Tables:**
- All Prisma tables created successfully
- Schema optimized for MySQL
- Ready for production data

---

## 🌐 **PHASE 2: DOMAIN & HOSTING SETUP**

### **Step 1: Hostinger Hosting Plan**
1. **Login to Hostinger Panel:** https://hpanel.hostinger.com
2. **Check Hosting Plan:**
   - Minimum: Business Plan (for Node.js support)
   - Recommended: Premium/Business for better performance
3. **Verify Features:**
   - ✅ Node.js support
   - ✅ MySQL database (already have)
   - ✅ SSL certificate
   - ✅ Custom domain support

### **Step 2: Domain Configuration**
1. **Add Domain to Hosting:**
   - Go to: Hosting → Manage → Domains
   - Add: vibecodeseller.com
   - Set as primary domain

2. **DNS Configuration:**
   ```
   Type: A Record
   Name: @
   Value: [Your Hostinger Server IP]
   
   Type: A Record  
   Name: www
   Value: [Your Hostinger Server IP]
   
   Type: CNAME
   Name: api
   Value: vibecodeseller.com
   ```

3. **SSL Certificate:**
   - Go to: Security → SSL/TLS
   - Enable: Let's Encrypt SSL
   - Force HTTPS redirect

---

## 📁 **PHASE 3: FILE STRUCTURE SETUP**

### **Step 1: Hostinger File Manager**
1. **Access File Manager:** Hosting → File Manager
2. **Navigate to:** public_html
3. **Create Directory Structure:**
   ```
   public_html/
   ├── frontend/          # Next.js build files
   ├── backend/           # Node.js API
   ├── uploads/           # File uploads
   └── .htaccess          # Apache configuration
   ```

### **Step 2: Upload Project Files**
**Option A: Git Deployment (Recommended)**
```bash
# In Hostinger terminal or SSH
cd public_html
git clone https://github.com/manan0901/Vibecoder.git .
```

**Option B: File Upload**
- Zip your project files
- Upload via File Manager
- Extract in public_html

---

## ⚙️ **PHASE 4: BACKEND DEPLOYMENT**

### **Step 1: Node.js Configuration**
1. **Enable Node.js:**
   - Go to: Advanced → Node.js
   - Select Node.js version: 18+ or 20+
   - Set Application Root: /public_html/backend
   - Set Application URL: api.vibecodeseller.com

2. **Environment Variables:**
   ```env
   # Production Environment (.env)
   NODE_ENV=production
   PORT=3000
   
   # Database (Already Working)
   DATABASE_URL="mysql://u238061207_vibecoder:Loveisgr8%40@srv1834.hstgr.io:3306/u238061207_vibecodeseller"
   
   # JWT Secrets
   JWT_SECRET="VibeCoder2024-Production-Secret-Key-Super-Secure"
   JWT_EXPIRES_IN="7d"
   JWT_REFRESH_SECRET="VibeCoder2024-Refresh-Production-Secret"
   JWT_REFRESH_EXPIRES_IN="30d"
   
   # Frontend URL
   FRONTEND_URL="https://vibecodeseller.com"
   API_VERSION="v1"
   
   # Razorpay (Indian Payment Gateway)
   RAZORPAY_KEY_ID="rzp_live_your_live_key"
   RAZORPAY_KEY_SECRET="your_live_secret"
   RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
   
   # Email (Hostinger SMTP)
   EMAIL_SERVICE="smtp"
   EMAIL_HOST="smtp.hostinger.com"
   EMAIL_PORT="587"
   EMAIL_USER="noreply@vibecodeseller.com"
   EMAIL_PASS="your_email_password"
   EMAIL_FROM="VibeCoder <noreply@vibecodeseller.com>"
   
   # File Upload
   MAX_FILE_SIZE=524288000
   UPLOAD_PATH="./uploads"
   ALLOWED_FILE_TYPES="zip,rar,7z,tar,gz,pdf,doc,docx,txt,md,js,ts,jsx,tsx,py,java,cpp"
   
   # Security
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Logging
   LOG_LEVEL="info"
   LOG_FILE="./logs/app.log"
   ```

### **Step 2: Install Dependencies**
```bash
# In backend directory
cd backend
npm install --production
```

### **Step 3: Database Migration**
```bash
# Run database setup
npx prisma generate
npx prisma db push
```

### **Step 4: Start Backend**
```bash
# Start the API server
npm start
```

---

## 🎨 **PHASE 5: FRONTEND DEPLOYMENT**

### **Step 1: Build Configuration**
1. **Update Next.js Config:**
   ```javascript
   // next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     },
     env: {
       NEXT_PUBLIC_API_URL: 'https://api.vibecodeseller.com',
       NEXT_PUBLIC_APP_URL: 'https://vibecodeseller.com',
       NEXT_PUBLIC_RAZORPAY_KEY: 'rzp_live_your_key'
     }
   }
   module.exports = nextConfig
   ```

2. **Environment Variables:**
   ```env
   # .env.local (Frontend)
   NEXT_PUBLIC_API_URL=https://api.vibecodeseller.com
   NEXT_PUBLIC_APP_URL=https://vibecodeseller.com
   NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_your_live_key
   ```

### **Step 2: Build and Deploy**
```bash
# In frontend directory
cd frontend
npm install
npm run build
```

### **Step 3: Upload Build Files**
1. **Copy build files** from `frontend/out/` 
2. **Upload to** `public_html/` (root directory)
3. **Ensure index.html** is in root

---

## 🔧 **PHASE 6: SERVER CONFIGURATION**

### **Step 1: Apache Configuration (.htaccess)**
```apache
# public_html/.htaccess
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Routes
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /backend/dist/server.js [L,P]

# Frontend Routes (Next.js)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## 🔐 **PHASE 7: AUTHENTICATION SETUP**

### **Step 1: JWT Configuration**
- ✅ **Secrets:** Strong production secrets set
- ✅ **Expiry:** 7 days for access, 30 days for refresh
- ✅ **Security:** HTTPS-only cookies

### **Step 2: Password Security**
- ✅ **Bcrypt:** 12 rounds for production
- ✅ **Validation:** Strong password requirements
- ✅ **Rate Limiting:** Login attempt protection

### **Step 3: Session Management**
- ✅ **Secure Cookies:** HttpOnly, Secure, SameSite
- ✅ **CSRF Protection:** Built-in middleware
- ✅ **XSS Protection:** Input sanitization

---

## 💳 **PHASE 8: PAYMENT INTEGRATION**

### **Step 1: Razorpay Live Setup**
1. **Create Razorpay Account:** https://razorpay.com
2. **Get Live Credentials:**
   - Live Key ID: rzp_live_xxxxx
   - Live Key Secret: xxxxx
3. **Configure Webhooks:**
   - URL: https://api.vibecodeseller.com/api/payments/webhook
   - Events: payment.captured, payment.failed

### **Step 2: Test Payments**
- ✅ **Test Mode:** Verify with test credentials
- ✅ **Live Mode:** Switch to live credentials
- ✅ **Webhook:** Test webhook endpoints

---

## 📧 **PHASE 9: EMAIL CONFIGURATION**

### **Step 1: Hostinger Email Setup**
1. **Create Email Account:**
   - Email: noreply@vibecodeseller.com
   - Password: Strong password
2. **SMTP Settings:**
   - Host: smtp.hostinger.com
   - Port: 587
   - Security: STARTTLS

### **Step 2: Email Templates**
- ✅ **Welcome Email:** User registration
- ✅ **Verification:** Email verification
- ✅ **Password Reset:** Secure reset links
- ✅ **Purchase Confirmation:** Order receipts

---

## 🧪 **PHASE 10: TESTING & VERIFICATION**

### **Step 1: Functionality Tests**
- [ ] **Homepage:** Loads correctly
- [ ] **User Registration:** Creates account
- [ ] **Login/Logout:** Authentication works
- [ ] **Project Upload:** File upload works
- [ ] **Payment:** Razorpay integration
- [ ] **Admin Panel:** Management features
- [ ] **Email:** Notifications sent

### **Step 2: Performance Tests**
- [ ] **Page Speed:** < 3 seconds load time
- [ ] **Mobile:** Responsive design
- [ ] **SSL:** HTTPS working
- [ ] **SEO:** Meta tags and sitemap

### **Step 3: Security Tests**
- [ ] **HTTPS:** Force redirect working
- [ ] **Headers:** Security headers set
- [ ] **Authentication:** JWT secure
- [ ] **File Upload:** Validation working

---

## 🚀 **PHASE 11: GO LIVE CHECKLIST**

### **Final Steps:**
- [ ] **Domain:** vibecodeseller.com pointing to server
- [ ] **SSL:** Certificate active and working
- [ ] **Database:** Production data seeded
- [ ] **Payments:** Live Razorpay configured
- [ ] **Email:** SMTP working
- [ ] **Monitoring:** Error tracking setup
- [ ] **Backup:** Database backup strategy
- [ ] **Analytics:** Google Analytics configured

### **Launch Verification:**
- [ ] **Frontend:** https://vibecodeseller.com
- [ ] **API:** https://api.vibecodeseller.com/health
- [ ] **Admin:** https://vibecodeseller.com/admin
- [ ] **Legal Pages:** All policies accessible

---

## 📞 **SUPPORT & NEXT STEPS**

### **Ready for Deployment:**
1. **Provide Hostinger hosting details**
2. **Share domain DNS access**
3. **Get Razorpay live credentials**
4. **Set up email account**
5. **Begin step-by-step deployment**

### **Post-Launch:**
- **Marketing:** SEO optimization
- **Content:** Upload initial projects
- **Users:** Onboard first sellers
- **Analytics:** Monitor performance

**Your VibeCoder marketplace is ready for professional deployment! 🎉**
