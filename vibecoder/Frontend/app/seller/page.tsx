'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { Button } from '../../components/ui/button';

export default function SellerPage() {
  const benefits = [
    {
      icon: '💰',
      title: 'Earn ₹50K+ Monthly',
      description: 'Top sellers earn between ₹50,000 to ₹2,00,000 monthly by selling premium coding projects.'
    },
    {
      icon: '🚀',
      title: 'Global Reach',
      description: 'Sell to developers worldwide and build your reputation in the global coding community.'
    },
    {
      icon: '⚡',
      title: 'Instant Payouts',
      description: 'Get paid instantly when your projects are purchased. No waiting periods.'
    },
    {
      icon: '🛡️',
      title: 'Secure Platform',
      description: 'Your intellectual property is protected with our advanced security measures.'
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Track your sales, views, and earnings with detailed analytics and insights.'
    },
    {
      icon: '🎯',
      title: 'Marketing Support',
      description: 'We help promote your projects to the right audience through our marketing channels.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up as a seller and complete your profile with your skills and portfolio.'
    },
    {
      step: '2',
      title: 'Upload Projects',
      description: 'Upload your coding projects with detailed descriptions and documentation.'
    },
    {
      step: '3',
      title: 'Start Earning',
      description: 'Once approved, your projects go live and you start earning from sales.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-vibecoder-600 to-vibecoder-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Start Selling Your Code
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-vibecoder-100 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join 10,000+ developers earning money from their coding skills on VibeCoder
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button variant="secondary" size="xl" asChild>
                <Link href="/seller/register">
                  Become a Seller
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/sellers">
                  View Seller Profiles
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell on VibeCoder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the most profitable marketplace for coding professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start selling in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-vibecoder-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-vibecoder-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Earning?
          </motion.h2>
          <motion.p 
            className="text-xl text-vibecoder-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of developers who are already making money from their coding skills
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="secondary" size="xl" asChild>
              <Link href="/seller/register">
                Get Started Today
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
