'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Footer } from '../../../components/ui/footer';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  lastActive: string;
  projectCount?: number;
  totalPurchases?: number;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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
      fetchUsers();
    } catch (error) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'BUYER',
          status: 'ACTIVE',
          joinedDate: '2024-01-15',
          lastActive: '2024-06-10',
          totalPurchases: 5
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'SELLER',
          status: 'ACTIVE',
          joinedDate: '2023-11-20',
          lastActive: '2024-06-11',
          projectCount: 12
        },
        {
          id: '3',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
          role: 'BUYER',
          status: 'SUSPENDED',
          joinedDate: '2024-03-10',
          lastActive: '2024-05-15',
          totalPurchases: 2
        }
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
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
          <p className="mt-4 text-gray-600">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <input
                  id="search"
                  type="text"
                  className="input w-full"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Role
                </label>
                <select
                  id="filter"
                  className="input w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="BUYER">Buyers</option>
                  <option value="SELLER">Sellers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'SELLER' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.role === 'SELLER' && user.projectCount ? 
                            `${user.projectCount} projects` : 
                            user.totalPurchases ? `${user.totalPurchases} purchases` : 'No activity'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            View
                          </button>
                          <button 
                            onClick={() => handleStatusChange(user.id, user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                            className={`${user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
