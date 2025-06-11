@echo off
echo ========================================
echo Creating a simplified static version for Hostinger
echo ========================================

echo.
echo [1/2] Creating simplified HTML for Hostinger...
mkdir hostinger_static 2>nul

echo <!DOCTYPE html> > hostinger_static\index.html
echo ^<html lang="en"^> >> hostinger_static\index.html
echo ^<head^> >> hostinger_static\index.html
echo   ^<meta charset="UTF-8"^> >> hostinger_static\index.html
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> hostinger_static\index.html
echo   ^<title^>VibeCoder - Digital Code Marketplace^</title^> >> hostinger_static\index.html
echo   ^<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"^> >> hostinger_static\index.html
echo   ^<style^> >> hostinger_static\index.html
echo     .vibecoder-gradient { background: linear-gradient(90deg, #4f46e5, #6d28d9); } >> hostinger_static\index.html
echo   ^</style^> >> hostinger_static\index.html
echo ^</head^> >> hostinger_static\index.html
echo ^<body class="bg-gray-50"^> >> hostinger_static\index.html
echo   ^<header class="vibecoder-gradient text-white"^> >> hostinger_static\index.html
echo     ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^> >> hostinger_static\index.html
echo       ^<div class="flex justify-between items-center py-4"^> >> hostinger_static\index.html
echo         ^<a href="/" class="text-2xl font-bold"^>VibeCoder^</a^> >> hostinger_static\index.html
echo         ^<nav^> >> hostinger_static\index.html
echo           ^<ul class="flex space-x-6"^> >> hostinger_static\index.html
echo             ^<li^>^<a href="#projects" class="hover:text-purple-200"^>Projects^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li^>^<a href="#sellers" class="hover:text-purple-200"^>Sellers^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li^>^<a href="#about" class="hover:text-purple-200"^>About^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li^>^<a href="#contact" class="hover:text-purple-200"^>Contact^</a^>^</li^> >> hostinger_static\index.html
echo           ^</ul^> >> hostinger_static\index.html
echo         ^</nav^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</div^> >> hostinger_static\index.html
echo   ^</header^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo   ^<main^> >> hostinger_static\index.html
echo     ^<section class="py-20 vibecoder-gradient text-white"^> >> hostinger_static\index.html
echo       ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"^> >> hostinger_static\index.html
echo         ^<h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6"^>VibeCoder Marketplace^</h1^> >> hostinger_static\index.html
echo         ^<p class="text-xl mb-8 max-w-3xl mx-auto"^>The premier marketplace for high-quality code projects, templates and digital assets^</p^> >> hostinger_static\index.html
echo         ^<div class="flex flex-col sm:flex-row gap-4 justify-center"^> >> hostinger_static\index.html
echo           ^<a href="#projects" class="btn bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"^>Browse Projects^</a^> >> hostinger_static\index.html
echo           ^<a href="/auth/login" class="btn bg-purple-700 hover:bg-purple-800 px-8 py-3 rounded-lg font-medium"^>Login / Register^</a^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</section^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo     ^<section id="projects" class="py-16"^> >> hostinger_static\index.html
echo       ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^> >> hostinger_static\index.html
echo         ^<h2 class="text-3xl font-bold text-center mb-12"^>Featured Projects^</h2^> >> hostinger_static\index.html
echo         ^<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"^> >> hostinger_static\index.html
echo           ^<div class="bg-white rounded-lg shadow-md overflow-hidden"^> >> hostinger_static\index.html
echo             ^<div class="p-6"^> >> hostinger_static\index.html
echo               ^<h3 class="font-bold text-xl mb-2"^>E-commerce Dashboard^</h3^> >> hostinger_static\index.html
echo               ^<p class="text-gray-600 mb-4"^>Complete React dashboard with analytics and inventory management^</p^> >> hostinger_static\index.html
echo               ^<div class="flex justify-between items-center"^> >> hostinger_static\index.html
echo                 ^<span class="text-indigo-600 font-bold"^>₹4,999^</span^> >> hostinger_static\index.html
echo                 ^<span class="text-sm text-gray-500"^>34 sales^</span^> >> hostinger_static\index.html
echo               ^</div^> >> hostinger_static\index.html
echo             ^</div^> >> hostinger_static\index.html
echo           ^</div^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</section^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo     ^<section id="about" class="py-16 bg-gray-50"^> >> hostinger_static\index.html
echo       ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^> >> hostinger_static\index.html
echo         ^<h2 class="text-3xl font-bold text-center mb-8"^>About VibeCoder^</h2^> >> hostinger_static\index.html
echo         ^<p class="text-lg text-center max-w-3xl mx-auto"^>VibeCoder is the premier marketplace for developers to buy and sell high-quality code projects, templates, and digital assets. Our platform connects talented developers with clients looking for reliable, well-crafted code solutions.^</p^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</section^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo     ^<section id="contact" class="py-16"^> >> hostinger_static\index.html
echo       ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^> >> hostinger_static\index.html
echo         ^<h2 class="text-3xl font-bold text-center mb-8"^>Contact Us^</h2^> >> hostinger_static\index.html
echo         ^<div class="max-w-lg mx-auto"^> >> hostinger_static\index.html
echo           ^<p class="text-center mb-6"^>Have questions or need assistance? Reach out to our team.^</p^> >> hostinger_static\index.html
echo           ^<div class="text-center"^> >> hostinger_static\index.html
echo             ^<a href="mailto:contact@vibecodeseller.com" class="text-indigo-600 hover:text-indigo-800"^>contact@vibecodeseller.com^</a^> >> hostinger_static\index.html
echo           ^</div^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</section^> >> hostinger_static\index.html
echo   ^</main^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo   ^<footer class="bg-gray-800 text-white py-10"^> >> hostinger_static\index.html
echo     ^<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"^> >> hostinger_static\index.html
echo       ^<div class="grid grid-cols-1 md:grid-cols-3 gap-8"^> >> hostinger_static\index.html
echo         ^<div^> >> hostinger_static\index.html
echo           ^<h3 class="text-xl font-bold mb-4"^>VibeCoder^</h3^> >> hostinger_static\index.html
echo           ^<p class="text-gray-300"^>The premier marketplace for code projects and digital assets^</p^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo         ^<div^> >> hostinger_static\index.html
echo           ^<h3 class="text-xl font-bold mb-4"^>Quick Links^</h3^> >> hostinger_static\index.html
echo           ^<ul^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="/" class="text-gray-300 hover:text-white"^>Home^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="#projects" class="text-gray-300 hover:text-white"^>Projects^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="#about" class="text-gray-300 hover:text-white"^>About^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="#contact" class="text-gray-300 hover:text-white"^>Contact^</a^>^</li^> >> hostinger_static\index.html
echo           ^</ul^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo         ^<div^> >> hostinger_static\index.html
echo           ^<h3 class="text-xl font-bold mb-4"^>Legal^</h3^> >> hostinger_static\index.html
echo           ^<ul^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="/terms" class="text-gray-300 hover:text-white"^>Terms of Service^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="/privacy" class="text-gray-300 hover:text-white"^>Privacy Policy^</a^>^</li^> >> hostinger_static\index.html
echo             ^<li class="mb-2"^>^<a href="/refund-policy" class="text-gray-300 hover:text-white"^>Refund Policy^</a^>^</li^> >> hostinger_static\index.html
echo           ^</ul^> >> hostinger_static\index.html
echo         ^</div^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo       ^<div class="mt-8 pt-8 border-t border-gray-700 text-center"^> >> hostinger_static\index.html
echo         ^<p class="text-gray-300"^>&copy; 2024 VibeCoder. All rights reserved.^</p^> >> hostinger_static\index.html
echo       ^</div^> >> hostinger_static\index.html
echo     ^</div^> >> hostinger_static\index.html
echo   ^</footer^> >> hostinger_static\index.html
echo. >> hostinger_static\index.html
echo   ^<script^> >> hostinger_static\index.html
echo     // Redirect to the backend API for any API calls >> hostinger_static\index.html
echo     if (window.location.pathname.startsWith('/api/')) { >> hostinger_static\index.html
echo       window.location.href = 'https://vibecoder-backend.onrender.com' + window.location.pathname; >> hostinger_static\index.html
echo     } >> hostinger_static\index.html
echo   ^</script^> >> hostinger_static\index.html
echo ^</body^> >> hostinger_static\index.html
echo ^</html^> >> hostinger_static\index.html

echo.
echo [2/2] Creating .htaccess file...
echo # VibeCoder Hostinger .htaccess file > hostinger_static\.htaccess
echo RewriteEngine On >> hostinger_static\.htaccess
echo. >> hostinger_static\.htaccess
echo # Force HTTPS >> hostinger_static\.htaccess
echo RewriteCond %%{HTTPS} off >> hostinger_static\.htaccess
echo RewriteRule ^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301] >> hostinger_static\.htaccess
echo. >> hostinger_static\.htaccess
echo # API Proxy to Render >> hostinger_static\.htaccess
echo RewriteCond %%{REQUEST_URI} ^/api/ >> hostinger_static\.htaccess
echo RewriteRule ^api/(.*)$ https://vibecoder-backend.onrender.com/api/$1 [P,L] >> hostinger_static\.htaccess
echo. >> hostinger_static\.htaccess
echo # Frontend Routing for single-page application >> hostinger_static\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-f >> hostinger_static\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-d >> hostinger_static\.htaccess
echo RewriteRule ^(.*)$ /index.html [L] >> hostinger_static\.htaccess
echo. >> hostinger_static\.htaccess
echo # Security Headers >> hostinger_static\.htaccess
echo Header always set X-Frame-Options "DENY" >> hostinger_static\.htaccess
echo Header always set X-Content-Type-Options "nosniff" >> hostinger_static\.htaccess
echo Header always set X-XSS-Protection "1; mode=block" >> hostinger_static\.htaccess
echo Header always set Referrer-Policy "strict-origin-when-cross-origin" >> hostinger_static\.htaccess
echo Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://vibecoder-backend.onrender.com;" >> hostinger_static\.htaccess

echo.
echo ========================================
echo ✅ Static files created successfully!
echo ========================================
echo.
echo Files are located in the "hostinger_static" folder
echo.
echo Next steps:
echo 1. Upload ALL files from the "hostinger_static" folder to your Hostinger "public_html" directory
echo 2. Make sure the .htaccess file is uploaded (it's hidden)
echo 3. Update the API URL in the index.html if your backend is hosted somewhere else
echo 4. Your static landing page will be available at your domain
echo.
echo Note: This is a simplified landing page that will work with your Hostinger PHP hosting plan.
echo The dynamic features will be handled by your Render backend API.
pause
