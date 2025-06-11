'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

export function FeatureSection({ 
  title = "Why Choose VibeCoder?", 
  subtitle = "Our marketplace offers everything you need for your next coding project",
  features = [
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      ),
      title: "Quality Assurance",
      description: "All code is thoroughly reviewed and vetted for quality, security, and performance."
    },
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      title: "Lightning Fast",
      description: "Optimized code that prioritizes performance and responsiveness across all devices."
    },
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
      ),
      title: "Customizable",
      description: "Easily adapt projects to your specific needs with clean, well-documented code."
    },
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      ),
      title: "Vibrant Community",
      description: "Join thousands of developers sharing knowledge and helping each other succeed."
    },
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      ),
      title: "Comprehensive Documentation",
      description: "All projects include detailed documentation to help you get started quickly."
    },
    {
      icon: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vibecoder-500 to-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: "Competitive Pricing",
      description: "Fair prices for quality work, with options for every budget."
    }
  ]
}: FeatureSectionProps) {
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>
        <motion.div 
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              variants={featureVariants}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-lg font-semibold leading-7 text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
