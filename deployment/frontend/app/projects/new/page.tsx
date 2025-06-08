'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    techStack: [] as string[],
    tags: [] as string[],
    price: '',
    licenseType: 'SINGLE' as 'SINGLE' | 'MULTI' | 'COMMERCIAL',
    demoUrl: '',
    githubUrl: '',
  });
  
  const [currentTech, setCurrentTech] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Backend Development',
    'Frontend Development',
    'Full Stack',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Game Development',
    'Desktop Applications',
  ];

  // Check if user is a seller
  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only sellers can create projects.</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTechStack = () => {
    if (currentTech.trim() && !formData.techStack.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const removeTechStack = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = 'At least one technology is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
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
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/projects/${data.data.project.id}/edit`);
      } else {
        setErrors({ general: data.error || 'Project creation failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-2xl font-bold text-blue-600"
              >
                VibeCoder
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-outline px-4 py-2"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-gray-600">
              Share your amazing project with the VibeCoder community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Project Information</h2>
              
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className={`input mt-1 ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter your project title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                    Short Description *
                  </label>
                  <input
                    id="shortDescription"
                    name="shortDescription"
                    type="text"
                    required
                    className={`input mt-1 ${errors.shortDescription ? 'border-red-500' : ''}`}
                    placeholder="Brief description (max 200 characters)"
                    maxLength={200}
                    value={formData.shortDescription}
                    onChange={handleChange}
                  />
                  {errors.shortDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className={`input mt-1 ${errors.category ? 'border-red-500' : ''}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    className={`input mt-1 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="Enter price in rupees"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
                    License Type *
                  </label>
                  <select
                    id="licenseType"
                    name="licenseType"
                    className="input mt-1"
                    value={formData.licenseType}
                    onChange={handleChange}
                  >
                    <option value="SINGLE">Single Use License</option>
                    <option value="MULTI">Multi Use License</option>
                    <option value="COMMERCIAL">Commercial License</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
                    Demo URL (Optional)
                  </label>
                  <input
                    id="demoUrl"
                    name="demoUrl"
                    type="url"
                    className="input mt-1"
                    placeholder="https://your-demo-url.com"
                    value={formData.demoUrl}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                    GitHub URL (Optional)
                  </label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    className="input mt-1"
                    placeholder="https://github.com/username/repo"
                    value={formData.githubUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className={`input mt-1 ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Provide a detailed description of your project, its features, and how to use it..."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Technologies & Tags</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Add technology (e.g., React, Node.js)"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                    />
                    <button
                      type="button"
                      onClick={addTechStack}
                      className="btn btn-outline px-4 py-2"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map(tech => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.techStack && (
                    <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Add tag (e.g., responsive, api)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn btn-outline px-4 py-2"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn btn-outline px-6 py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
