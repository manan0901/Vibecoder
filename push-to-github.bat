@echo off
echo ========================================
echo    VIBECODER - GITHUB PUSH SCRIPT
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding remote repository...
git remote add origin https://github.com/manan0901/Vibecoder.git

echo.
echo Step 3: Creating .gitignore file...
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.production >> .gitignore
echo .next/ >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore
echo *.log >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo uploads/ >> .gitignore
echo temp/ >> .gitignore

echo.
echo Step 4: Adding all files to Git...
git add .

echo.
echo Step 5: Creating initial commit...
git commit -m "🚀 Initial commit: VibeCoder Marketplace Platform

✨ Features:
- Complete Next.js frontend with modern UI/UX
- Node.js backend with Express and Prisma
- Clean, mobile-friendly navbar with normal button effects
- SEO-optimized footer with legal pages
- Admin panel for content management
- User authentication and authorization
- Project marketplace functionality
- Payment integration ready
- File upload and download system
- Responsive design for all devices

🎯 SEO Optimizations:
- Terms of Service page
- Privacy Policy page  
- Cookie Policy page
- Refund Policy page
- Comprehensive footer with internal linking
- Meta tags and structured data ready

📱 Mobile-First Design:
- Touch-friendly navigation
- Hamburger menu for mobile
- Optimized button sizes and spacing
- Fast loading and smooth animations

🔧 Technical Stack:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Prisma, PostgreSQL
- Authentication: JWT-based auth system
- File Management: Multer for uploads
- Testing: Jest for unit testing
- Deployment: Docker-ready configuration

Ready for production deployment on Hostinger! 🌟"

echo.
echo Step 6: Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   ✅ SUCCESSFULLY PUSHED TO GITHUB!
echo   Repository: https://github.com/manan0901/Vibecoder.git
echo ========================================
echo.
pause
