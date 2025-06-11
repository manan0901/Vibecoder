'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/ui/navbar';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" in the top navigation, fill in your details, and verify your email address.'
        },
        {
          question: 'How do I buy a project?',
          answer: 'Browse projects, click on one you like, and click "Purchase". You\'ll be guided through the payment process.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and UPI payments for Indian users.'
        }
      ]
    },
    {
      title: 'For Sellers',
      icon: '💰',
      faqs: [
        {
          question: 'How do I become a seller?',
          answer: 'Register as a seller, verify your identity, and start uploading your projects for review.'
        },
        {
          question: 'What commission do you take?',
          answer: 'We take a 20% commission on each sale to cover platform costs and payment processing.'
        },
        {
          question: 'When do I get paid?',
          answer: 'Payments are processed weekly on Fridays for completed sales from the previous week.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: '🛠️',
      faqs: [
        {
          question: 'I can\'t download my purchase',
          answer: 'Check your downloads page in your dashboard. If the issue persists, contact our support team.'
        },
        {
          question: 'The project I bought doesn\'t work',
          answer: 'First, check the project requirements and documentation. If you still need help, contact the seller or our support team.'
        },
        {
          question: 'How do I get a refund?',
          answer: 'Refunds are available within 30 days of purchase if the project doesn\'t match the description or has major issues.'
        }
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-vibecoder-600 to-vibecoder-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Help Center
              </motion.h1>
              <motion.p 
                className="text-xl text-vibecoder-100 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Find answers to common questions and get the help you need
              </motion.p>
              
              {/* Search */}
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
                  />
                  <button className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700">
                    🔍
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="bg-white rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group">
                      <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="p-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            className="bg-vibecoder-600 text-white rounded-lg p-8 text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-vibecoder-100 mb-6">Our support team is here to help you</p>
            <a
              href="mailto:support@vibecoder.com"
              className="inline-flex items-center px-6 py-3 bg-white text-vibecoder-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
