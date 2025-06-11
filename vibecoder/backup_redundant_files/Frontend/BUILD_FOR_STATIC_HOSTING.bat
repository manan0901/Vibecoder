@echo off
echo ========================================
echo Building VibeCoder Frontend for Static Hosting
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
echo [3/3] Building for static hosting...
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
echo Static files created in: .next/ and need to be built to out/
echo.
echo Next Steps:
echo 1. Upload all files from .next/standalone folder to Hostinger public_html
echo 2. Also upload the .next/static folder to public_html/.next/static
echo 3. Upload the public folder to Hostinger public_html
echo 4. Create a .htaccess file as described in the deployment guide
echo 5. Your website will be live at vibecodeseller.com
echo.
echo Files ready for Hostinger upload! 🚀
pause
