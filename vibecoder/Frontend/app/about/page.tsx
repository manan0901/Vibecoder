'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '../../components/ui/navbar';

export default function AboutPage() {
  const features = [
    {
      icon: '🚀',
      title: 'Quality Projects',
      description: 'Curated collection of high-quality code projects from talented developers'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Advanced security measures to protect both buyers and sellers'
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent pricing with fair revenue sharing for creators'
    },
    {
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Instant downloads and quick project delivery'
    },
    {
      icon: '🎯',
      title: 'Expert Support',
      description: '24/7 customer support from technical experts'
    },
    {
      icon: '🌟',
      title: 'Community Driven',
      description: 'Built by developers, for developers worldwide'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      bio: 'Full-stack developer with 10+ years experience building scalable platforms',
      avatar: '👨‍💻'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Design',
      bio: 'UI/UX designer passionate about creating intuitive user experiences',
      avatar: '👩‍🎨'
    },
    {
      name: 'Arjun Patel',
      role: 'Lead Developer',
      bio: 'Tech enthusiast specializing in modern web technologies and architecture',
      avatar: '👨‍🔧'
    },
    {
      name: 'Sneha Gupta',
      role: 'Community Manager',
      bio: 'Building bridges between developers and fostering community growth',
      avatar: '👩‍💼'
    }
  ];

  const stats = [
    { label: 'Active Projects', value: '2,500+' },
    { label: 'Developers', value: '1,200+' },
    { label: 'Downloads', value: '50,000+' },
    { label: 'Countries', value: '45+' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-vibecoder-600 to-vibecoder-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                About VibeCoder
              </motion.h1>
              <motion.p 
                className="text-xl text-vibecoder-100 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Empowering developers worldwide by connecting talented creators with those who need 
                quality code solutions. We're building the future of developer collaboration.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center px-6 py-3 bg-white text-vibecoder-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Explore Projects
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                To democratize access to quality code and create opportunities for developers to 
                monetize their skills while helping businesses and individuals build better software solutions.
              </motion.p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-vibecoder-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Why Choose VibeCoder?
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                We provide a comprehensive platform designed specifically for the developer community
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Meet Our Team
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Passionate developers and designers working to make coding more accessible
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-white rounded-lg shadow-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-vibecoder-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-vibecoder-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Join Our Community
            </motion.h2>
            <motion.p 
              className="text-xl text-vibecoder-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Whether you're looking to buy quality code or sell your creations, 
              VibeCoder is the perfect platform to grow your career.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-white text-vibecoder-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Selling
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-vibecoder-600 transition-colors"
              >
                Browse Projects
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
