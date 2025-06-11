'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { formatCurrency } from '../../lib/utils';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  screenshots: string[];
  techStack: string[];
  category: string;
  seller: {
    firstName: string;
    lastName: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Backend Development',
    'Frontend Development',
    'Full Stack',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Game Development',
    'Desktop Applications',
  ];

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, currentPage]);
  const fetchProjects = async () => {
    setIsLoading(true);

    try {
      // For development, use mock data since backend is not running
      // TODO: Uncomment the API call when backend is available
      
      /*
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?${params}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.data.projects);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProjects(data.pagination?.total || 0);
      } else {
        // Fallback to mock data if API fails
      }
      */
      
      // Use mock data for development
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'E-commerce React Dashboard',
          shortDescription: 'Modern e-commerce admin dashboard with React and TypeScript',
          price: 2999,
          rating: 4.5,
          reviewCount: 12,
          downloadCount: 45,
          screenshots: ['/placeholder-project.jpg'],
          techStack: ['React', 'TypeScript', 'Material-UI'],
          category: 'Web Development',
          seller: { firstName: 'Rahul', lastName: 'Sharma' },
        },
        {
          id: '2',
          title: 'React Native Food Delivery App',
          shortDescription: 'Full-featured food delivery app for iOS and Android',
          price: 4999,
          rating: 4.8,
          reviewCount: 8,
          downloadCount: 23,
          screenshots: ['/placeholder-project.jpg'],
          techStack: ['React Native', 'TypeScript', 'Firebase'],
          category: 'Mobile Development',
          seller: { firstName: 'Priya', lastName: 'Patel' },
        },
        {
          id: '3',
          title: 'Node.js REST API Boilerplate',
          shortDescription: 'Production-ready Node.js API boilerplate with best practices',
          price: 1999,
          rating: 4.2,
          reviewCount: 15,
          downloadCount: 67,
          screenshots: ['/placeholder-project.jpg'],
          techStack: ['Node.js', 'Express', 'TypeScript'],
          category: 'Backend Development',
          seller: { firstName: 'Amit', lastName: 'Kumar' },
        },
      ];
      setProjects(mockProjects);
      setTotalPages(1);
      setTotalProjects(mockProjects.length);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Set empty state on error
      setProjects([]);
      setTotalPages(1);
      setTotalProjects(0);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Projects</h1>
            <p className="mt-2 text-gray-600">
              Discover amazing coding projects from talented developers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="input w-full pl-10 pr-4 py-3 text-lg"
                  placeholder="Search projects, technologies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="input w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  id="minPrice"
                  type="number"
                  min="0"
                  className="input w-full"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  min="0"
                  className="input w-full"
                  placeholder="No limit"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  id="sortBy"
                  className="input w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Quick filters:</span>
              {['Free', 'Under ₹1000', 'Under ₹5000', 'Premium'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    if (filter === 'Free') {
                      setMinPrice('0');
                      setMaxPrice('0');
                    } else if (filter === 'Under ₹1000') {
                      setMinPrice('');
                      setMaxPrice('1000');
                    } else if (filter === 'Under ₹5000') {
                      setMinPrice('');
                      setMaxPrice('5000');
                    } else if (filter === 'Premium') {
                      setMinPrice('5000');
                      setMaxPrice('');
                    }
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {projects.length} of {totalProjects} projects
                {searchQuery && (
                  <span> for "<strong>{searchQuery}</strong>"</span>
                )}
                {selectedCategory && (
                  <span> in <strong>{selectedCategory}</strong></span>
                )}
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setMinPrice('');
                    setMaxPrice('');
                    setCurrentPage(1);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Project Screenshot</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 font-medium">{project.category}</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(project.price)}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.shortDescription}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
