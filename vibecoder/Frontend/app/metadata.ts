import { Metadata } from 'next';

export const homeMetadata: Metadata = {
  title: {
    default: 'VibeCoder - Premium Marketplace for Vibe Coders & Vibecoding Services',
    template: '%s | VibeCoder - Vibecoding Marketplace'
  },
  description: 'VibeCoder is the ultimate marketplace for vibecoding professionals. Buy and sell premium coding projects, web development services, mobile apps, and digital products from top vibe coders worldwide. Join 10,000+ developers earning ₹50K-₹2L monthly.',
  keywords: [
    // Primary vibecoding keywords
    'vibecoder', 'vibe coder', 'vibecoding', 'vibe coding',
    'vibecoding services', 'vibecoding marketplace', 'vibecoding professionals',
    
    // Marketplace keywords
    'coding marketplace', 'digital services marketplace', 'programming marketplace',
    'buy coding projects', 'sell coding services', 'freelance coding',
    
    // Technology keywords
    'react templates', 'next.js projects', 'node.js scripts', 'python tools',
    'javascript libraries', 'typescript projects', 'mobile app templates',
    'saas starter kits', 'ai tools', 'e-commerce solutions',
    
    // Service keywords
    'web development services', 'mobile app development', 'full stack development',
    'backend apis', 'frontend templates', 'ui ux designs',
    
    // Location and earning keywords
    'indian developers', 'earn money coding', 'freelance income',
    'coding jobs india', 'programming services india',
    
    // Long-tail keywords
    'premium coding projects marketplace',
    'hire vibecoding developers',
    'sell programming projects online',
    'buy react components marketplace',
    'custom coding solutions',
    'verified developers marketplace'
  ],
  authors: [{ name: 'VibeCoder Team' }],
  creator: 'VibeCoder',
  publisher: 'VibeCoder Marketplace',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodeseller.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'hi-IN': '/hi-IN',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodeseller.com',
    siteName: 'VibeCoder - Vibecoding Marketplace',
    title: 'VibeCoder - Premium Marketplace for Vibe Coders & Vibecoding Services',
    description: 'Join 10,000+ vibecoding professionals earning ₹50K-₹2L monthly. Buy and sell premium coding projects, web development services, and digital products from verified vibe coders.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VibeCoder - Premium Marketplace for Vibe Coders',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'VibeCoder - Vibecoding Marketplace',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeCoder - Premium Marketplace for Vibe Coders',
    description: 'Join 10,000+ vibecoding professionals earning ₹50K-₹2L monthly. Premium coding projects and services marketplace.',
    images: ['/twitter-image.jpg'],
    creator: '@vibecoder',
    site: '@vibecoder',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#6366f1',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'VibeCoder',
    statusBarStyle: 'default',
  },
  applicationName: 'VibeCoder',
  generator: 'Next.js',
  abstract: 'Premium marketplace for vibecoding professionals to buy and sell coding projects and digital services.',
  archives: [`${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`],
  assets: [`${process.env.NEXT_PUBLIC_APP_URL}/assets`],
  bookmarks: [`${process.env.NEXT_PUBLIC_APP_URL}/bookmarks`],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#6366f1',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#6366f1',
  },
};

// Structured data for homepage
export const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#website`,
      url: process.env.NEXT_PUBLIC_APP_URL,
      name: 'VibeCoder',
      description: 'Premium marketplace for vibecoding professionals',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      ],
      inLanguage: 'en-US',
      copyrightYear: 2024,
      copyrightHolder: {
        '@type': 'Organization',
        name: 'VibeCoder'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#organization`,
      name: 'VibeCoder',
      alternateName: 'Vibecoding Marketplace',
      url: process.env.NEXT_PUBLIC_APP_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        width: 512,
        height: 512
      },
      description: 'Premium marketplace for vibecoding professionals and digital services',
      foundingDate: '2024',
      slogan: 'Premium Marketplace for Vibe Coders',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9999999999',
        contactType: 'Customer Service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN'
      },
      sameAs: [
        'https://twitter.com/vibecoder',
        'https://linkedin.com/company/vibecoder',
        'https://github.com/vibecoder',
        'https://instagram.com/vibecoder',
        'https://facebook.com/vibecoder'
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'India'
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#webpage`,
      url: process.env.NEXT_PUBLIC_APP_URL,
      name: 'VibeCoder - Premium Marketplace for Vibe Coders',
      isPartOf: {
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#website`
      },
      about: {
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#organization`
      },
      description: 'Join 10,000+ vibecoding professionals earning ₹50K-₹2L monthly by selling premium coding projects and services.',
      breadcrumb: {
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#breadcrumb`
      },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'ReadAction',
          target: [process.env.NEXT_PUBLIC_APP_URL]
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_APP_URL
        }
      ]
    }
  ]
};
