'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  price: number;
  status: string;
  viewCount: number;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function ManageProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user && user.role === 'SELLER') {
      fetchProjects();
    }
  }, [user, filter, sortBy]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/projects?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        let sortedProjects = data.data.projects;
        
        // Sort projects
        switch (sortBy) {
          case 'oldest':
            sortedProjects.sort((a: Project, b: Project) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            break;
          case 'price_high':
            sortedProjects.sort((a: Project, b: Project) => b.price - a.price);
            break;
          case 'price_low':
            sortedProjects.sort((a: Project, b: Project) => a.price - b.price);
            break;
          case 'views':
            sortedProjects.sort((a: Project, b: Project) => b.viewCount - a.viewCount);
            break;
          case 'downloads':
            sortedProjects.sort((a: Project, b: Project) => b.downloadCount - a.downloadCount);
            break;
          default: // newest
            sortedProjects.sort((a: Project, b: Project) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        
        setProjects(sortedProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only sellers can manage projects.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary px-6 py-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
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
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                VibeCoder
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <Link href="/dashboard" className="btn btn-outline px-4 py-2">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
              <p className="mt-2 text-gray-600">
                View and manage all your uploaded projects
              </p>
            </div>
            
            <Link
              href="/projects/new"
              className="btn btn-primary px-6 py-3"
            >
              Upload New Project
            </Link>
          </div>

          {/* Filters and Sorting */}
          <div className="card p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
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
                  <option value="all">All Projects</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  id="sort"
                  className="input w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't uploaded any projects yet." 
                  : `No projects with status "${filter}" found.`
                }
              </p>
              <Link
                href="/projects/new"
                className="btn btn-primary px-6 py-3"
              >
                Upload Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        {!project.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Deleted
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{project.shortDescription}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="font-medium text-gray-900">₹{project.price.toLocaleString()}</span>
                        </span>
                        <span>{project.category}</span>
                        <span>{project.viewCount} views</span>
                        <span>{project.downloadCount} downloads</span>
                        {project.reviewCount > 0 && (
                          <span className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {project.rating.toFixed(1)} ({project.reviewCount})
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-400">
                        Created: {formatDate(project.createdAt)} • 
                        Updated: {formatDate(project.updatedAt)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Link
                        href={`/projects/${project.id}`}
                        className="btn btn-outline px-4 py-2 text-sm"
                      >
                        View
                      </Link>
                      
                      {(project.status === 'DRAFT' || project.status === 'REJECTED') && (
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="btn btn-primary px-4 py-2 text-sm"
                        >
                          Edit
                        </Link>
                      )}
                      
                      {project.status === 'APPROVED' && (
                        <Link
                          href={`/projects/${project.id}/analytics`}
                          className="btn btn-secondary px-4 py-2 text-sm"
                        >
                          Analytics
                        </Link>
                      )}

                      {project.status === 'PENDING' && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          Under Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
