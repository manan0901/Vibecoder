import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        { label: 'Browse Projects', href: '/projects' },
        { label: 'Categories', href: '/projects/categories' },
        { label: 'Featured', href: '/projects/featured' },
        { label: 'New Releases', href: '/projects/new' },
      ]
    },
    {
      title: 'For Sellers',
      links: [
        { label: 'Become a Seller', href: '/seller/register' },
        { label: 'Seller Dashboard', href: '/seller/dashboard' },
        { label: 'Seller Guidelines', href: '/seller/guidelines' },
        { label: 'Payout Info', href: '/seller/payouts' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Community', href: '/community' },
        { label: 'Bug Reports', href: '/bugs' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
        { label: 'Refund Policy', href: '/refund-policy' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/vibecoder', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/vibecoder', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/vibecoder', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@vibecoder.com', label: 'Email' },
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-vibecoder-400 to-indigo-400 bg-clip-text text-transparent">
                  VibeCoder
                </span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                The ultimate marketplace for premium code, vibecoding services, and digital products. 
                Join thousands of developers building the future together.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-vibecoder-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(2, 4).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold leading-6 text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Get the latest updates on new projects, features, and vibecoding tips.
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:ml-6">
              <form className="flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-vibecoder-500 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-vibecoder-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-vibecoder-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibecoder-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {currentYear} VibeCoder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-gray-400">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>by developers, for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
