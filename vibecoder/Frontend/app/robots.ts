import { MetadataRoute } from 'next';

// Add these export statements to make compatible with static export
export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/checkout/',
          '/payment/',
          '/downloads/',
          '/private/',
          '/*.json$',
          '/*.xml$',
          '/search?*',
          '/filter?*',
          '/sort?*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/checkout/',
          '/payment/',
          '/downloads/',
          '/private/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/checkout/',
          '/payment/',
          '/downloads/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
