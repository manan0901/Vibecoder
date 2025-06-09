'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

interface ModerationQueueItem {
  id: string;
  title: string;
  category: string;
  status: string;
  submittedAt: string;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  flagCount: number;
  lastModeratedAt?: string;
  moderatedBy?: string;
}

interface ModerationStatistics {
  queue: {
    pending: number;
    approved: number;
    rejected: number;
    flagged: number;
  };
  performance: {
    averageReviewTime: number;
    reviewsToday: number;
    reviewsThisWeek: number;
    reviewsThisMonth: number;
  };
  moderators: Array<{
    id: string;
    name: string;
    reviewsToday: number;
    reviewsThisWeek: number;
    averageReviewTime: number;
  }>;
}

export default function ModerationDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [queueItems, setQueueItems] = useState<ModerationQueueItem[]>([]);
  const [statistics, setStatistics] = useState<ModerationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  console.log('Error state:', error); // Temporary fix for unused variable
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'PENDING',
    category: '',
    priority: '',
    search: '',
  });

  useEffect(() => {
    if (user) {
      if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      fetchModerationData();
    }
  }, [user, router, currentPage, filters]);

  const fetchModerationData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...filters,
      });

      const [queueResponse, statsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/queue?${queryParams}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/statistics`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const queueData = await queueResponse.json();
      const statsData = await statsResponse.json();

      if (queueData.success) {
        setQueueItems(queueData.data.items);
      }

      if (statsData.success) {
        setStatistics(statsData.data.statistics);
      }

    } catch (error) {
      setError('Failed to load moderation data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerateProject = async (projectId: string, action: string, reason?: string, notes?: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/projects/${projectId}/moderate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason, notes }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the queue
        fetchModerationData();
        alert(`Project ${action.toLowerCase()}ed successfully!`);
      } else {
        alert('Failed to moderate project');
      }
    } catch (error) {
      alert('Failed to moderate project');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100';
      case 'HIGH':
        return 'text-orange-600 bg-orange-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link href="/dashboard" className="btn btn-primary px-6 py-2">
            Back to Dashboard
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
          <p className="mt-4 text-gray-600">Loading moderation dashboard...</p>
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
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Moderation Panel
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Admin Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/projects" className="text-gray-700 hover:text-gray-900">
                Projects
              </Link>
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
            <p className="mt-2 text-gray-600">
              Review and moderate project submissions
            </p>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">⏳</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Review</p>
                    <p className="text-2xl font-semibold text-gray-900">{statistics.queue.pending}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-green-600 text-lg">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Approved</p>
                    <p className="text-2xl font-semibold text-gray-900">{statistics.queue.approved}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                      <span className="text-red-600 text-lg">❌</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                    <p className="text-2xl font-semibold text-gray-900">{statistics.queue.rejected}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                      <span className="text-orange-600 text-lg">🚩</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Flagged</p>
                    <p className="text-2xl font-semibold text-gray-900">{statistics.queue.flagged}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search projects..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Moderation Queue</h2>
            </div>
            
            {queueItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {queueItems.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          {item.flagCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                              🚩 {item.flagCount} flags
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {item.category}
                          </span>
                          <span>by {item.seller.firstName} {item.seller.lastName}</span>
                          <span>Submitted: {formatDate(item.submittedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/admin/moderation/projects/${item.id}`}
                          className="btn btn-outline px-3 py-1 text-sm"
                        >
                          Review
                        </Link>
                        
                        <button
                          onClick={() => handleModerateProject(item.id, 'APPROVE')}
                          className="btn btn-success px-3 py-1 text-sm"
                        >
                          Approve
                        </button>
                        
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for rejection:');
                            if (reason) {
                              handleModerateProject(item.id, 'REJECT', 'POOR_QUALITY', reason);
                            }
                          }}
                          className="btn btn-danger px-3 py-1 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Items in Queue</h3>
                <p className="text-gray-500">
                  {filters.status === 'PENDING' 
                    ? 'All projects have been reviewed!' 
                    : 'No projects match the current filters.'}
                </p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          {statistics && (
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Review Time</span>
                    <span className="font-semibold">{statistics.performance.averageReviewTime} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews Today</span>
                    <span className="font-semibold">{statistics.performance.reviewsToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews This Week</span>
                    <span className="font-semibold">{statistics.performance.reviewsThisWeek}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews This Month</span>
                    <span className="font-semibold">{statistics.performance.reviewsThisMonth}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderator Activity</h3>
                <div className="space-y-4">
                  {statistics.moderators.map((moderator) => (
                    <div key={moderator.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{moderator.name}</span>
                        <span className="text-sm text-gray-500">{moderator.reviewsToday} today</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{moderator.reviewsThisWeek} this week</span>
                        <span>{moderator.averageReviewTime}h avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
