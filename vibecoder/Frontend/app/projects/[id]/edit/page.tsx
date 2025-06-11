'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  techStack: string[];
  tags: string[];
  price: number;
  licenseType: string;
  demoUrl?: string;
  githubUrl?: string;
  status: string;
  screenshots: string[];
  mainFile?: string;
}

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);
  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProject(data.data.project);
      } else {
        setErrors({ general: 'Project not found' });
      }
    } catch (error) {
      setErrors({ general: 'Failed to load project' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      setErrors({ file: 'File size must be less than 500MB' });
      return;
    }

    // Validate file type
    const allowedTypes = ['.zip', '.rar', '.7z', '.tar.gz'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.some(type => fileExtension.includes(type.replace('.', '')))) {
      setErrors({ file: 'Only ZIP, RAR, 7Z, and TAR.GZ files are allowed' });
      return;
    }

    setUploadingFile(true);
    setErrors({ ...errors, file: '' });

    try {
      const formData = new FormData();
      formData.append('projectFile', file);      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update project state
        setProject(prev => prev ? { ...prev, mainFile: data.data.filename } : null);
      } else {
        setErrors({ file: data.error || 'File upload failed' });
      }
    } catch (error) {
      setErrors({ file: 'File upload failed' });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate number of files (max 5)
    if (files.length > 5) {
      setErrors({ screenshots: 'Maximum 5 screenshots allowed' });
      return;
    }

    // Validate file types and sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Max 5MB per image
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ screenshots: 'Each screenshot must be less than 5MB' });
        return;
      }

      // Only images
      if (!file.type.startsWith('image/')) {
        setErrors({ screenshots: 'Only image files are allowed for screenshots' });
        return;
      }
    }

    setUploadingScreenshots(true);
    setErrors({ ...errors, screenshots: '' });

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('screenshots', files[i]);
      }      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/upload-screenshots`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update project state
        const newScreenshots = data.data.files.map((file: any) => file.filename);
        setProject(prev => prev ? { 
          ...prev, 
          screenshots: [...(prev.screenshots || []), ...newScreenshots] 
        } : null);
      } else {
        setErrors({ screenshots: data.error || 'Screenshot upload failed' });
      }
    } catch (error) {
      setErrors({ screenshots: 'Screenshot upload failed' });
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!project?.mainFile) {
      setErrors({ general: 'Please upload the project file before submitting for review' });
      return;
    }

    if (!project?.screenshots || project.screenshots.length === 0) {
      setErrors({ general: 'Please upload at least one screenshot before submitting for review' });
      return;
    }    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard?message=Project submitted for review');
      } else {
        setErrors({ general: data.error || 'Submission failed' });
      }
    } catch (error) {
      setErrors({ general: 'Submission failed' });
    }
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
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
              <span className="text-gray-700">Welcome, {user?.firstName}!</span>
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
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="mt-2 text-gray-600">
              Upload files and screenshots for your project
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                project.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                project.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          {/* Project File Upload */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Project File</h2>
            <p className="text-gray-600 mb-4">
              Upload your project as a ZIP, RAR, 7Z, or TAR.GZ file (max 500MB)
            </p>
            
            {project.mainFile ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-600 text-2xl mr-3">📁</span>
                  <div>
                    <p className="font-medium text-green-800">File uploaded successfully!</p>
                    <p className="text-sm text-green-600">{project.mainFile}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".zip,.rar,.7z,.tar.gz"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingFile && (
                  <div className="mt-2 text-blue-600">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
                    Uploading...
                  </div>
                )}
                {errors.file && (
                  <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                )}
              </div>
            )}
          </div>

          {/* Screenshots Upload */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
            <p className="text-gray-600 mb-4">
              Upload up to 5 screenshots of your project (max 5MB each)
            </p>
            
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Uploaded Screenshots:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Screenshot {index + 1}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{screenshot}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotUpload}
                disabled={uploadingScreenshots}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {uploadingScreenshots && (
                <div className="mt-2 text-green-600">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full mr-2"></span>
                  Uploading screenshots...
                </div>
              )}
              {errors.screenshots && (
                <p className="mt-2 text-sm text-red-600">{errors.screenshots}</p>
              )}
            </div>
          </div>

          {/* Project Preview */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Project Preview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <p className="text-gray-600">{project.shortDescription}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-900">₹{project.price.toLocaleString()}</span>
                <span className="text-sm text-blue-600">{project.category}</span>
                <span className="text-sm text-gray-500">{project.licenseType} License</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-outline px-6 py-3"
            >
              Save as Draft
            </button>
            
            {project.status === 'DRAFT' && (
              <button
                onClick={handleSubmitForReview}
                disabled={!project.mainFile || !project.screenshots?.length}
                className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
