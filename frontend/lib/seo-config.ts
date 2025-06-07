// SEO Configuration for VibeCoder Marketplace
export const seoConfig = {
  // Primary keywords for vibecoding and marketplace
  primaryKeywords: [
    'vibecoder',
    'vibe coder',
    'vibecoding',
    'vibe coding',
    'coding marketplace',
    'digital services marketplace',
    'buy coding projects',
    'sell coding services'
  ],

  // Long-tail keywords for better ranking
  longTailKeywords: [
    'vibecoding services online',
    'hire vibe coders',
    'premium coding projects marketplace',
    'buy react templates vibecoding',
    'sell programming services online',
    'vibecoder marketplace india',
    'freelance vibecoding developers',
    'custom coding solutions vibecoder'
  ],

  // Technology-specific keywords
  techKeywords: [
    'react projects marketplace',
    'next.js templates',
    'node.js scripts',
    'python automation tools',
    'javascript libraries',
    'typescript projects',
    'full stack development',
    'mobile app templates',
    'saas starter kits',
    'e-commerce solutions'
  ],

  // Location-based keywords
  locationKeywords: [
    'indian developers marketplace',
    'coding services india',
    'vibecoding professionals india',
    'freelance developers india',
    'programming marketplace india'
  ],

  // Default meta descriptions for different pages
  metaDescriptions: {
    home: 'VibeCoder is the ultimate marketplace for vibecoding professionals. Buy and sell premium coding projects, web development services, and digital products from top vibe coders worldwide.',
    browse: 'Browse thousands of premium coding projects, vibecoding services, and digital templates. Find React components, Node.js APIs, mobile apps, and more from verified developers.',
    sell: 'Start earning ₹50K+ monthly by selling your coding projects on VibeCoder. Join 10,000+ vibecoding professionals already making money from their skills.',
    login: 'Login to VibeCoder marketplace to access premium coding projects, manage your purchases, and connect with vibecoding professionals.',
    register: 'Join VibeCoder today! Register as a buyer to access premium coding projects or as a seller to start earning from your vibecoding skills.',
    project: 'Premium coding project available on VibeCoder marketplace. High-quality, tested code with documentation from verified vibecoding professionals.',
    category: 'Explore coding projects in this category on VibeCoder marketplace. Find premium templates, scripts, and services from top vibecoding developers.'
  },

  // Structured data schemas
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VibeCoder',
    alternateName: 'Vibecoding Marketplace',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com'}/logo.png`,
    description: 'Premium marketplace for vibecoding professionals and digital services',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'VibeCoder Team'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9999999999',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: [
      'https://twitter.com/vibecoder',
      'https://linkedin.com/company/vibecoder',
      'https://github.com/vibecoder',
      'https://instagram.com/vibecoder'
    ]
  },

  websiteSchema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VibeCoder',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com',
    description: 'Premium marketplace for vibe coders and vibecoding services',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  },

  // Open Graph defaults
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VibeCoder - Vibecoding Marketplace',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VibeCoder - Premium Marketplace for Vibe Coders'
      }
    ]
  },

  // Twitter Card defaults
  twitter: {
    card: 'summary_large_image',
    site: '@vibecoder',
    creator: '@vibecoder'
  },

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

// Generate page-specific SEO data
export function generateSEO(page: string, data?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com';
  
  const seoData = {
    title: '',
    description: '',
    keywords: [...seoConfig.primaryKeywords, ...seoConfig.longTailKeywords],
    canonical: `${baseUrl}${page === 'home' ? '' : `/${page}`}`,
    openGraph: {
      ...seoConfig.openGraph,
      url: `${baseUrl}${page === 'home' ? '' : `/${page}`}`
    },
    twitter: {
      ...seoConfig.twitter
    }
  };

  switch (page) {
    case 'home':
      seoData.title = 'VibeCoder - Premium Marketplace for Vibe Coders & Vibecoding Services';
      seoData.description = seoConfig.metaDescriptions.home;
      seoData.keywords.push(...seoConfig.techKeywords, ...seoConfig.locationKeywords);
      break;

    case 'browse':
      seoData.title = 'Browse Premium Coding Projects | VibeCoder Marketplace';
      seoData.description = seoConfig.metaDescriptions.browse;
      seoData.keywords.push(...seoConfig.techKeywords);
      break;

    case 'sell':
      seoData.title = 'Sell Your Coding Projects | Earn ₹50K+ Monthly | VibeCoder';
      seoData.description = seoConfig.metaDescriptions.sell;
      seoData.keywords.push('earn money coding', 'sell programming services', 'freelance income');
      break;

    case 'project':
      if (data) {
        seoData.title = `${data.title} | Premium Coding Project | VibeCoder`;
        seoData.description = `${data.shortDescription} - Premium coding project available on VibeCoder marketplace. ${data.techStack?.join(', ')} - ₹${data.price}`;
        seoData.keywords.push(...(data.techStack || []), data.category);
      }
      break;

    case 'category':
      if (data) {
        seoData.title = `${data.name} Projects | VibeCoder Marketplace`;
        seoData.description = `Explore premium ${data.name.toLowerCase()} projects on VibeCoder. Find high-quality coding solutions from verified vibecoding professionals.`;
        seoData.keywords.push(data.name.toLowerCase(), `${data.name.toLowerCase()} marketplace`);
      }
      break;

    default:
      seoData.title = 'VibeCoder - Vibecoding Marketplace';
      seoData.description = seoConfig.metaDescriptions.home;
  }

  return seoData;
}

// Generate structured data for products
export function generateProductSchema(project: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.title,
    description: project.shortDescription,
    image: project.images || [`${process.env.NEXT_PUBLIC_APP_URL}/project-placeholder.jpg`],
    brand: {
      '@type': 'Brand',
      name: 'VibeCoder'
    },
    offers: {
      '@type': 'Offer',
      price: project.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'VibeCoder'
      }
    },
    aggregateRating: project.rating ? {
      '@type': 'AggregateRating',
      ratingValue: project.rating,
      reviewCount: project.reviewCount || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    category: project.category,
    keywords: project.techStack?.join(', ')
  };
}

// Generate FAQ schema for better SERP features
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is VibeCoder?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'VibeCoder is a premium marketplace for vibecoding professionals where you can buy and sell high-quality coding projects, digital services, and programming solutions.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much can I earn on VibeCoder?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vibecoding professionals on VibeCoder earn between ₹50,000 to ₹2,00,000 monthly by selling premium coding projects and services.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of projects can I sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can sell React templates, Node.js APIs, mobile apps, SaaS starter kits, AI tools, e-commerce solutions, and any premium coding projects.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is VibeCoder safe for transactions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, VibeCoder uses secure payment processing with Stripe and provides buyer protection for all transactions.'
        }
      }
    ]
  };
}
