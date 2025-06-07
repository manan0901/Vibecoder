# 🔐 VibeCoder Security Checklist - Simple Steps

## 🚨 **BEFORE DEPLOYMENT - MUST DO ALL THESE**

---

## ✅ **STEP 1: Create Secure Environment File**

### **Copy and Update Environment:**
```bash
# 1. Copy the template
cp .env.production.template .env.production

# 2. Edit the file and replace these values:
```

### **🔑 Replace These Values (CRITICAL):**
- `yourdomain.com` → Your actual domain
- `REPLACE_WITH_64_CHARACTER_RANDOM_STRING` → Generate secure secrets
- `your_db_user:your_secure_password@your_host:5432/your_database` → Hostinger database details
- `sk_live_your_actual_live_stripe_secret_key` → Your live Stripe secret key
- `pk_live_your_actual_live_stripe_publishable_key` → Your live Stripe public key
- `your-business-email@gmail.com` → Your Gmail address
- `your_gmail_app_password_16_characters` → Your Gmail App Password

---

## ✅ **STEP 2: Generate Secure Secrets**

### **🔐 Generate 64-Character Secrets:**

**Option 1: Online Generator**
1. Go to: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
2. Select "512-bit"
3. Click "Generate"
4. Copy the result

**Option 2: Command Line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**You need 3 different secrets for:**
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`

---

## ✅ **STEP 3: Set Up Gmail App Password**

### **🔐 Create Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate password for "Mail"
5. Use this 16-character password in `EMAIL_PASS`

---

## ✅ **STEP 4: Get Hostinger Database Details**

### **📊 From Hostinger Control Panel:**
1. Go to "Databases" section
2. Create new PostgreSQL database
3. Note down:
   - Database name
   - Username
   - Password
   - Host
   - Port

### **🔗 Create Database URL:**
```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

---

## ✅ **STEP 5: Set Up Stripe Live Keys**

### **💳 From Stripe Dashboard:**
1. Switch to "Live" mode (not Test)
2. Go to "Developers" → "API keys"
3. Copy:
   - Secret key (starts with `sk_live_`)
   - Publishable key (starts with `pk_live_`)
4. Set up webhook endpoint for your domain

---

## ✅ **STEP 6: Configure Hostinger**

### **🌐 In Hostinger Control Panel:**

**1. Enable Node.js:**
- Go to "Node.js" section
- Select version 18 or higher
- Set startup file: `backend/dist/server.js`

**2. Set Environment Variables:**
- Add ALL variables from your `.env.production` file
- Set them in Node.js app settings (not as files)

**3. Enable SSL:**
- Go to "SSL" section
- Enable "Free SSL Certificate"
- Force HTTPS redirects

---

## ✅ **STEP 7: Upload and Deploy**

### **📤 Upload Your Code:**

**Option 1: File Manager**
1. Zip your project
2. Upload via Hostinger File Manager
3. Extract in `public_html`

**Option 2: Git (Recommended)**
```bash
# In Hostinger terminal or SSH:
cd public_html
git clone https://github.com/YOUR_USERNAME/vibecoder-marketplace.git .
```

### **🚀 Install and Build:**
```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Build the application
npm run build

# Run database migrations
cd backend && npx prisma migrate deploy

# Start the application
npm start
```

---

## ✅ **STEP 8: Security Verification**

### **🔍 Test These After Deployment:**

**1. SSL Certificate:**
- Visit `https://yourdomain.com`
- Check for green lock icon
- Test: https://www.ssllabs.com/ssltest/

**2. API Security:**
```bash
# Test CORS protection
curl -H "Origin: https://malicious-site.com" https://yourdomain.com/api/health

# Test rate limiting
for i in {1..200}; do curl https://yourdomain.com/api/health; done
```

**3. File Upload Security:**
- Try uploading a .php file (should be rejected)
- Try uploading a large file (should be rejected)

**4. Authentication:**
- Test user registration
- Test login/logout
- Test password requirements

---

## 🚨 **SECURITY WARNINGS - NEVER DO THIS:**

- ❌ Use development secrets in production
- ❌ Commit `.env` files to Git
- ❌ Use weak passwords (less than 16 characters)
- ❌ Allow all CORS origins (`*`)
- ❌ Disable security features
- ❌ Use HTTP in production (always HTTPS)
- ❌ Store API keys in frontend code
- ❌ Skip SSL certificate
- ❌ Use default database names/users
- ❌ Use Stripe test keys in production

---

## ✅ **FINAL VERIFICATION CHECKLIST**

Before going live, verify ALL these:

- [ ] ✅ `NODE_ENV=production`
- [ ] ✅ All secrets are 64+ characters and unique
- [ ] ✅ Database password is strong (16+ chars)
- [ ] ✅ CORS only allows your domain
- [ ] ✅ SSL certificate is active and working
- [ ] ✅ Stripe keys are LIVE (not test)
- [ ] ✅ Email uses App Password (not regular password)
- [ ] ✅ File upload restrictions are working
- [ ] ✅ Rate limiting is active
- [ ] ✅ Security headers are configured
- [ ] ✅ No sensitive data in code/logs
- [ ] ✅ All API endpoints respond correctly
- [ ] ✅ User registration/login works
- [ ] ✅ Payment processing works (test with small amount)
- [ ] ✅ File uploads work and are secure
- [ ] ✅ Email notifications work

---

## 🆘 **If Something Goes Wrong:**

**1. Check Logs:**
- Hostinger control panel → Node.js → View logs
- Look for error messages

**2. Common Issues:**
- Database connection: Check DATABASE_URL format
- CORS errors: Verify domain in CORS settings
- SSL issues: Wait 24 hours for certificate activation
- Email not working: Check Gmail App Password

**3. Emergency Actions:**
- Change all passwords immediately
- Check recent database changes
- Review access logs
- Contact Hostinger support

---

## 🎯 **You're Ready!**

Once all checkboxes are ✅, your VibeCoder marketplace will be:
- **Secure** against common attacks
- **Fast** and optimized for production
- **Scalable** to handle thousands of users
- **Professional** and ready for business

**Your secure marketplace empire starts now!** 🚀🔐
