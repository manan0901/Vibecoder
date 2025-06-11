import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: {
    default: 'VibeCoder - Premium Marketplace for Vibe Coders & Digital Services',
    template: '%s | VibeCoder - Vibecoding Marketplace'
  },
  description: 'VibeCoder is the ultimate marketplace for vibe coders, vibecoding services, and premium digital products. Buy and sell coding projects, web development, mobile apps, and digital services from top vibecoding professionals.',
  keywords: [
    'vibecoder', 'vibe coder', 'vibecoding', 'vibe coding',
    'coding marketplace', 'digital services marketplace',
    'buy coding projects', 'sell coding services',
    'web development marketplace', 'mobile app development',
    'freelance coding', 'programming services',
    'react projects', 'next.js templates', 'node.js scripts',
    'python automation', 'javascript tools', 'typescript projects',
    'full stack development', 'frontend templates',
    'backend services', 'api development',
    'e-commerce solutions', 'saas templates',
    'indian developers', 'coding community',
    'premium code', 'source code marketplace'
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
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodeseller.com',
    siteName: 'VibeCoder - Vibecoding Marketplace',
    title: 'VibeCoder - Premium Marketplace for Vibe Coders & Digital Services',
    description: 'Discover premium coding projects, vibecoding services, and digital products from top developers. Join the ultimate marketplace for vibe coders and vibecoding professionals.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VibeCoder - Vibecoding Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeCoder - Premium Marketplace for Vibe Coders',
    description: 'Discover premium coding projects and vibecoding services from top developers.',
    images: ['/twitter-image.jpg'],
    creator: '@vibecoder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} ${poppins.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>

        {/* Schema.org structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "VibeCoder",
              "alternateName": "Vibecoding Marketplace",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://vibecodeseller.com",
              "description": "Premium marketplace for vibe coders and vibecoding services",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://vibecoder.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/vibecoder",
                "https://linkedin.com/company/vibecoder",
                "https://github.com/vibecoder"
              ]
            })
          }}
        />

        <AuthProvider>
          <div id="root" className="relative">
            {/* Subtle top gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-vibecoder-400 via-vibecoder-600 to-indigo-500"></div>
            
            {/* Main content */}
            <main className="flex flex-col min-h-[calc(100vh-0.25rem)]">
              {children}
            </main>
            
            {/* Colorful background blur elements - decorative only */}
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-vibecoder-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed top-1/4 -right-32 w-64 h-64 bg-pink-400/15 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </AuthProvider>
        
        {/* Loading indicator for improved UX */}
        <div id="nprogress-container" className="pointer-events-none"></div>
      </body>
    </html>
  );
}
