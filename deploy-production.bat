@echo off
echo ========================================
echo VibeCoder Production Deployment Script
echo Domain: vibecodeseller.com
echo ========================================

echo.
echo [1/6] Cleaning previous builds...
if exist "frontend\.next" rmdir /s /q "frontend\.next"
if exist "frontend\out" rmdir /s /q "frontend\out"
if exist "backend\dist" rmdir /s /q "backend\dist"

echo.
echo [2/6] Installing frontend dependencies...
cd frontend
call npm install --production
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [3/6] Building frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [4/6] Installing backend dependencies...
cd ..\backend
call npm install --production
if %errorlevel% neq 0 (
    echo ERROR: Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [5/6] Building backend for production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

echo.
echo [6/6] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma client generation failed!
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo ✅ PRODUCTION BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next Steps:
echo 1. Upload 'frontend\.next\standalone' to public_html/
echo 2. Upload 'backend\dist' to public_html/api/
echo 3. Upload '.htaccess' to public_html/
echo 4. Configure environment variables
echo 5. Test the deployment
echo.
echo Files ready for upload:
echo - Frontend: frontend\.next\standalone\*
echo - Backend: backend\dist\*
echo - Config: .htaccess
echo - Database: Already connected ✅
echo.
pause
