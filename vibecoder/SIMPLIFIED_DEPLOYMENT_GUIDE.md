# VibeCoder Deployment Guide

## 1. Deploy Backend API to Render.com

1. **Sign up at Render.com**
   - Create a free account at https://render.com
   - Link your GitHub account

2. **Create a Web Service**
   - Click "New" > "Web Service"
   - Connect to your GitHub repository
   - Select "Backend" folder
   - Configure as:
     ```
     Name: vibecoder-backend
     Runtime: Node
     Build Command: npm install && npx prisma generate
     Start Command: npm start
     ```

3. **Configure Environment Variables**
   - Add all required variables from your render.yaml file
   - Important variables:
     ```
     DATABASE_URL=mysql://u238061207_vibecoder:Loveisgr8@193.203.184.212:3306/u238061207_vibecodeseller
     JWT_SECRET=VibeCoder2024-Production-Super-Secure-JWT-Secret-Key-vibecodeseller-com
     ```

4. **Deploy and Note Your API URL**
   - Example: https://vibecoder-backend.onrender.com
   - Test it by visiting https://vibecoder-backend.onrender.com/api/health

## 2. Create Static Frontend Files for Hostinger

1. **Create Static Files**
   - Option 1: Use `CREATE_STATIC_LANDING_PAGE.bat` to create a simple landing page
     - This will generate a simple HTML landing page with Tailwind CSS
     - Files will be created in the "hostinger_static" folder
   - Option 2: Use `BUILD_FOR_HOSTINGER_FIXED.bat` to build a more complete Next.js export
     - This exports the full Next.js app as static HTML/CSS/JS
     - More complete but may have limitations with dynamic routes

2. **Create .htaccess File**
   ```apache
   RewriteEngine On
   
   # Force HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   
   # API Proxy to Render
   RewriteCond %{REQUEST_URI} ^/api/
   RewriteRule ^api/(.*)$ https://vibecoder-backend.onrender.com/api/$1 [P,L]
   
   # Frontend Routing
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   
   # Security Headers
   Header always set X-Frame-Options "DENY"
   Header always set X-Content-Type-Options "nosniff"
   Header always set X-XSS-Protection "1; mode=block"
   ```

3. **Create Additional Important Pages**
   - about.html
   - contact.html
   - terms.html
   - privacy.html

## 3. Upload to Hostinger

1. **Log in to Hostinger hPanel**
   - Go to "File Manager"
   - Navigate to "public_html"

2. **Upload Files**
   - Upload index.html, .htaccess, and other static files
   - Make sure file permissions are set correctly (644 for files, 755 for directories)

3. **Test Your Website**
   - Visit your domain: https://vibecodeseller.com
   - Test API connectivity
   - Make sure routes work correctly

## 4. Connect Frontend to Backend

In your HTML files, use JavaScript fetch API to connect to your backend:

```javascript
// Example API call
async function fetchProjects() {
  try {
    const response = await fetch('https://vibecoder-backend.onrender.com/api/projects');
    const data = await response.json();
    // Display projects
    console.log(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}
```

## 5. Testing & Troubleshooting

1. **Test Backend API**
   - Use tools like Postman to test API endpoints
   - Check for CORS issues (may need to update CORS settings in backend)

2. **Test Frontend**
   - Test all forms and API interactions
   - Test on different browsers and devices
   - Check console for errors

3. **Common Issues**
   - CORS errors: Make sure backend allows your frontend domain
   - 404 errors: Check .htaccess configuration
   - API connectivity: Ensure backend is running and accessible
