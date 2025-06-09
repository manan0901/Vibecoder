'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeaturedProject {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  category: string;
  techStack: string[];
  seller: {
    firstName: string;
    lastName: string;
  };
}

export default function ModernHome() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const trendingKeywords = [
    'Vibecoding', 'React Templates', 'Next.js Projects', 'Node.js APIs',
    'Mobile Apps', 'AI Tools', 'SaaS Templates', 'E-commerce'
  ];

  const categories = [
    { name: 'Vibecoding Services', icon: '⚡', count: 89, trending: true },
    { name: 'Web Development', icon: '🌐', count: 156, trending: true },
    { name: 'Mobile Apps', icon: '📱', count: 78, trending: false },
    { name: 'AI & ML Projects', icon: '🤖', count: 45, trending: true },
    { name: 'SaaS Templates', icon: '🚀', count: 67, trending: true },
    { name: 'E-commerce', icon: '🛒', count: 92, trending: false },
    { name: 'Backend APIs', icon: '⚙️', count: 134, trending: false },
    { name: 'UI/UX Designs', icon: '🎨', count: 56, trending: false },
  ];

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?featured=true&limit=6`);
      const data = await response.json();

      if (data.success && data.data.projects.length > 0) {
        setFeaturedProjects(data.data.projects);
      } else {
        // Enhanced mock data with vibecoding focus
        const mockProjects: FeaturedProject[] = [
          {
            id: '1',
            title: 'VibeCoding React Dashboard Pro',
            shortDescription: 'Premium admin dashboard with vibecoding aesthetics and modern animations',
            price: 4999,
            rating: 4.9,
            reviewCount: 47,
            downloadCount: 234,
            category: 'Vibecoding Services',
            techStack: ['React', 'TypeScript', 'Framer Motion'],
            seller: { firstName: 'Arjun', lastName: 'Vibe' },
          },
          {
            id: '2',
            title: 'Next.js SaaS Starter Kit',
            shortDescription: 'Complete SaaS template with payments, auth, and vibecoding design',
            price: 7999,
            rating: 4.8,
            reviewCount: 32,
            downloadCount: 189,
            category: 'SaaS Templates',
            techStack: ['Next.js', 'Stripe', 'Prisma'],
            seller: { firstName: 'Priya', lastName: 'Code' },
          },
          {
            id: '3',
            title: 'AI-Powered Chat App',
            shortDescription: 'Modern chat application with AI integration and real-time features',
            price: 5999,
            rating: 4.9,
            reviewCount: 28,
            downloadCount: 156,
            category: 'AI & ML Projects',
            techStack: ['React Native', 'OpenAI', 'Socket.io'],
            seller: { firstName: 'Rohit', lastName: 'AI' },
          },
        ];
        setFeaturedProjects(mockProjects);
      }
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
      setFeaturedProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Modern Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-bold text-xl">V</span>
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  VibeCoder
                </span>
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/browse"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Browse Projects
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Earning ₹50K+
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 10 Second Conversion Focus */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm font-medium text-indigo-700 mb-8">
                <span className="animate-pulse mr-2">🔥</span>
                Trending: Vibecoding Services - Earn ₹1L+ Monthly
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  VibeCoder
                </span>
                <br />
                <span className="text-4xl md:text-5xl">Marketplace for</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Vibe Coders
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Join <span className="font-semibold text-indigo-600">10,000+ vibecoding professionals</span> earning 
                <span className="font-bold text-green-600"> ₹50K-₹2L monthly</span> by selling premium coding projects, 
                vibecoding services, and digital products.
              </p>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <span className="mr-2">💰</span>
                  Start Earning Today
                  <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-lg">₹50K+/month</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/browse"
                  className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-200 transition-all duration-300"
                >
                  <span className="mr-2">🚀</span>
                  Browse Premium Projects
                </Link>
              </motion.div>
            </motion.div>

            {/* Trending Keywords */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-sm text-gray-500 mr-2">Trending:</span>
              {trendingKeywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  className="px-3 py-1 bg-white/60 backdrop-blur-sm text-sm text-gray-700 rounded-full border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {keyword}
                </motion.span>
              ))}
            </motion.div>

            {/* Enhanced Search Bar */}
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vibecoding services, React templates, AI tools..."
                  className="w-full px-8 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/80 backdrop-blur-sm shadow-xl"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value;
                      if (query.trim()) {
                        window.location.href = `/projects?search=${encodeURIComponent(query)}`;
                      }
                    }
                  }}
                />
                <motion.button
                  className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    const query = input?.value;
                    if (query?.trim()) {
                      window.location.href = `/projects?search=${encodeURIComponent(query)}`;
                    }
                  }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600">Vibe Coders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">₹5Cr+</div>
              <div className="text-gray-600">Earned by Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Projects Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
