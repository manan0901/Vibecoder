'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../lib/auth-context';

interface Analytics {
  overview: {
    totalViews: number;
    totalDownloads: number;
    totalReviews: number;
    averageRating: number;
    totalRevenue: number;
  };
  monthlyStats: Array<{
    month: string;
    views: number;
    downloads: number;
    revenue: number;
  }>;
  recentReviews: Array<{
    rating: number;
    createdAt: string;
  }>;
}

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function ProjectAnalyticsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'SELLER') {
      fetchAnalytics();
    }
  }, [user, params.id]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // First get project details
      const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const projectData = await projectResponse.json();
      if (projectData.success) {
        setProject(projectData.data.project);
      }

      // Then get analytics
      const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const analyticsData = await analyticsResponse.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data.analytics);
      } else {
        setError(analyticsData.error || 'Failed to load analytics');
      }
    } catch (error) {
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only sellers can view project analytics.</p>
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
          <p className="mt-4 text-gray-600">Loading analytics...</p>
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
            onClick={() => router.push('/projects/manage')}
            className="btn btn-primary px-6 py-2"
          >
            Back to Projects
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
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                VibeCoder
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <Link href="/projects/manage" className="btn btn-outline px-4 py-2">
                Manage Projects
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/projects/manage"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Projects
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{project?.title}</h1>
            <p className="mt-2 text-gray-600">Project Analytics Dashboard</p>
          </div>

          {analytics && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">👁️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">⬇️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Downloads</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalDownloads.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">⭐</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageRating}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">💬</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalReviews}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-sm">💰</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="card p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Monthly Performance</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.monthlyStats.slice(-6).map((stat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(stat.month + '-01').toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.downloads.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{stat.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Reviews */}
              {analytics.recentReviews.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6">Recent Reviews</h2>
                  <div className="space-y-4">
                    {analytics.recentReviews.map((review, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
