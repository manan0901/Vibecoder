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

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/projects?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchFeaturedProjects = async () => {
    try {
      // Try to fetch from API, fallback to mock data
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
      // Set empty array on error
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

      {/* Clean Modern Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">VibeCoder</span>
                  <span className="block text-xs text-gray-500">Premium Marketplace</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Browse Projects - Simple Link */}
              <Link
                href="/projects"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
              >
                Browse Projects
              </Link>

              {/* Login - Clean Button */}
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              >
                Login
              </Link>

              {/* Start Earning - Primary CTA */}
              <Link
                href="/auth/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                💰 Start Earning ₹50K+
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/projects"
                  className="block text-gray-700 hover:text-indigo-600 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Projects
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-gray-700 hover:text-indigo-600 px-4 py-3 rounded-lg text-base font-medium border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 shadow-sm hover:shadow-md text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  💰 Start Earning ₹50K+
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/auth/register?role=seller"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">💰</span>
                Start Earning Today
                <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-lg">₹50K+/month</span>
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-200 transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">🚀</span>
                Browse Premium Projects
              </Link>
            </div>

            {/* Trending Keywords */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-sm text-gray-500 mr-2">Trending:</span>
              {trendingKeywords.map((keyword, index) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-white/60 backdrop-blur-sm text-sm text-gray-700 rounded-full border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vibecoding services, React templates, AI tools..."
                  className="w-full px-8 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/80 backdrop-blur-sm shadow-xl"
                  onKeyPress={handleKeyPress}
                />
                <motion.button
                  className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover projects across different technologies and domains
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/projects?category=${encodeURIComponent(category.name)}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} projects</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-gray-600">
                Hand-picked projects from our top developers
              </p>
            </div>
            <Link
              href="/projects"
              className="btn btn-outline px-6 py-3"
            >
              View All Projects
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-500">Project Preview</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 font-medium">{project.category}</span>
                      <span className="text-lg font-bold text-gray-900">₹{project.price.toLocaleString()}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.shortDescription}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{project.rating} ({project.reviewCount})</span>
                      </div>
                      <span>{project.downloadCount} downloads</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        by {project.seller.firstName} {project.seller.lastName}
                      </span>
                      <Link
                        href={`/projects/${project.id}`}
                        className="btn btn-primary px-4 py-2 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VibeCoder?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best platform for developers to showcase and monetize their coding skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-blue-600 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">For Developers</h3>
              <p className="text-gray-600">
                Sell your coding projects and earn money from your skills. Join thousands of developers already earning.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="text-green-600 text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Quality Projects</h3>
              <p className="text-gray-600">
                Find high-quality, tested projects with documentation. All projects are reviewed by our expert team.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="text-purple-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure transactions with Razorpay integration. Your money is protected with our guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of talented developers and start earning from your coding skills today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=seller"
              className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Start Selling
            </Link>
            <Link
              href="/auth/register?role=buyer"
              className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Start Buying
            </Link>
          </div>
        </div>
      </section>

      {/* SEO-Optimized Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div
            className="absolute w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            style={{ bottom: '20%', right: '15%' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Company Info */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  VibeCoder
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The ultimate marketplace for vibecoding professionals. Join 10,000+ developers earning ₹50K-₹2L monthly by selling premium coding projects and digital services.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://twitter.com/vibecoder"
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white text-lg">𝕏</span>
                </motion.a>
                <motion.a
                  href="https://linkedin.com/company/vibecoder"
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white text-lg">in</span>
                </motion.a>
                <motion.a
                  href="https://github.com/vibecoder"
                  className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white text-lg">⚡</span>
                </motion.a>
                <motion.a
                  href="https://instagram.com/vibecoder"
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white text-lg">📷</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Marketplace Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Marketplace</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/projects" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Success Stories
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Resources & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Vibecoding Blog
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Coding Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal & Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Legal & Policies</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    DMCA Policy
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            className="border-t border-gray-700 pt-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated with Vibecoding Trends</h3>
              <p className="text-gray-300 mb-6">Get the latest coding projects, vibecoding tips, and marketplace updates.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div
                className="text-gray-300 text-sm mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p>© 2024 VibeCoder Marketplace. All rights reserved.</p>
                <p className="mt-1">Empowering vibecoding professionals worldwide since 2024.</p>
              </motion.div>

              <motion.div
                className="flex items-center space-x-6 text-sm text-gray-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  All systems operational
                </span>
                <Link href="/status" className="hover:text-indigo-400 transition-colors duration-200">
                  System Status
                </Link>
                <Link href="/sitemap.xml" className="hover:text-indigo-400 transition-colors duration-200">
                  Sitemap
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      </footer>
    </div>
  );
}
