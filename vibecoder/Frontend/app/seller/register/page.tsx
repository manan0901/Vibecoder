'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  skills: string;
  portfolio: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function SellerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    skills: '',
    portfolio: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, agreeToTerms, ...submitData } = formData;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          role: 'SELLER',
          specialties: formData.skills.split(',').map(s => s.trim()),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to seller dashboard
        router.push('/seller/dashboard');
      } else {
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
            <p className="mt-2 text-gray-600">
              Join thousands of developers earning money from their coding skills
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`input mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`input mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`input mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`input mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                required
                className={`input mt-1 ${errors.bio ? 'border-red-500' : ''}`}
                placeholder="Tell us about yourself and your experience..."
                value={formData.bio}
                onChange={handleChange}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
              )}
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills *
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                className={`input mt-1 ${errors.skills ? 'border-red-500' : ''}`}
                placeholder="React, Node.js, Python, etc. (comma separated)"
                value={formData.skills}
                onChange={handleChange}
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                Portfolio URL
              </label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                className="input mt-1"
                placeholder="https://your-portfolio.com"
                value={formData.portfolio}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                className="h-4 w-4 text-vibecoder-600 focus:ring-vibecoder-500 border-gray-300 rounded"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="text-vibecoder-600 hover:text-vibecoder-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-vibecoder-600 hover:text-vibecoder-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {isLoading ? 'Creating Account...' : 'Become a Seller'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-vibecoder-600 hover:text-vibecoder-500">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
