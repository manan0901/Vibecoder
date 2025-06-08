import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibecoder.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Category pages
  const categories = [
    'vibecoding-services',
    'web-development',
    'mobile-apps',
    'ai-ml-projects',
    'saas-templates',
    'e-commerce',
    'backend-apis',
    'ui-ux-designs',
    'react-templates',
    'nextjs-projects',
    'nodejs-scripts',
    'python-tools',
    'javascript-libraries',
    'typescript-projects',
    'full-stack-solutions',
    'automation-tools',
    'chrome-extensions',
    'wordpress-themes',
    'shopify-apps',
    'discord-bots'
  ];

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Technology-specific pages
  const technologies = [
    'react',
    'nextjs',
    'nodejs',
    'python',
    'javascript',
    'typescript',
    'vue',
    'angular',
    'express',
    'mongodb',
    'postgresql',
    'mysql',
    'redis',
    'docker',
    'aws',
    'firebase',
    'stripe',
    'tailwindcss',
    'bootstrap',
    'material-ui'
  ];

  const technologyPages = technologies.map(tech => ({
    url: `${baseUrl}/tech/${tech}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Blog/Guide pages for SEO
  const blogPages = [
    'how-to-start-vibecoding',
    'best-coding-projects-to-sell',
    'vibecoder-seller-guide',
    'earn-money-coding-online',
    'react-templates-marketplace',
    'nodejs-api-development',
    'mobile-app-monetization',
    'saas-startup-guide',
    'freelance-coding-tips',
    'programming-portfolio-guide'
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...technologyPages,
    ...blogPages,
  ];
}
