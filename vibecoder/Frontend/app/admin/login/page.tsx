'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Admin Test Credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@vibecodeseller.com',
  password: 'admin123',
  role: 'ADMIN',
  name: 'VibeCoder Admin'
};

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuickLogin = () => {
    setFormData({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors['email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors['email'] = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors['password'] = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate admin authentication
      if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
        // Mock admin authentication
        const mockAdminUser = {
          id: 'admin-1',
          email: ADMIN_CREDENTIALS.email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isVerified: true
        };

        // Store in localStorage for demo purposes
        localStorage.setItem('user', JSON.stringify(mockAdminUser));
        localStorage.setItem('accessToken', 'mock-admin-token');
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setErrors({ general: 'Invalid admin credentials' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vibecoder-600 to-vibecoder-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-white">VibeCoder</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-sm text-vibecoder-100">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Admin Credentials Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-xl">🔐</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                Test Admin Credentials
              </h3>
              <div className="bg-white rounded-md p-3 border border-yellow-200 text-xs">
                <p className="text-gray-700 mb-1"><strong>Email:</strong> {ADMIN_CREDENTIALS.email}</p>
                <p className="text-gray-700"><strong>Password:</strong> {ADMIN_CREDENTIALS.password}</p>
              </div>
              <button
                onClick={handleQuickLogin}
                className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 underline"
              >
                Click to auto-fill credentials
              </button>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form className="bg-white rounded-lg shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-vibecoder-500 focus:border-vibecoder-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="admin@vibecodeseller.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-vibecoder-500 focus:border-vibecoder-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter admin password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vibecoder-600 hover:bg-vibecoder-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibecoder-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Admin Panel'
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/auth/login"
              className="text-sm text-vibecoder-600 hover:text-vibecoder-700"
            >
              Regular user login
            </Link>
            <br />
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to homepage
            </Link>
          </div>
        </form>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-vibecoder-100">
            ⚠️ This is a demo admin panel for testing purposes only.
            <br />
            In production, use secure authentication systems.
          </p>
        </div>
      </div>
    </div>
  );
}
