# 🔐 VibeCoder Security Guide for Hostinger Deployment

## 🚨 **CRITICAL: MUST DO BEFORE GOING LIVE**

---

## 📋 **STEP 1: SECURE ENVIRONMENT VARIABLES**

### **🔑 Create `.env.production` File**

**⚠️ NEVER use development values in production!**

```bash
# 1. ENVIRONMENT (CRITICAL)
NODE_ENV=production

# 2. YOUR DOMAIN (Replace with your actual domain)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# 3. DATABASE (Get from Hostinger)
DATABASE_URL=postgresql://your_db_user:your_secure_password@your_host:5432/your_database

# 4. JWT SECRETS (⚠️ GENERATE NEW SECRETS - 64 characters each)
JWT_SECRET=REPLACE_WITH_64_CHARACTER_RANDOM_STRING
JWT_REFRESH_SECRET=REPLACE_WITH_ANOTHER_64_CHARACTER_STRING

# 5. STRIPE LIVE KEYS (⚠️ Use LIVE keys only)
STRIPE_SECRET_KEY=sk_live_your_actual_live_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# 6. EMAIL SECURITY
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASS=your_gmail_app_password

# 7. SECURITY SETTINGS
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=REPLACE_WITH_64_CHARACTER_SESSION_SECRET
SESSION_SECURE=true
SESSION_HTTP_ONLY=true

# 8. PRODUCTION SECURITY
HELMET_CSP_ENABLED=true
HELMET_HSTS_ENABLED=true
TRUST_PROXY=true
```

### **🔐 How to Generate Secure Secrets:**

**Method 1: Online (Recommended)**
1. Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
2. Select "512-bit"
3. Click "Generate"
4. Copy the 64-character result

**Method 2: Command Line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 **STEP 2: SECURE BACKEND FILES**

### **🔒 Update CORS Configuration**

**Edit `backend/src/server.ts` - Find the CORS section and replace:**

```javascript
// CORS configuration - SECURE VERSION
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://yourdomain.com',  // Replace with your domain
      'https://www.yourdomain.com'  // Replace with your domain
    ];
    
    // In production, be strict about origins
    if (process.env.NODE_ENV === 'production') {
      if (!origin) {
        return callback(new Error('Origin required in production'));
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development mode
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}));
```

### **🔒 Update Security Headers**

**In `backend/src/server.ts` - Update Helmet configuration:**

```javascript
// Enhanced security headers for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

## 📋 **STEP 3: SECURE FRONTEND FILES**

### **🔒 Update Next.js Configuration**

**Edit `frontend/next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  
  // API rewrites for security
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Production optimizations
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['yourdomain.com'], // Replace with your domain
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
```

---

## 📋 **STEP 4: DATABASE SECURITY**

### **🔒 Secure Database Connection**

**In Hostinger PostgreSQL panel:**

1. **Create Strong Database Password:**
   - Use 16+ characters
   - Include uppercase, lowercase, numbers, symbols
   - Example: `MySecure#DB2024!Pass`

2. **Limit Database Access:**
   - Only allow connections from your application
   - Don't use default database names
   - Use specific user (not root/admin)

3. **Database URL Format:**
```bash
DATABASE_URL=postgresql://your_db_user:your_secure_password@your_host:5432/your_database_name?sslmode=require
```

---

## 📋 **STEP 5: FILE SECURITY**

### **🔒 Secure File Uploads**

**Create `backend/uploads/.htaccess` file:**

```apache
# Deny direct access to uploaded files
<Files "*">
    Order Deny,Allow
    Deny from all
</Files>

# Only allow specific file types
<FilesMatch "\.(jpg|jpeg|png|gif|pdf|zip)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# Prevent script execution
RemoveHandler .php .phtml .php3 .php4 .php5 .js
RemoveType .php .phtml .php3 .php4 .php5 .js
```

---

## 📋 **STEP 6: HOSTINGER SPECIFIC SECURITY**

### **🔒 Hostinger Control Panel Settings**

1. **Enable SSL Certificate:**
   - Go to SSL section in Hostinger panel
   - Enable "Free SSL Certificate"
   - Force HTTPS redirects

2. **Set File Permissions:**
   - Folders: 755
   - Files: 644
   - Config files: 600

3. **Enable Cloudflare (if available):**
   - DDoS protection
   - Web Application Firewall
   - Rate limiting

### **🔒 Node.js App Settings in Hostinger:**

1. **Set Environment Variables:**
   - Add all variables from `.env.production`
   - Never store secrets in code

2. **Configure Startup:**
   - Startup file: `backend/dist/server.js`
   - Node.js version: 18 or higher

---

## 📋 **STEP 7: DEPLOYMENT SECURITY CHECKLIST**

### **✅ Before Going Live - VERIFY ALL:**

- [ ] ✅ All secrets are 64+ characters and unique
- [ ] ✅ NODE_ENV=production
- [ ] ✅ Database password is strong (16+ chars)
- [ ] ✅ CORS only allows your domain
- [ ] ✅ SSL certificate is active
- [ ] ✅ Stripe keys are LIVE (not test)
- [ ] ✅ Email uses App Password (not regular password)
- [ ] ✅ File upload restrictions are active
- [ ] ✅ Rate limiting is enabled
- [ ] ✅ Security headers are configured
- [ ] ✅ No sensitive data in code/logs

### **🚨 NEVER DO THIS:**

- ❌ Use development secrets in production
- ❌ Commit `.env` files to Git
- ❌ Use weak passwords
- ❌ Allow all CORS origins (*)
- ❌ Disable security features
- ❌ Use HTTP in production (always HTTPS)
- ❌ Store API keys in frontend code
- ❌ Skip SSL certificate
- ❌ Use default database names/users

---

## 📋 **STEP 8: POST-DEPLOYMENT SECURITY**

### **🔒 After Going Live:**

1. **Test Security:**
   - Check SSL rating: https://www.ssllabs.com/ssltest/
   - Verify CORS is working
   - Test rate limiting
   - Check file upload restrictions

2. **Monitor Security:**
   - Check logs regularly
   - Monitor failed login attempts
   - Watch for unusual traffic patterns
   - Set up uptime monitoring

3. **Regular Updates:**
   - Update dependencies monthly
   - Rotate secrets every 6 months
   - Review access logs weekly
   - Backup database daily

---

## 🆘 **EMERGENCY SECURITY CONTACTS**

If you suspect a security breach:

1. **Immediately:**
   - Change all passwords and secrets
   - Check recent database changes
   - Review access logs

2. **Contact:**
   - Hostinger support
   - Your domain registrar
   - Stripe support (if payment related)

---

## ✅ **SECURITY VERIFICATION COMMANDS**

**Test your deployment security:**

```bash
# Test HTTPS redirect
curl -I http://yourdomain.com

# Test CORS
curl -H "Origin: https://malicious-site.com" https://yourdomain.com/api/health

# Test rate limiting
for i in {1..200}; do curl https://yourdomain.com/api/health; done
```

**🎯 Your marketplace will be secure and ready for production!** 🔐
