'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Footer } from '../../../components/ui/footer';

interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  joinedDate: string;
  lastLogin: string;
  permissions: string[];
}

export default function AdminProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

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
      fetchProfile();
    } catch (error) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const fetchProfile = async () => {
    try {
      // Mock data for demonstration
      const mockProfile: AdminProfile = {
        id: '1',
        firstName: 'VibeCoder',
        lastName: 'Admin',
        email: 'admin@vibecoder.com',
        role: 'ADMIN',
        phone: '+91-9999999999',
        bio: 'Administrator of VibeCoder marketplace platform',
        joinedDate: '2024-01-01',
        lastLogin: new Date().toISOString(),
        permissions: [
          'USER_MANAGEMENT',
          'PROJECT_MODERATION',
          'TRANSACTION_MONITORING',
          'SYSTEM_CONFIGURATION',
          'ANALYTICS_ACCESS'
        ]
      };

      setProfile(mockProfile);
      setFormData(mockProfile);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = { ...profile, ...formData };
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load admin profile.</p>
          <Link href="/admin" className="btn btn-primary px-6 py-2">
            Back to Admin Dashboard
          </Link>
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
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your admin account information and settings
            </p>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary px-4 py-2"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary px-4 py-2 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{profile.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{profile.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900">{profile.email}</p>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="input w-full"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className="input w-full h-24"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    {profile.role}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joined Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.joinedDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Login
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.lastLogin).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                  >
                    {permission.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
