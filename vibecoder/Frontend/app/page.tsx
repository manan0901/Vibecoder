'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../components/ui/navbar';
import { HeroSection } from '../components/ui/hero-section';
import { FeatureSection } from '../components/ui/feature-section';
import { ProjectCard } from '../components/ui/project-card';
import { Footer } from '../components/ui/footer';
import { Button } from '../components/ui/button';
import { ProjectCardSkeleton } from '../components/ui/loading';

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
      // Try to fetch from API, fallback to mock data
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/projects?featured=true&limit=6`);
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
          {
            id: '4',
            title: 'E-commerce Mobile App',
            shortDescription: 'Full-featured e-commerce app with payment integration and admin panel',
            price: 8999,
            rating: 4.7,
            reviewCount: 55,
            downloadCount: 89,
            category: 'E-commerce',
            techStack: ['React Native', 'Node.js', 'MongoDB'],
            seller: { firstName: 'Neha', lastName: 'Shop' },
          },
          {
            id: '5',
            title: 'Modern Portfolio Website',
            shortDescription: 'Stunning portfolio template with smooth animations and responsive design',
            price: 2999,
            rating: 4.8,
            reviewCount: 72,
            downloadCount: 412,
            category: 'Web Development',
            techStack: ['Next.js', 'Tailwind', 'Framer Motion'],
            seller: { firstName: 'Amit', lastName: 'Design' },
          },
          {
            id: '6',
            title: 'Restaurant Management System',
            shortDescription: 'Complete restaurant management solution with POS and inventory tracking',
            price: 12999,
            rating: 4.9,
            reviewCount: 23,
            downloadCount: 67,
            category: 'Backend APIs',
            techStack: ['Node.js', 'PostgreSQL', 'Redis'],
            seller: { firstName: 'Vikash', lastName: 'System' },
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
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Featured Projects Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg leading-8 text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover premium code projects from our top-rated vibecoding developers
            </motion.p>
          </div>          {isLoading ? (
            <ProjectCardSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  shortDescription={project.shortDescription}
                  price={project.price}
                  rating={project.rating}
                  reviewCount={project.reviewCount}
                  downloadCount={project.downloadCount}
                  category={project.category}
                  techStack={project.techStack}
                  seller={project.seller}
                  isFeatured={true}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button variant="vibecoder" size="lg" asChild>
              <Link href="/projects">
                Browse All Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Popular Categories
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg leading-8 text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find the perfect project for your needs across various categories
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link href={`/projects/categories/${encodeURIComponent(category.name.toLowerCase())}`}>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    {category.trending && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Trending
                      </div>
                    )}
                    <div className="text-3xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-vibecoder-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {category.count} projects
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
