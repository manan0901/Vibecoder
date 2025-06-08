# 🚀 VibeCoder Hostinger Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [x] Code pushed to GitHub: https://github.com/manan0901/Vibecoder.git
- [x] Frontend optimized and tested
- [x] Backend API endpoints ready
- [x] Environment variables documented
- [x] Database schema ready

### ✅ Hostinger Requirements
- [ ] Hostinger hosting plan (Business or higher recommended)
- [ ] Domain name configured
- [ ] SSL certificate (Let's Encrypt)
- [ ] Node.js support enabled
- [ ] Database access (MySQL/PostgreSQL)

## 🔧 Deployment Steps

### Step 1: Hostinger Setup

1. **Login to Hostinger Panel:**
   - Go to: https://hpanel.hostinger.com
   - Login with your credentials

2. **Enable Node.js:**
   - Go to Advanced → Node.js
   - Enable Node.js (version 18+)
   - Set document root to `/public_html`

3. **Database Setup:**
   - Go to Databases → MySQL/PostgreSQL
   - Create new database: `vibecoder_db`
   - Create user with full privileges
   - Note connection details

### Step 2: File Upload

1. **Upload via File Manager:**
   - Go to Files → File Manager
   - Upload project files to `/public_html`
   - Or use Git deployment (recommended)

2. **Git Deployment (Recommended):**
   ```bash
   # In Hostinger terminal or SSH
   cd /public_html
   git clone https://github.com/manan0901/Vibecoder.git .
   ```

### Step 3: Environment Configuration

1. **Backend Environment (.env):**
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/vibecoder_db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-production"
   JWT_EXPIRES_IN="7d"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_live_your_live_stripe_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   
   # Email
   SMTP_HOST="smtp.hostinger.com"
   SMTP_PORT="587"
   SMTP_USER="noreply@yourdomain.com"
   SMTP_PASS="your_email_password"
   
   # Environment
   NODE_ENV="production"
   PORT="3000"
   ```

2. **Frontend Environment (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_live_stripe_key"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

### Step 4: Install Dependencies

```bash
# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install --production
npm run build
```

### Step 5: Database Migration

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### Step 6: Start Application

1. **Backend (API Server):**
   ```bash
   cd backend
   npm start
   ```

2. **Frontend (Next.js):**
   ```bash
   cd frontend
   npm start
   ```

## 🌐 Domain Configuration

### DNS Settings
```
Type: A
Name: @
Value: [Hostinger Server IP]

Type: CNAME
Name: www
Value: yourdomain.com
```

### SSL Certificate
- Enable Let's Encrypt in Hostinger panel
- Force HTTPS redirect
- Update all URLs to use HTTPS

## 🔒 Security Configuration

### 1. Environment Variables
- Never commit .env files
- Use strong JWT secrets
- Enable CORS for your domain only

### 2. Database Security
- Use strong database passwords
- Limit database user privileges
- Enable SSL connections

### 3. File Permissions
```bash
chmod 755 /public_html
chmod 644 /public_html/.env
chmod -R 755 /public_html/uploads
```

## 📊 Performance Optimization

### 1. Frontend Optimization
- Enable Gzip compression
- Configure CDN (Cloudflare)
- Optimize images and assets
- Enable browser caching

### 2. Backend Optimization
- Enable Redis caching
- Configure rate limiting
- Optimize database queries
- Enable compression middleware

## 🧪 Testing Production

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Login/logout functional
- [ ] Admin panel accessible
- [ ] Payment processing works
- [ ] File uploads working
- [ ] Email notifications sent

### 2. Performance Tests
- [ ] Page load times < 3s
- [ ] API response times < 500ms
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 3. Security Tests
- [ ] HTTPS enforced
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting active

## 🚀 Go Live Checklist

### Final Steps
- [ ] Domain pointing to Hostinger
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Database connected and seeded
- [ ] Email service configured
- [ ] Payment gateway in live mode
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented

### Post-Launch
- [ ] Monitor server logs
- [ ] Check error rates
- [ ] Verify payment processing
- [ ] Test user registration flow
- [ ] Monitor performance metrics
- [ ] Set up automated backups

## 📞 Support

### Hostinger Support
- Live Chat: Available 24/7
- Knowledge Base: https://support.hostinger.com
- Community Forum: https://community.hostinger.com

### VibeCoder Support
- GitHub Issues: https://github.com/manan0901/Vibecoder/issues
- Documentation: Available in repository
- Email: support@yourdomain.com

## 🎯 Success Metrics

After deployment, monitor:
- **Uptime:** 99.9%+
- **Response Time:** < 2s
- **Error Rate:** < 1%
- **User Registration:** Functional
- **Payment Processing:** Working
- **SEO Rankings:** Improving

Your VibeCoder marketplace will be live and ready for users! 🌟
