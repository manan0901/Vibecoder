@echo off
echo ========================================
echo VibeCoder Deployment Package Creator
echo Target: vibecodeseller.com
echo ========================================

echo.
echo [1/5] Creating deployment directory...
if exist "deployment" rmdir /s /q "deployment"
mkdir deployment
mkdir deployment\backend
mkdir deployment\frontend
mkdir deployment\config

echo.
echo [2/5] Copying backend files...
xcopy "backend\src" "deployment\backend\src" /E /I /Y
xcopy "backend\prisma" "deployment\backend\prisma" /E /I /Y
copy "backend\package.json" "deployment\backend\"
copy "backend\.env" "deployment\backend\"
copy "backend\tsconfig.json" "deployment\backend\"

echo.
echo [3/5] Copying frontend files...
xcopy "frontend\app" "deployment\frontend\app" /E /I /Y
xcopy "frontend\components" "deployment\frontend\components" /E /I /Y
xcopy "frontend\public" "deployment\frontend\public" /E /I /Y
copy "frontend\package.json" "deployment\frontend\"
copy "frontend\next.config.js" "deployment\frontend\"
copy "frontend\.env.production" "deployment\frontend\"
copy "frontend\tailwind.config.js" "deployment\frontend\"
copy "frontend\postcss.config.js" "deployment\frontend\"

echo.
echo [4/5] Copying configuration files...
copy ".htaccess" "deployment\config\"
copy "QUICK_DEPLOYMENT_GUIDE.md" "deployment\"

echo.
echo [5/5] Creating deployment instructions...
echo # VibeCoder Deployment Package > deployment\README.md
echo. >> deployment\README.md
echo This package contains all files needed to deploy VibeCoder on vibecodeseller.com >> deployment\README.md
echo. >> deployment\README.md
echo ## Upload Instructions: >> deployment\README.md
echo 1. Upload 'backend' folder to public_html/backend >> deployment\README.md
echo 2. Upload 'frontend' folder to public_html/frontend >> deployment\README.md
echo 3. Upload 'config/.htaccess' to public_html/.htaccess >> deployment\README.md
echo 4. Follow QUICK_DEPLOYMENT_GUIDE.md for complete setup >> deployment\README.md
echo. >> deployment\README.md
echo ## FTP Details: >> deployment\README.md
echo Host: ftp://vibecodeseller.com >> deployment\README.md
echo Username: u238061207.vibecodeseller.com >> deployment\README.md
echo Password: Vibeisgr8@ >> deployment\README.md

echo.
echo ========================================
echo ✅ DEPLOYMENT PACKAGE CREATED SUCCESSFULLY!
echo ========================================
echo.
echo Package Location: deployment\
echo.
echo Contents:
echo - backend\          (Complete Node.js API)
echo - frontend\         (Complete Next.js app)
echo - config\           (Apache .htaccess)
echo - README.md         (Upload instructions)
echo - QUICK_DEPLOYMENT_GUIDE.md (Complete guide)
echo.
echo Next Steps:
echo 1. Zip the 'deployment' folder
echo 2. Upload via FTP or File Manager
echo 3. Follow the deployment guide
echo 4. Test and go live!
echo.
echo Your VibeCoder marketplace is ready for deployment! 🚀
echo.
pause
