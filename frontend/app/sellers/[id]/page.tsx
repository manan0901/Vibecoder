'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  _count: {
    projects: number;
  };
}

interface SellerProject {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  category: string;
  techStack: string[];
  createdAt: string;
}

export default function SellerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [projects, setProjects] = useState<SellerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    fetchSellerProfile();
  }, [params.id]);

  const fetchSellerProfile = async () => {
    try {
      // Fetch seller profile
      const sellerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`);
      const sellerData = await sellerResponse.json();

      if (sellerData.success) {
        setSeller(sellerData.data.user);
      } else {
        setError('Seller not found');
        return;
      }

      // Fetch seller's projects
      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?sellerId=${params.id}`);
      const projectsData = await projectsResponse.json();

      if (projectsData.success) {
        setProjects(projectsData.data.projects);
      }

    } catch (error) {
      setError('Failed to load seller profile');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const calculateAverageRating = () => {
    if (projects.length === 0) return 0;
    const totalRating = projects.reduce((sum, project) => sum + project.rating, 0);
    return (totalRating / projects.length).toFixed(1);
  };

  const getTotalDownloads = () => {
    return projects.reduce((sum, project) => sum + project.downloadCount, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h1>
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
              <Link href="/projects" className="text-gray-700 hover:text-gray-900">
                Browse Projects
              </Link>
              <Link href="/auth/login" className="btn btn-outline px-4 py-2">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary px-4 py-2">
                Sign Up
              </Link>
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
                <span className="text-gray-900 font-medium">
                  {seller.firstName} {seller.lastName}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Seller Header */}
          <div className="card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {seller.avatar ? (
                  <img 
                    src={seller.avatar} 
                    alt="Seller" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-600">
                    {seller.firstName[0]}{seller.lastName[0]}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {seller.firstName} {seller.lastName}
                  </h1>
                  {seller.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Verified Seller
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  Member since {formatDate(seller.createdAt)}
                </p>
                
                {seller.bio && (
                  <p className="text-gray-700 mb-4">{seller.bio}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{seller._count.projects}</div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{getTotalDownloads()}</div>
                    <div className="text-sm text-gray-500">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{calculateAverageRating()}</div>
                    <div className="text-sm text-gray-500">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {projects.reduce((sum, p) => sum + p.reviewCount, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { id: 'projects', label: `Projects (${projects.length})` },
                  { id: 'about', label: 'About' },
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
              {activeTab === 'projects' && (
                <div>
                  {projects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-gray-500">Project Preview</span>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-600 font-medium">{project.category}</span>
                              <span className="text-lg font-bold text-gray-900">₹{project.price.toLocaleString()}</span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{project.shortDescription}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.techStack.slice(0, 3).map(tech => (
                                <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <div className="flex items-center">
                                {renderStars(project.rating)}
                                <span className="ml-1">({project.reviewCount})</span>
                              </div>
                              <span>{project.downloadCount} downloads</span>
                            </div>
                            
                            <Link 
                              href={`/projects/${project.id}`}
                              className="btn btn-primary w-full py-2 text-sm text-center"
                            >
                              View Project
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                      <p className="text-gray-500">This seller hasn't published any projects yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'about' && (
                <div>
                  <div className="max-w-3xl">
                    <h3 className="text-lg font-semibold mb-4">About {seller.firstName}</h3>
                    
                    {seller.bio ? (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{seller.bio}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">This seller hasn't added a bio yet.</p>
                    )}
                    
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h4 className="font-semibold mb-4">Seller Stats</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Experience</h5>
                          <p className="text-gray-600">
                            Member since {formatDate(seller.createdAt)}
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Specialization</h5>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(projects.flatMap(p => p.techStack))).slice(0, 6).map(tech => (
                              <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
