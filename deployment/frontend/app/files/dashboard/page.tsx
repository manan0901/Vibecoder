'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

interface FileData {
  id: string;
  filename: string;
  projectTitle: string;
  uploadedAt: string;
  size: number;
  type: 'project' | 'screenshot' | 'document';
}

interface StorageUsage {
  used: number;
  limit: number;
  projects: number;
  files: number;
}

interface DashboardData {
  totalFiles: number;
  totalSize: number;
  projectFiles: number;
  screenshots: number;
  recentUploads: FileData[];
  storageBreakdown: {
    projects: number;
    screenshots: number;
    documents: number;
  };
}

export default function FileManagementDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'SELLER') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch dashboard data
      const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const dashboardResult = await dashboardResponse.json();
      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data.dashboard);
      }

      // Fetch storage usage
      const storageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/storage/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const storageResult = await storageResponse.json();
      if (storageResult.success) {
        setStorageUsage(storageResult.data.usage);
      }

    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getFileTypeIcon = (type: string): string => {
    switch (type) {
      case 'project':
        return '📦';
      case 'screenshot':
        return '🖼️';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only sellers can access file management.</p>
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
          <p className="mt-4 text-gray-600">Loading file management dashboard...</p>
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
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
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
            <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
            <p className="mt-2 text-gray-600">
              Manage your project files, screenshots, and storage usage
            </p>
          </div>

          {/* Storage Usage */}
          {storageUsage && (
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Used Storage</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(storageUsage.used)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(storageUsage.limit)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{storageUsage.projects}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{storageUsage.files}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Storage Usage</span>
                  <span>{Math.round((storageUsage.used / storageUsage.limit) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(storageUsage.used / storageUsage.limit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* File Statistics */}
          {dashboardData && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📦</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Project Files</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.projectFiles}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">🖼️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Screenshots</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.screenshots}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">💾</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Size</p>
                      <p className="text-2xl font-bold text-gray-900">{formatFileSize(dashboardData.totalSize)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="card p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Uploads</h2>
                  <Link
                    href="/projects/manage"
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    Manage All Files
                  </Link>
                </div>
                
                {dashboardData.recentUploads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent uploads</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentUploads.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getFileTypeIcon(file.type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{file.filename}</p>
                            <p className="text-sm text-gray-500">{file.projectTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatFileSize(file.size)}</p>
                          <p className="text-xs text-gray-500">{formatDate(file.uploadedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Storage Breakdown */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Storage Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📦</span>
                      <span className="font-medium">Project Files</span>
                    </div>
                    <span className="text-gray-900">{formatFileSize(dashboardData.storageBreakdown.projects)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600">🖼️</span>
                      <span className="font-medium">Screenshots</span>
                    </div>
                    <span className="text-gray-900">{formatFileSize(dashboardData.storageBreakdown.screenshots)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-purple-600">📄</span>
                      <span className="font-medium">Documents</span>
                    </div>
                    <span className="text-gray-900">{formatFileSize(dashboardData.storageBreakdown.documents)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
