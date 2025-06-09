# 📁 Hostinger Upload Guide - VibeCoder Static Deployment

## 🎯 **UPLOAD STATIC FILES TO HOSTINGER**

After building the frontend, upload the static files to your Hostinger hosting.

### **📋 Files to Upload:**
Upload all files from the `out/` folder to your Hostinger `public_html` directory.

### **📤 Upload Methods:**

#### **Method 1: Hostinger File Manager (Recommended)**
1. **Login to Hostinger Panel:** https://hpanel.hostinger.com
2. **Go to:** File Manager
3. **Navigate to:** public_html
4. **Clear existing files** (backup first if needed)
5. **Upload all files** from the `out/` folder
6. **Extract if uploaded as ZIP**

#### **Method 2: FTP Upload**
1. **FTP Details:**
   - Host: vibecodeseller.com
   - Username: u238061207.vibecodeseller.com
   - Password: Vibeisgr8@
   - Port: 21
2. **Upload all files** from `out/` to `public_html/`

### **🔧 Required .htaccess File**

Create this `.htaccess` file in your `public_html/` directory:

```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Proxy to Render
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ https://YOUR_RENDER_APP_NAME.onrender.com/api/$1 [P,L]

# Frontend Routing for Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# CORS for API
Header always set Access-Control-Allow-Origin "https://vibecodeseller.com"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

# Cache Control
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

### **🧪 Testing After Upload:**

1. **Visit:** https://vibecodeseller.com
2. **Check:** Homepage loads correctly
3. **Test:** API calls work (check browser console)
4. **Verify:** All pages and features functional

### **🔧 Troubleshooting:**

#### **If API calls fail:**
- Check Railway backend is running
- Verify .htaccess proxy rules
- Update API URL in .env.production

#### **If pages don't load:**
- Check .htaccess routing rules
- Verify all files uploaded correctly
- Check file permissions (755 for folders, 644 for files)

### **✅ Success Indicators:**

- ✅ Homepage loads at vibecodeseller.com
- ✅ API calls work through proxy
- ✅ User registration/login functional
- ✅ Admin panel accessible
- ✅ Mobile responsive design working
- ✅ SSL certificate active (green lock)

## 🎉 **DEPLOYMENT COMPLETE!**

Your VibeCoder marketplace will be live at:
- **Website:** https://vibecodeseller.com
- **Admin:** https://vibecodeseller.com/admin
- **API:** Proxied through Railway backend

**Professional marketplace with PHP hosting! 🚀**
