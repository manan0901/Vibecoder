'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
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
              <span className="text-gray-700">
                Welcome, {user.firstName}!
              </span>
              <button
                onClick={handleLogout}
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage your account and {user.role === 'SELLER' ? 'projects' : 'purchases'}
            </p>
          </div>

          {/* User Info Card */}
          <div className="card p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'SELLER' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                  {user.isVerified ? (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠ Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/profile" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4">👤</div>
              <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
              <p className="text-gray-600">Update your personal information and settings</p>
            </Link>

            {user.role === 'SELLER' ? (
              <>
                <Link href="/projects/new" className="card p-6 hover:shadow-md transition-shadow">
                  <div className="text-green-600 text-3xl mb-4">📦</div>
                  <h3 className="text-lg font-semibold mb-2">Upload Project</h3>
                  <p className="text-gray-600">Share your coding projects with the community</p>
                </Link>
                
                <Link href="/projects/manage" className="card p-6 hover:shadow-md transition-shadow">
                  <div className="text-purple-600 text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2">Manage Projects</h3>
                  <p className="text-gray-600">View and edit your uploaded projects</p>
                </Link>
              </>
            ) : (
              <>
                <Link href="/projects" className="card p-6 hover:shadow-md transition-shadow">
                  <div className="text-green-600 text-3xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold mb-2">Browse Projects</h3>
                  <p className="text-gray-600">Discover amazing coding projects</p>
                </Link>
                
                <Link href="/purchases" className="card p-6 hover:shadow-md transition-shadow">
                  <div className="text-purple-600 text-3xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold mb-2">My Purchases</h3>
                  <p className="text-gray-600">View your purchased projects</p>
                </Link>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display.</p>
              <p className="text-sm mt-2">
                {user.role === 'SELLER' 
                  ? 'Start by uploading your first project!' 
                  : 'Start by browsing our amazing projects!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
