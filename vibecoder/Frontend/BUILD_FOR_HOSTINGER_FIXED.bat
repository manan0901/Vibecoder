@echo off
echo ========================================
echo Building VibeCoder Frontend for Hostinger Static Hosting
echo ========================================

echo.
echo [1/3] Setting environment variables...
set NEXT_PUBLIC_API_URL=https://vibecoder-backend.onrender.com
set NEXT_PUBLIC_APP_URL=https://vibecodeseller.com

echo.
echo [2/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Installation failed
    pause
    exit /b 1
)

echo.
echo [3/3] Building for static export...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Static files created in: out/
echo.
echo Next Steps:
echo 1. Upload all files from out/ folder to Hostinger public_html
echo 2. Create a .htaccess file as described in HOSTINGER_UPLOAD_GUIDE.md
echo 3. Update the .htaccess file with your Render backend URL
echo 4. Your website will be live at vibecodeseller.com
echo.
echo Files ready for Hostinger upload! 🚀
pause
