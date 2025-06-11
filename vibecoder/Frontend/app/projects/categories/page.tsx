'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  projectCount: number;
  featured: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for categories
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Web Development',
        description: 'Full-stack web applications, websites, and web tools',
        icon: '🌐',
        projectCount: 245,
        featured: true
      },
      {
        id: '2',
        name: 'Mobile Apps',
        description: 'iOS, Android, and cross-platform mobile applications',
        icon: '📱',
        projectCount: 189,
        featured: true
      },
      {
        id: '3',
        name: 'UI/UX Design',
        description: 'User interface designs, prototypes, and design systems',
        icon: '🎨',
        projectCount: 156,
        featured: true
      },
      {
        id: '4',
        name: 'Machine Learning',
        description: 'AI models, data analysis, and ML algorithms',
        icon: '🤖',
        projectCount: 98,
        featured: false
      },
      {
        id: '5',
        name: 'Desktop Applications',
        description: 'Cross-platform desktop software and utilities',
        icon: '🖥️',
        projectCount: 76,
        featured: false
      },
      {
        id: '6',
        name: 'Game Development',
        description: 'Video games, game engines, and interactive media',
        icon: '🎮',
        projectCount: 134,
        featured: false
      },
      {
        id: '7',
        name: 'DevOps & Tools',
        description: 'Development tools, CI/CD pipelines, and automation',
        icon: '⚙️',
        projectCount: 67,
        featured: false
      },
      {
        id: '8',
        name: 'Blockchain',
        description: 'Smart contracts, DApps, and blockchain solutions',
        icon: '⛓️',
        projectCount: 45,
        featured: false
      }
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vibecoder-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </>
    );
  }

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
                Browse Categories
              </motion.h1>
              <motion.p 
                className="text-xl text-vibecoder-100 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discover amazing projects across different categories and technologies
              </motion.p>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Categories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {categories.filter(cat => cat.featured).map((category, index) => (
                <motion.div
                  key={category.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="text-sm text-vibecoder-600 font-medium mb-4">
                      {category.projectCount} projects
                    </div>
                    <Link
                      href={`/projects?category=${encodeURIComponent(category.name)}`}
                      className="inline-flex items-center px-4 py-2 bg-vibecoder-600 text-white rounded-lg hover:bg-vibecoder-700 transition-colors"
                    >
                      Browse Projects
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Categories */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">All Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/projects?category=${encodeURIComponent(category.name)}`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.projectCount} projects</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
