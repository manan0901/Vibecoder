'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Footer } from '../../../components/ui/footer';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    title: string;
  };
  paymentMethod: string;
  platformFee: number;
}

export default function AdminTransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      fetchTransactions();
    } catch (error) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const fetchTransactions = async () => {
    try {
      // Mock data for demonstration
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'PURCHASE',
          amount: 2999,
          status: 'COMPLETED',
          date: '2024-06-10T14:30:00Z',
          buyer: {
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.johnson@example.com'
          },
          seller: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          project: {
            title: 'E-commerce React Dashboard'
          },
          paymentMethod: 'Credit Card',
          platformFee: 299
        },
        {
          id: '2',
          type: 'PURCHASE',
          amount: 4999,
          status: 'COMPLETED',
          date: '2024-06-09T10:15:00Z',
          buyer: {
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob.smith@example.com'
          },
          seller: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com'
          },
          project: {
            title: 'React Native Food App'
          },
          paymentMethod: 'PayPal',
          platformFee: 499
        },
        {
          id: '3',
          type: 'REFUND',
          amount: 1999,
          status: 'PENDING',
          date: '2024-06-08T16:45:00Z',
          buyer: {
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie.brown@example.com'
          },
          seller: {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com'
          },
          project: {
            title: 'Node.js API Boilerplate'
          },
          paymentMethod: 'Credit Card',
          platformFee: 199
        }
      ];

      setTransactions(mockTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.buyer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.buyer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.seller.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.seller.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
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
          <p className="mt-4 text-gray-600">Loading transactions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="mt-2 text-gray-600">
              Monitor payments, refunds, and platform fees
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-lg">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.reduce((sum, t) => t.type === 'PURCHASE' ? sum + t.amount : sum, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Platform Fees</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.platformFee, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🔄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">⏳</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {transactions.filter(t => t.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Transactions
                </label>
                <input
                  id="search"
                  type="text"
                  className="input w-full"
                  placeholder="Search by user, project, or transaction..."
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
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.project.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.type === 'PURCHASE' ? '💳' : '🔄'} {transaction.type}
                          </div>
                          <div className="text-xs text-gray-400">
                            via {transaction.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            Buyer: {transaction.buyer.firstName} {transaction.buyer.lastName}
                          </div>
                          <div className="text-gray-500">{transaction.buyer.email}</div>
                          <div className="font-medium text-gray-900 mt-1">
                            Seller: {transaction.seller.firstName} {transaction.seller.lastName}
                          </div>
                          <div className="text-gray-500">{transaction.seller.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Fee: {formatCurrency(transaction.platformFee)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            View Details
                          </button>
                          {transaction.status === 'PENDING' && (
                            <button className="text-green-600 hover:text-green-900">
                              Process
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
