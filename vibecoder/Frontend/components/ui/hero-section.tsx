'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './button';
import { SearchBar } from './search-bar';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function HeroSection({
  title = "Premium Marketplace for Vibe Coders",
  subtitle = "Discover high-quality code, premium projects, and expert vibecoding services from top developers worldwide",
  ctaText = "Browse Marketplace",
  ctaLink = "/projects",
  secondaryCtaText = "Become a Seller",
  secondaryCtaLink = "/seller/register"
}: HeroSectionProps) {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-vibecoder-600 to-indigo-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32 lg:flex lg:items-center lg:gap-x-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <motion.h1 
            className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient">{title}</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>          <motion.div
            className="mt-10 flex items-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href={ctaLink}>
              <Button variant="vibecoder" size="xl">
                {ctaText}
              </Button>
            </Link>
            <Link href={secondaryCtaLink}>
              <Button variant="outline" size="xl">
                {secondaryCtaText}
              </Button>
            </Link>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Abstract code visualization */}
        <motion.div
          className="hidden lg:block lg:flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-96 rounded-2xl bg-gray-900 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-vibecoder-600/20 to-indigo-500/20"></div>
            <pre className="absolute inset-0 p-4 text-xs text-green-400 font-mono overflow-hidden">
              <code>
{`// VibeCoder Marketplace
import { createVibe } from '@vibecoder/core';
import { optimizePerformance } from '@vibecoder/utils';

interface CodeProject {
  id: string;
  title: string;
  author: string;
  rating: number;
  price: number;
  techStack: string[];
}

export const launchMarketplace = async () => {
  const topProjects = await fetchTopProjects();
  const optimizedExperience = optimizePerformance({
    renderSpeed: 'blazing-fast',
    userExperience: 'premium',
  });

  return createVibe({
    projects: topProjects,
    experience: optimizedExperience,
    communityDriven: true,
  });
};

// Join the vibecoding revolution today!`}
              </code>
            </pre>
            {/* Code animation lines */}
            <motion.div
              className="absolute left-0 top-[30%] h-px w-full bg-gradient-to-r from-transparent via-green-400 to-transparent"
              animate={{ 
                top: ['30%', '60%', '40%', '80%', '20%', '70%'],
                opacity: [0, 1, 0.8, 0.2, 0.9, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
            <motion.div
              className="absolute left-0 top-[50%] h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              animate={{ 
                top: ['50%', '20%', '65%', '15%', '75%', '35%'],
                opacity: [0.2, 0.9, 0.4, 1, 0.3, 0]
              }}
              transition={{
                duration: 5,
                delay: 1,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Bottom blur decoration */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-vibecoder-400 to-indigo-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
