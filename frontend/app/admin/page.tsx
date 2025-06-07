'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

interface PlatformStatistics {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    admins: number;
    newThisMonth: number;
    growthRate: number;
  };
  projects: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    newThisMonth: number;
    topCategories: Array<{ category: string; count: number }>;
  };
  transactions: {
    total: number;
    totalRevenue: number;
    platformCommission: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageOrderValue: number;
    revenueThisMonth: number;
    revenueGrowth: number;
  };
  downloads: {
    total: number;
    uniqueDownloaders: number;
    downloadsThisMonth: number;
    topProjects: Array<{ title: string; downloads: number }>;
  };
}

interface SystemHealth {
  database: { status: string; responseTime: number };
  storage: { used: number; total: number; percentage: number };
  api: { uptime: number; requestsPerMinute: number; errorRate: number };
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user?: string;
  timestamp: string;
  metadata?: any;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<PlatformStatistics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      fetchDashboardData();
    }
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatistics(data.data.statistics);
        setSystemHealth(data.data.systemHealth);
        setRecentActivities(data.data.recentActivities);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
      default:
        return '📋';
    }
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
            onClick={fetchDashboardData}
            className="btn btn-primary px-6 py-2"
          >
            Retry
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
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin/users" className="text-gray-700 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/projects" className="text-gray-700 hover:text-gray-900">
                Projects
              </Link>
              <Link href="/admin/transactions" className="text-gray-700 hover:text-gray-900">
                Transactions
              </Link>
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <Link href="/dashboard" className="btn btn-outline px-4 py-2">
                User Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Platform overview and management tools
            </p>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <>
              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 text-lg">👥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <p className="text-2xl font-semibold text-gray-900">{statistics.users.total.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{statistics.users.growthRate}% this month</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 text-lg">📦</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{statistics.projects.total.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">{statistics.projects.pending} pending review</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 text-lg">💰</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(statistics.transactions.totalRevenue)}</p>
                      <p className="text-sm text-green-600">+{statistics.transactions.revenueGrowth}% this month</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                        <span className="text-yellow-600 text-lg">⬇️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                      <p className="text-2xl font-semibold text-gray-900">{statistics.downloads.total.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">{statistics.downloads.downloadsThisMonth} this month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Statistics */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* User Breakdown */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Buyers</span>
                      <span className="font-semibold">{statistics.users.buyers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sellers</span>
                      <span className="font-semibold">{statistics.users.sellers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admins</span>
                      <span className="font-semibold">{statistics.users.admins.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">New this month</span>
                      <span className="font-semibold text-green-600">+{statistics.users.newThisMonth}</span>
                    </div>
                  </div>
                </div>

                {/* Project Status */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Approved</span>
                      <span className="font-semibold text-green-600">{statistics.projects.approved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Review</span>
                      <span className="font-semibold text-yellow-600">{statistics.projects.pending.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{statistics.projects.rejected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">New this month</span>
                      <span className="font-semibold text-blue-600">+{statistics.projects.newThisMonth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* System Health */}
          {systemHealth && (
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthStatusColor(systemHealth.database.status)}`}>
                    {systemHealth.database.status === 'healthy' ? '✅' : '⚠️'}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Database</p>
                  <p className="text-xs text-gray-500">{systemHealth.database.responseTime}ms response</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemHealth.storage.percentage}%
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Storage Used</p>
                  <p className="text-xs text-gray-500">{systemHealth.storage.used}GB / {systemHealth.storage.total}GB</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemHealth.api.uptime}%
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">API Uptime</p>
                  <p className="text-xs text-gray-500">{systemHealth.api.requestsPerMinute} req/min</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Link href="/admin/activities" className="text-blue-600 hover:text-blue-800 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    )}
                    <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Link href="/admin/users" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
                <p className="text-gray-600 text-sm">View and manage user accounts</p>
              </div>
            </Link>

            <Link href="/admin/projects" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Projects</h3>
                <p className="text-gray-600 text-sm">Moderate and approve projects</p>
              </div>
            </Link>

            <Link href="/admin/transactions" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Transactions</h3>
                <p className="text-gray-600 text-sm">Monitor payments and refunds</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
