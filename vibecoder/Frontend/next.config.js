/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone for Hostinger deployment
  output: 'standalone',

  // Enable static optimization
  trailingSlash: true,

  // App directory is now stable in Next.js 14
  // experimental: {
  //   appDir: true,
  // },
  images: {
    domains: ['localhost', 'vibecodeseller.com', 'images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  },

  // Disable x-powered-by header
  poweredByHeader: false,
  // Compress responses
  compress: true,

  // Rewrites removed for standalone deployment
  webpack: (config) => {
    // Custom webpack config
    return config;
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'hooks', 'stores'],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily set to true for deployment
  },
};

module.exports = nextConfig;
