'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import SecureDownload from '../../../components/SecureDownload';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  viewCount: number;
  category: string;
  techStack: string[];
  tags: string[];
  licenseType: string;
  demoUrl?: string;
  githubUrl?: string;
  screenshots: string[];
  status: string;
  createdAt: string;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isVerified: boolean;
    bio?: string;
    _count: {
      projects: number;
    };
  };
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface RelatedProject {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setProject(data.data.project);
        // Fetch related projects
        fetchRelatedProjects(data.data.project.category);
      } else {
        setError('Project not found');
      }
    } catch (error) {
      setError('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProjects = async (category: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?category=${encodeURIComponent(category)}&limit=4`);
      const data = await response.json();

      if (data.success) {
        // Filter out current project
        const related = data.data.projects.filter((p: any) => p.id !== params.id);
        setRelatedProjects(related.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch related projects:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/projects" className="btn btn-primary px-6 py-2">
            Browse Projects
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
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.firstName}!</span>
                  <Link href="/dashboard" className="btn btn-outline px-4 py-2">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-outline px-4 py-2">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary px-4 py-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-gray-500">
                  Projects
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href={`/projects?category=${encodeURIComponent(project.category)}`} className="text-gray-400 hover:text-gray-500">
                  {project.category}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{project.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2">
              {/* Project Header */}
              <div className="card p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-lg text-gray-600">{project.shortDescription}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">₹{project.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{project.licenseType} License</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    {renderStars(project.rating)}
                    <span className="ml-2">{project.rating} ({project.reviewCount} reviews)</span>
                  </div>
                  <span>{project.downloadCount} downloads</span>
                  <span>{project.viewCount} views</span>
                  <span>Updated {formatDate(project.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack.map(tech => (
                    <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screenshots */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.screenshots.map((screenshot, index) => (
                      <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Screenshot {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="card mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    {[
                      { id: 'description', label: 'Description' },
                      { id: 'reviews', label: `Reviews (${project.reviewCount})` },
                      { id: 'seller', label: 'About Seller' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'description' && (
                    <div>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                      </div>
                      
                      {(project.demoUrl || project.githubUrl) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h3 className="text-lg font-semibold mb-4">Links</h3>
                          <div className="flex flex-wrap gap-4">
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline px-4 py-2"
                              >
                                🌐 Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline px-4 py-2"
                              >
                                📂 GitHub Repository
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      {project.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {project.reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                              <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {review.user.firstName[0]}{review.user.lastName[0]}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-medium text-gray-900">
                                      {review.user.firstName} {review.user.lastName}
                                    </span>
                                    <div className="flex">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No reviews yet. Be the first to review this project!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'seller' && (
                    <div>
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          {project.seller.avatar ? (
                            <img 
                              src={project.seller.avatar} 
                              alt="Seller" 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-gray-600">
                              {project.seller.firstName[0]}{project.seller.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {project.seller.firstName} {project.seller.lastName}
                            </h3>
                            {project.seller.isVerified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">
                            {project.seller._count.projects} projects published
                          </p>
                          {project.seller.bio && (
                            <p className="text-gray-700">{project.seller.bio}</p>
                          )}
                          <div className="mt-4">
                            <Link
                              href={`/sellers/${project.seller.id}`}
                              className="btn btn-outline px-4 py-2"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Purchase/Download */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="card p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ₹{project.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{project.licenseType} License</div>
                  </div>

                  <div className="space-y-4">
                    {user ? (
                      <>
                        <SecureDownload
                          projectId={project.id}
                          projectTitle={project.title}
                          className="btn btn-primary w-full py-3 text-lg"
                        />
                        <button className="btn btn-outline w-full py-3">
                          Add to Wishlist
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="btn btn-primary w-full py-3 text-lg text-center block"
                        >
                          Login to Download
                        </Link>
                        <Link
                          href="/auth/register"
                          className="btn btn-outline w-full py-3 text-center block"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Complete source code
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Documentation
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Installation guide
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {project.licenseType} license
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Future updates
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
                    <div className="space-y-4">
                      {relatedProjects.map((related) => (
                        <Link
                          key={related.id}
                          href={`/projects/${related.id}`}
                          className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 mb-1">{related.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{related.category}</span>
                            <span className="font-semibold text-blue-600">₹{related.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {renderStars(related.rating)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
