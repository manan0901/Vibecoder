'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Footer } from '../../../components/ui/footer';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  status: string;
  submittedDate: string;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
  downloadCount: number;
  rating: number;
  reviewCount: number;
}

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/admin/login');
        return;
      }
      fetchProjects();
    } catch (error) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const fetchProjects = async () => {
    try {
      // Mock data for demonstration
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'E-commerce React Dashboard',
          shortDescription: 'Modern e-commerce admin dashboard with React and TypeScript',
          price: 2999,
          category: 'Web Development',
          status: 'PENDING',
          submittedDate: '2024-06-10',
          seller: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          downloadCount: 0,
          rating: 0,
          reviewCount: 0
        },
        {
          id: '2',
          title: 'React Native Food App',
          shortDescription: 'Full-featured food delivery app for iOS and Android',
          price: 4999,
          category: 'Mobile Development',
          status: 'APPROVED',
          submittedDate: '2024-06-05',
          seller: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com'
          },
          downloadCount: 23,
          rating: 4.8,
          reviewCount: 8
        },
        {
          id: '3',
          title: 'Node.js API Boilerplate',
          shortDescription: 'Production-ready Node.js API boilerplate with best practices',
          price: 1999,
          category: 'Backend Development',
          status: 'REJECTED',
          submittedDate: '2024-06-08',
          seller: {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com'
          },
          downloadCount: 0,
          rating: 0,
          reviewCount: 0
        }
      ];

      setProjects(mockProjects);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (projectId: string, newStatus: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link href="/admin" className="btn btn-primary px-6 py-2">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                VibeCoder
              </Link>
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/transactions" className="text-gray-700 hover:text-gray-900">
                Transactions
              </Link>
              <span className="text-gray-700">Welcome, Admin!</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('accessToken');
                  router.push('/admin/login');
                }}
                className="btn btn-outline px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
            <p className="mt-2 text-gray-600">
              Review and moderate submitted projects
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Projects
                </label>
                <input
                  id="search"
                  type="text"
                  className="input w-full"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  id="filter"
                  className="input w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500">{project.shortDescription}</div>
                          <div className="text-xs text-gray-400 mt-1">{project.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.seller.firstName} {project.seller.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{project.seller.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{project.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          project.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.downloadCount} downloads
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.rating > 0 ? `${project.rating}★ (${project.reviewCount})` : 'No reviews yet'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {project.status === 'PENDING' ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleStatusChange(project.id, 'APPROVED')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusChange(project.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              View Details
                            </button>
                            {project.status !== 'PENDING' && (
                              <button 
                                onClick={() => handleStatusChange(project.id, 'PENDING')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Reset to Pending
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
