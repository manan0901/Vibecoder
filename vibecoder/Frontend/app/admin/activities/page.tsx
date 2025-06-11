'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Footer } from '../../../components/ui/footer';

interface Activity {
  id: string;
  type: string;
  description: string;
  user?: string;
  timestamp: string;
  metadata?: any;
  severity: 'low' | 'medium' | 'high';
}

export default function AdminActivitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
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
      fetchActivities();
    } catch (error) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const fetchActivities = async () => {
    try {
      // Mock data for demonstration
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'New user registered: john.doe@example.com',
          user: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          severity: 'low'
        },
        {
          id: '2',
          type: 'PROJECT_SUBMITTED',
          description: 'New project submitted: React E-commerce Template',
          user: 'seller@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          severity: 'medium'
        },
        {
          id: '3',
          type: 'PAYMENT_COMPLETED',
          description: 'Payment completed: ₹2,499 for Mobile App Template',
          user: 'buyer@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          severity: 'low'
        },
        {
          id: '4',
          type: 'PROJECT_APPROVED',
          description: 'Project approved: Social Media Dashboard',
          user: 'admin@vibecoder.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          severity: 'medium'
        },
        {
          id: '5',
          type: 'SECURITY_ALERT',
          description: 'Multiple failed login attempts detected for user: suspicious@example.com',
          user: 'suspicious@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          severity: 'high'
        },
        {
          id: '6',
          type: 'REFUND_REQUESTED',
          description: 'Refund requested for project: Node.js API Boilerplate',
          user: 'customer@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          severity: 'medium'
        }
      ];

      setActivities(mockActivities);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.user && activity.user.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === 'all' || activity.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'USER_REGISTRATION':
        return '👤';
      case 'PROJECT_SUBMITTED':
        return '📦';
      case 'PAYMENT_COMPLETED':
        return '💳';
      case 'PROJECT_APPROVED':
        return '✅';
      case 'DOWNLOAD_COMPLETED':
        return '⬇️';
      case 'SECURITY_ALERT':
        return '🚨';
      case 'REFUND_REQUESTED':
        return '🔄';
      default:
        return '📋';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <p className="mt-4 text-gray-600">Loading activities...</p>
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
              <Link href="/admin/projects" className="text-gray-700 hover:text-gray-900">
                Projects
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
            <h1 className="text-3xl font-bold text-gray-900">System Activity Log</h1>
            <p className="mt-2 text-gray-600">
              Monitor all platform activities and system events
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Activities
                </label>
                <input
                  id="search"
                  type="text"
                  className="input w-full"
                  placeholder="Search by description or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Type
                </label>
                <select
                  id="filter"
                  className="input w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="USER_REGISTRATION">User Registration</option>
                  <option value="PROJECT_SUBMITTED">Project Submission</option>
                  <option value="PAYMENT_COMPLETED">Payment Completed</option>
                  <option value="PROJECT_APPROVED">Project Approved</option>
                  <option value="SECURITY_ALERT">Security Alert</option>
                  <option value="REFUND_REQUESTED">Refund Requested</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(activity.severity)}`}>
                            {activity.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      {activity.user && (
                        <p className="text-sm text-gray-500 mt-1">
                          by {activity.user}
                        </p>
                      )}
                      <div className="mt-2 flex items-center text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {activity.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No activities found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
