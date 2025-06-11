'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';
import { formatCurrency } from '../../../lib/utils';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface SellerStats {
  totalEarnings: number;
  totalSales: number;
  activeProjects: number;
  totalViews: number;
  rating: number;
  reviewCount: number;
}

interface RecentSale {
  id: string;
  projectTitle: string;
  amount: number;
  buyerName: string;
  date: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'SELLER') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchSellerData();
  }, [router]);

  const fetchSellerData = async () => {
    try {
      // Mock data for development
      const mockStats: SellerStats = {
        totalEarnings: 125000,
        totalSales: 47,
        activeProjects: 12,
        totalViews: 2340,
        rating: 4.8,
        reviewCount: 23,
      };

      const mockRecentSales: RecentSale[] = [
        {
          id: '1',
          projectTitle: 'React E-commerce Dashboard',
          amount: 4999,
          buyerName: 'John Doe',
          date: '2024-01-15',
        },
        {
          id: '2',
          projectTitle: 'Node.js API Boilerplate',
          amount: 2999,
          buyerName: 'Jane Smith',
          date: '2024-01-14',
        },
        {
          id: '3',
          projectTitle: 'Mobile App UI Kit',
          amount: 1999,
          buyerName: 'Mike Johnson',
          date: '2024-01-13',
        },
      ];

      setStats(mockStats);
      setRecentSales(mockRecentSales);
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vibecoder-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user.firstName}! Here's your seller overview.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-lg">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats ? formatCurrency(stats.totalEarnings) : '₹0'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.totalSales || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.activeProjects || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">⭐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.rating || 0} ({stats?.reviewCount || 0})
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/projects/new" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-vibecoder-600 text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">Upload Project</h3>
              <p className="text-gray-600">Add a new project to your portfolio</p>
            </Link>

            <Link href="/projects/manage" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Manage Projects</h3>
              <p className="text-gray-600">Edit and update your existing projects</p>
            </Link>

            <Link href="/seller/analytics" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">View detailed sales and performance data</p>
            </Link>

            <Link href="/profile" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-purple-600 text-3xl mb-4">👤</div>
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p className="text-gray-600">Update your seller profile and settings</p>
            </Link>
          </div>

          {/* Recent Sales */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
              <Link href="/seller/analytics" className="text-vibecoder-600 hover:text-vibecoder-500">
                View All
              </Link>
            </div>

            {recentSales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No sales yet. Upload your first project to get started!</p>
                <Link href="/projects/new" className="btn btn-primary mt-4">
                  Upload Project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.projectTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.buyerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(sale.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
