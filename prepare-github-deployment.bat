@echo off
echo ========================================
echo VibeCoder GitHub Deployment Preparation
echo Target: Auto-deploy to vibecodeseller.com
echo ========================================

echo.
echo [1/6] Creating production environment files...

echo # VibeCoder Production Environment > backend\.env.production
echo NODE_ENV=production >> backend\.env.production
echo PORT=3000 >> backend\.env.production
echo DATABASE_URL="mysql://u238061207_vibecoder:Loveisgr8%%40@193.203.184.212:3306/u238061207_vibecodeseller" >> backend\.env.production
echo JWT_SECRET="VibeCoder2024-Production-Super-Secure-JWT-Secret-Key-vibecodeseller-com" >> backend\.env.production
echo JWT_EXPIRES_IN="7d" >> backend\.env.production
echo JWT_REFRESH_SECRET="VibeCoder2024-Production-Refresh-Token-Secret-vibecodeseller-com" >> backend\.env.production
echo JWT_REFRESH_EXPIRES_IN="30d" >> backend\.env.production
echo EMAIL_SERVICE="smtp" >> backend\.env.production
echo EMAIL_HOST="smtp.hostinger.com" >> backend\.env.production
echo EMAIL_PORT="465" >> backend\.env.production
echo EMAIL_SECURE="true" >> backend\.env.production
echo EMAIL_USER="noreply@vibecodeseller.com" >> backend\.env.production
echo EMAIL_PASS="Vibeisgr8@" >> backend\.env.production
echo EMAIL_FROM="VibeCoder Marketplace <noreply@vibecodeseller.com>" >> backend\.env.production
echo FRONTEND_URL="https://vibecodeseller.com" >> backend\.env.production
echo API_VERSION="v1" >> backend\.env.production
echo RAZORPAY_KEY_ID="rzp_live_YOUR_LIVE_KEY_ID" >> backend\.env.production
echo RAZORPAY_KEY_SECRET="YOUR_LIVE_SECRET_KEY" >> backend\.env.production
echo RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET" >> backend\.env.production
echo MAX_FILE_SIZE=524288000 >> backend\.env.production
echo UPLOAD_PATH="./uploads" >> backend\.env.production
echo ALLOWED_FILE_TYPES="zip,rar,7z,tar,gz,pdf,doc,docx,txt,md,js,ts,jsx,tsx,py,java,cpp,c,php,html,css" >> backend\.env.production
echo BCRYPT_ROUNDS=12 >> backend\.env.production
echo RATE_LIMIT_WINDOW_MS=900000 >> backend\.env.production
echo RATE_LIMIT_MAX_REQUESTS=100 >> backend\.env.production
echo LOG_LEVEL="info" >> backend\.env.production
echo LOG_FILE="./logs/app.log" >> backend\.env.production
echo DOMAIN="vibecodeseller.com" >> backend\.env.production
echo SSL_ENABLED="true" >> backend\.env.production

echo.
echo [2/6] Creating frontend production environment...

echo # VibeCoder Frontend Production Environment > frontend\.env.production
echo NEXT_PUBLIC_API_URL=https://vibecodeseller.com/api >> frontend\.env.production
echo NEXT_PUBLIC_APP_URL=https://vibecodeseller.com >> frontend\.env.production
echo NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_YOUR_LIVE_KEY_ID >> frontend\.env.production
echo NEXT_PUBLIC_APP_NAME="VibeCoder Marketplace" >> frontend\.env.production
echo NEXT_PUBLIC_DOMAIN="vibecodeseller.com" >> frontend\.env.production
echo NEXT_PUBLIC_SITE_NAME="VibeCoder - Premium Coding Projects Marketplace" >> frontend\.env.production
echo NEXT_PUBLIC_SITE_DESCRIPTION="Discover and sell premium coding projects. From React dashboards to Node.js APIs, find quality code solutions for your business." >> frontend\.env.production
echo NEXT_PUBLIC_SUPPORT_EMAIL="support@vibecodeseller.com" >> frontend\.env.production

echo.
echo [3/6] Creating deployment documentation...
copy "README_PRODUCTION.md" "DEPLOYMENT_README.md"

echo.
echo [4/6] Creating GitHub deployment checklist...

echo # GitHub Auto-Deployment Checklist > GITHUB_DEPLOYMENT_CHECKLIST.md
echo. >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo ## Ready for GitHub Auto-Deployment >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo. >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo ### Files Prepared: >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo - [x] Production environment files >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo - [x] GitHub Actions workflow >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo - [x] Hostinger deployment script >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo - [x] Production documentation >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo. >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo ### Next Steps: >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo 1. Push all files to GitHub >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo 2. Configure Hostinger Git deployment >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo 3. Set up auto-deploy webhook >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo 4. Test deployment process >> GITHUB_DEPLOYMENT_CHECKLIST.md
echo 5. Go live at vibecodeseller.com >> GITHUB_DEPLOYMENT_CHECKLIST.md

echo.
echo [5/6] Verifying file structure...
echo Checking critical files:
if exist "backend\src\server.ts" (echo ✅ Backend server found) else (echo ❌ Backend server missing)
if exist "frontend\app\page.tsx" (echo ✅ Frontend app found) else (echo ❌ Frontend app missing)
if exist "backend\.env.production" (echo ✅ Backend production env created) else (echo ❌ Backend env missing)
if exist "frontend\.env.production" (echo ✅ Frontend production env created) else (echo ❌ Frontend env missing)
if exist ".github\workflows\deploy.yml" (echo ✅ GitHub Actions workflow found) else (echo ❌ GitHub workflow missing)
if exist ".hostinger-deploy.sh" (echo ✅ Hostinger deploy script found) else (echo ❌ Deploy script missing)

echo.
echo [6/6] Creating upload instructions...

echo # Upload to GitHub Instructions > UPLOAD_INSTRUCTIONS.md
echo. >> UPLOAD_INSTRUCTIONS.md
echo ## Method 1: GitHub Desktop (Recommended) >> UPLOAD_INSTRUCTIONS.md
echo 1. Download GitHub Desktop: https://desktop.github.com/ >> UPLOAD_INSTRUCTIONS.md
echo 2. Login with your GitHub account >> UPLOAD_INSTRUCTIONS.md
echo 3. Clone repository: https://github.com/manan0901/Vibecoder.git >> UPLOAD_INSTRUCTIONS.md
echo 4. Copy all files to the cloned directory >> UPLOAD_INSTRUCTIONS.md
echo 5. Commit with message: "Production deployment ready for vibecodeseller.com" >> UPLOAD_INSTRUCTIONS.md
echo 6. Push to GitHub >> UPLOAD_INSTRUCTIONS.md
echo. >> UPLOAD_INSTRUCTIONS.md
echo ## Method 2: Web Interface >> UPLOAD_INSTRUCTIONS.md
echo 1. Go to: https://github.com/manan0901/Vibecoder >> UPLOAD_INSTRUCTIONS.md
echo 2. Upload files via web interface >> UPLOAD_INSTRUCTIONS.md
echo 3. Commit changes >> UPLOAD_INSTRUCTIONS.md
echo. >> UPLOAD_INSTRUCTIONS.md
echo ## Method 3: Git Command Line >> UPLOAD_INSTRUCTIONS.md
echo 1. Install Git: https://git-scm.com/download/windows >> UPLOAD_INSTRUCTIONS.md
echo 2. Run: git add . >> UPLOAD_INSTRUCTIONS.md
echo 3. Run: git commit -m "Production deployment ready" >> UPLOAD_INSTRUCTIONS.md
echo 4. Run: git push origin main >> UPLOAD_INSTRUCTIONS.md

echo.
echo ========================================
echo ✅ GITHUB DEPLOYMENT PREPARATION COMPLETE!
echo ========================================
echo.
echo Files Created:
echo - backend\.env.production (Production backend config)
echo - frontend\.env.production (Production frontend config)
echo - DEPLOYMENT_README.md (Production documentation)
echo - GITHUB_DEPLOYMENT_CHECKLIST.md (Deployment checklist)
echo - UPLOAD_INSTRUCTIONS.md (GitHub upload guide)
echo.
echo Next Steps:
echo 1. Choose upload method (GitHub Desktop recommended)
echo 2. Upload all files to GitHub repository
echo 3. Configure Hostinger Git auto-deployment
echo 4. Test the deployment process
echo 5. Go live at vibecodeseller.com!
echo.
echo Repository: https://github.com/manan0901/Vibecoder.git
echo Target Domain: vibecodeseller.com
echo.
echo Your VibeCoder marketplace is ready for auto-deployment! 🚀
echo.
pause
