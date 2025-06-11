'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
}

export function Navbar({ 
  logo = (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold text-gradient">VibeCoder</span>
    </Link>
  ),
  navItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace', href: '/projects' },
    { label: 'Categories', href: '/projects/categories' },
    { label: 'Sellers', href: '/sellers' },
    { label: 'About', href: '/about' },
  ]
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-white/80 shadow-sm backdrop-blur-md" 
        : "bg-transparent"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo}
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors relative group",
                  pathname === item.href
                    ? "text-vibecoder-600"
                    : "text-gray-700 hover:text-vibecoder-600"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-vibecoder-500"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button variant="vibecoder" size="sm" asChild>
              <Link href="/auth/register">Sign up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open main menu'}</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === item.href
                      ? "bg-vibecoder-50 text-vibecoder-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-vibecoder-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 gap-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button variant="vibecoder" size="sm" className="w-full" asChild>
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
