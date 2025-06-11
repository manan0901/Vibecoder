'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

interface SellerAnalytics {
  overview: {
    totalProjects: number;
    totalSales: number;
    totalRevenue: number;
    totalDownloads: number;
    averageRating: number;
    conversionRate: number;
  };
  salesTrend: Array<{
    period: string;
    sales: number;
    revenue: number;
    downloads: number;
  }>;
  topProjects: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
    downloads: number;
    rating: number;
    conversionRate: number;
  }>;
  customerInsights: {
    totalCustomers: number;
    repeatCustomers: number;
    averageOrderValue: number;
    customersByCountry: Array<{
      country: string;
      customers: number;
      percentage: number;
    }>;
  };
  revenueBreakdown: {
    grossRevenue: number;
    platformCommission: number;
    netRevenue: number;
    refunds: number;
  };
}

export default function SellerAnalytics() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (user) {
      if (user.role !== 'SELLER') {
        router.push('/dashboard');
        return;
      }
      fetchAnalytics();
    }
  }, [user, router, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/seller?period=${selectedPeriod}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data.analytics);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (error) {
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100); // Convert from paise to rupees
  };
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need seller privileges to access this page.</p>
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
            onClick={fetchAnalytics}
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
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Seller Analytics
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/seller/projects" className="text-gray-700 hover:text-gray-900">
                Projects
              </Link>
              <Link href="/seller/sales" className="text-gray-700 hover:text-gray-900">
                Sales
              </Link>
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Track your sales performance and insights
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>

          {/* Overview Cards */}
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📦</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{analytics.overview.totalProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 text-lg">💰</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 text-lg">🛒</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Sales</p>
                      <p className="text-2xl font-semibold text-gray-900">{analytics.overview.totalSales}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                        <span className="text-yellow-600 text-lg">⭐</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Average Rating</p>
                      <p className="text-2xl font-semibold text-gray-900">{analytics.overview.averageRating.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Downloads</span>
                      <span className="font-semibold">{analytics.overview.totalDownloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-green-600">{formatPercentage(analytics.overview.conversionRate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold">{formatCurrency(analytics.customerInsights.averageOrderValue)}</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gross Revenue</span>
                      <span className="font-semibold">{formatCurrency(analytics.revenueBreakdown.grossRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Platform Commission</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(analytics.revenueBreakdown.platformCommission)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Refunds</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(analytics.revenueBreakdown.refunds)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-900 font-medium">Net Revenue</span>
                      <span className="font-bold text-green-600">{formatCurrency(analytics.revenueBreakdown.netRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Projects */}
              <div className="card p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{project.sales}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(project.revenue)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{project.downloads}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{project.rating.toFixed(1)}</span>
                              <span className="text-yellow-400 ml-1">★</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-600">{formatPercentage(project.conversionRate)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Insights */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Customers</span>
                      <span className="font-semibold">{analytics.customerInsights.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Repeat Customers</span>
                      <span className="font-semibold">{analytics.customerInsights.repeatCustomers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Repeat Rate</span>
                      <span className="font-semibold text-blue-600">
                        {formatPercentage((analytics.customerInsights.repeatCustomers / analytics.customerInsights.totalCustomers) * 100)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                  <div className="space-y-3">
                    {analytics.customerInsights.customersByCountry.map((country) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <span className="text-gray-900">{country.country}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{country.customers} customers</span>
                          <span className="text-sm font-medium text-blue-600">{formatPercentage(country.percentage)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/analytics/export/seller?format=csv&period=${selectedPeriod}`, '_blank')}
                  className="btn btn-outline px-4 py-2"
                >
                  Export CSV
                </button>
                <Link
                  href="/seller/analytics/insights"
                  className="btn btn-primary px-4 py-2"
                >
                  View Insights
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
