@echo off
echo ========================================
echo Building Simplified VibeCoder Frontend for Hostinger
echo ========================================

echo.
echo [1/4] Setting environment variables...
set NEXT_PUBLIC_API_URL=https://vibecoder-backend.onrender.com
set NEXT_PUBLIC_APP_URL=https://vibecodeseller.com

echo.
echo [2/4] Creating modified next.config.js for static export...
echo /** @type {import('next').NextConfig} */ > next.config.static.js
echo const nextConfig = { >> next.config.static.js
echo   output: 'export', >> next.config.static.js
echo   images: { >> next.config.static.js
echo     unoptimized: true, >> next.config.static.js
echo     domains: ['localhost', 'vibecodeseller.com', 'images.unsplash.com', 'via.placeholder.com'], >> next.config.static.js
echo   }, >> next.config.static.js
echo   typescript: { >> next.config.static.js
echo     ignoreBuildErrors: true, >> next.config.static.js
echo   }, >> next.config.static.js
echo }; >> next.config.static.js
echo module.exports = nextConfig; >> next.config.static.js

echo.
echo [3/4] Building with static config...
rename next.config.js next.config.js.bak
rename next.config.static.js next.config.js
call npm install
call npm run build

echo.
echo [4/4] Restoring original config...
rename next.config.js next.config.static.js
rename next.config.js.bak next.config.js

echo.
if exist out\ (
    echo ========================================
    echo ✅ BUILD COMPLETED SUCCESSFULLY!
    echo ========================================
    echo.
    echo Static files created in: out/
    echo.
    echo Next Steps:
    echo 1. Upload all files from out/ folder to Hostinger public_html
    echo 2. Create .htaccess file as described in HOSTINGER_UPLOAD_GUIDE.md
    echo 3. Your website will be live at vibecodeseller.com
    echo.
    echo Files ready for Hostinger upload! 🚀
) else (
    echo ❌ Build failed! Static files not created.
)
pause
