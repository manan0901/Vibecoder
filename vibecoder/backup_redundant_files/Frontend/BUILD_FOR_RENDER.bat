@echo off
echo ========================================
echo Building VibeCoder Frontend for Render + Hostinger
echo ========================================

echo.
echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Installation failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Exporting static files...
call npx next export
if %errorlevel% neq 0 (
    echo ❌ Export failed
    pause
    exit /b 1
)

echo.
echo [4/4] Creating .htaccess for Hostinger...
echo RewriteEngine On > out\.htaccess
echo. >> out\.htaccess
echo # Force HTTPS >> out\.htaccess
echo RewriteCond %%{HTTPS} off >> out\.htaccess
echo RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301] >> out\.htaccess
echo. >> out\.htaccess
echo # API Proxy to Render >> out\.htaccess
echo RewriteCond %%{REQUEST_URI} ^^/api/ >> out\.htaccess
echo RewriteRule ^^api/(.*)$ https://YOUR_RENDER_APP_NAME.onrender.com/api/$1 [P,L] >> out\.htaccess
echo. >> out\.htaccess
echo # Frontend Routing >> out\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-f >> out\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-d >> out\.htaccess
echo RewriteRule ^^(.*)$ /index.html [L] >> out\.htaccess
echo. >> out\.htaccess
echo # Security Headers >> out\.htaccess
echo Header always set X-Frame-Options "DENY" >> out\.htaccess
echo Header always set X-Content-Type-Options "nosniff" >> out\.htaccess
echo Header always set X-XSS-Protection "1; mode=block" >> out\.htaccess

echo.
echo ========================================
echo ✅ BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Static files created in: out/
echo.
echo Next Steps:
echo 1. Update .htaccess with your actual Render URL
echo 2. Upload all files from out/ folder to Hostinger public_html
echo 3. Your website will be live at vibecodeseller.com
echo.
echo Files ready for Hostinger upload! 🚀
pause
