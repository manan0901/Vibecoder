@echo off
echo ========================================
echo Building VibeCoder Frontend for Hostinger
echo ========================================

echo.
echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Installation failed
    pause
    exit /b 1
)

echo.
echo [2/3] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Exporting static files...
call npx next export
if %errorlevel% neq 0 (
    echo ❌ Export failed
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
echo 1. Update .env.production with your Railway API URL
echo 2. Run this script again after updating the URL
echo 3. Upload all files from out/ folder to Hostinger public_html
echo 4. Your website will be live at vibecodeseller.com
echo.
echo Files ready for Hostinger upload! 🚀
pause
