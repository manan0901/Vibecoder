'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

interface DownloadSession {
  id: string;
  status: string;
  downloadCount: number;
  accessType: string;
  createdAt: string;
  lastDownloadAt?: string;
  expiresAt: string;
  project: {
    id: string;
    title: string;
    category: string;
    price: number;
    seller: {
      firstName: string;
      lastName: string;
    };
  };
}

interface DownloadHistory {
  downloads: DownloadSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function DownloadHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      fetchDownloadHistory();
    }
  }, [user, currentPage]);

  const fetchDownloadHistory = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/history?page=${currentPage}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDownloadHistory(data.data);
      } else {
        setError('Failed to load download history');
      }
    } catch (error) {
      setError('Failed to load download history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getAccessTypeIcon = (accessType: string): string => {
    switch (accessType) {
      case 'OWNER':
        return '👑';
      case 'PURCHASED':
        return '💳';
      case 'FREE':
        return '🆓';
      case 'ADMIN':
        return '🔧';
      default:
        return '📁';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please login to view your download history.</p>
          <Link href="/auth/login" className="btn btn-primary px-6 py-2">
            Login
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
          <p className="mt-4 text-gray-600">Loading download history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary px-6 py-2"
          >
            Back to Dashboard
          </button>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Download History</h1>
            <p className="mt-2 text-gray-600">
              View and manage your project downloads
            </p>
          </div>

          {downloadHistory && downloadHistory.downloads.length > 0 ? (
            <>
              {/* Downloads List */}
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Your Downloads</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {downloadHistory.downloads.map((download) => (
                    <div key={download.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getAccessTypeIcon(download.accessType)}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {download.project.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                by {download.project.seller.firstName} {download.project.seller.lastName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {download.project.category}
                            </span>
                            <span>₹{download.project.price.toLocaleString()}</span>
                            <span>{download.downloadCount} downloads</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Created: {formatDate(download.createdAt)}</span>
                            {download.lastDownloadAt && (
                              <span>Last download: {formatDate(download.lastDownloadAt)}</span>
                            )}
                            <span>Expires: {formatDate(download.expiresAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                            {download.status}
                          </span>
                          
                          <div className="flex space-x-2">
                            <Link
                              href={`/projects/${download.project.id}`}
                              className="btn btn-outline px-3 py-1 text-sm"
                            >
                              View Project
                            </Link>
                            
                            {download.status === 'COMPLETED' && new Date(download.expiresAt) > new Date() && (
                              <button
                                onClick={() => {
                                  // TODO: Implement re-download functionality
                                  alert('Re-download functionality will be implemented');
                                }}
                                className="btn btn-primary px-3 py-1 text-sm"
                              >
                                Download Again
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {downloadHistory.pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((downloadHistory.pagination.page - 1) * downloadHistory.pagination.limit) + 1} to{' '}
                    {Math.min(downloadHistory.pagination.page * downloadHistory.pagination.limit, downloadHistory.pagination.total)} of{' '}
                    {downloadHistory.pagination.total} downloads
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {downloadHistory.pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(downloadHistory.pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === downloadHistory.pagination.totalPages}
                      className="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Downloads Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't downloaded any projects yet. Browse our marketplace to find amazing projects!
              </p>
              <Link
                href="/projects"
                className="btn btn-primary px-6 py-3"
              >
                Browse Projects
              </Link>
            </div>
          )}

          {/* Download Statistics */}
          {downloadHistory && downloadHistory.downloads.length > 0 && (
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {downloadHistory.pagination.total}
                </div>
                <div className="text-sm text-gray-500">Total Downloads</div>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {downloadHistory.downloads.filter(d => d.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-500">Successful Downloads</div>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {new Set(downloadHistory.downloads.map(d => d.project.id)).size}
                </div>
                <div className="text-sm text-gray-500">Unique Projects</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
