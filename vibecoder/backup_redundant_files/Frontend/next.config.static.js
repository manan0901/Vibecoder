/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  output: 'export', 
  images: { 
    unoptimized: true, 
    domains: ['localhost', 'vibecodeseller.com', 'images.unsplash.com', 'via.placeholder.com'], 
  }, 
  typescript: { 
    ignoreBuildErrors: true, 
  }, 
}; 
module.exports = nextConfig; 
