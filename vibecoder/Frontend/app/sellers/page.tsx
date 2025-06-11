'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { formatCurrency } from '../../lib/utils';

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio: string;
  rating: number;
  reviewCount: number;
  projectCount: number;
  totalSales: number;
  joinedDate: string;
  verified: boolean;
  specialties: string[];
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    // Mock data for sellers
    const mockSellers: Seller[] = [
      {
        id: '1',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
        rating: 4.9,
        reviewCount: 156,
        projectCount: 34,
        totalSales: 2450000,
        joinedDate: '2022-03-15',
        verified: true,
        specialties: ['React', 'Node.js', 'AWS', 'MongoDB']
      },
      {
        id: '2',
        firstName: 'Priya',
        lastName: 'Sharma',
        bio: 'UI/UX designer and frontend developer specializing in modern web applications.',
        rating: 4.8,
        reviewCount: 89,
        projectCount: 28,
        totalSales: 1890000,
        joinedDate: '2021-11-20',
        verified: true,
        specialties: ['Figma', 'React', 'Tailwind CSS', 'Design Systems']
      },
      {
        id: '3',
        firstName: 'Arjun',
        lastName: 'Patel',
        bio: 'Mobile app developer with expertise in React Native and Flutter.',
        rating: 4.7,
        reviewCount: 67,
        projectCount: 19,
        totalSales: 1234000,
        joinedDate: '2023-01-10',
        verified: false,
        specialties: ['React Native', 'Flutter', 'Firebase', 'iOS']
      },
      {
        id: '4',
        firstName: 'Sneha',
        lastName: 'Gupta',
        bio: 'Data scientist and ML engineer building intelligent solutions.',
        rating: 4.9,
        reviewCount: 43,
        projectCount: 15,
        totalSales: 987000,
        joinedDate: '2022-08-05',
        verified: true,
        specialties: ['Python', 'TensorFlow', 'Data Analysis', 'Machine Learning']
      },
      {
        id: '5',
        firstName: 'Vikram',
        lastName: 'Singh',
        bio: 'Backend developer and DevOps engineer with cloud expertise.',
        rating: 4.6,
        reviewCount: 78,
        projectCount: 25,
        totalSales: 1567000,
        joinedDate: '2021-06-12',
        verified: true,
        specialties: ['Django', 'Docker', 'Kubernetes', 'PostgreSQL']
      },
      {
        id: '6',
        firstName: 'Anita',
        lastName: 'Raj',
        bio: 'Game developer creating engaging mobile and web games.',
        rating: 4.5,
        reviewCount: 32,
        projectCount: 12,
        totalSales: 654000,
        joinedDate: '2023-04-18',
        verified: false,
        specialties: ['Unity', 'C#', 'Game Design', 'WebGL']
      }
    ];

    setTimeout(() => {
      setSellers(mockSellers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedSellers = sellers
    .filter(seller => {
      if (filter === 'verified') return seller.verified;
      if (filter === 'top-rated') return seller.rating >= 4.8;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'projects': return b.projectCount - a.projectCount;
        case 'sales': return b.totalSales - a.totalSales;
        case 'newest': return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        default: return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vibecoder-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sellers...</p>
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
                Talented Sellers
              </motion.h1>
              <motion.p 
                className="text-xl text-vibecoder-100 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discover skilled developers, designers, and creators from around the world
              </motion.p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-vibecoder-500"
                  >
                    <option value="all">All Sellers</option>
                    <option value="verified">Verified Only</option>
                    <option value="top-rated">Top Rated (4.8+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-vibecoder-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="projects">Most Projects</option>
                    <option value="sales">Highest Sales</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {filteredAndSortedSellers.length} sellers found
              </div>
            </div>
          </div>

          {/* Sellers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/sellers/${seller.id}`}>
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-vibecoder-400 to-vibecoder-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">
                        {seller.firstName[0]}{seller.lastName[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {seller.firstName} {seller.lastName}
                      </h3>
                      {seller.verified && (
                        <span className="text-vibecoder-500" title="Verified Seller">✓</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {renderStars(seller.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {seller.rating} ({seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{seller.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {seller.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-vibecoder-100 text-vibecoder-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {seller.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{seller.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{seller.projectCount}</span> projects
                    </div>
                    <div>
                      <span className="font-medium">{formatCurrency(seller.totalSales / 100000)}L</span> earned
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center px-3 py-1 bg-vibecoder-600 text-white text-sm rounded-lg hover:bg-vibecoder-700 transition-colors">
                      View Profile
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>          {filteredAndSortedSellers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sellers found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}
