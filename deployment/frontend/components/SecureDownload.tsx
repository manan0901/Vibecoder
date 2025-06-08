'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth-context';

interface SecureDownloadProps {
  projectId: string;
  projectTitle: string;
  fileSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function SecureDownload({ 
  projectId, 
  projectTitle, 
  fileSize, 
  className = '',
  children 
}: SecureDownloadProps) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (!user) {
      setError('Please login to download files');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      
      // Create a fetch request with progress tracking
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/projects/${projectId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${projectTitle}.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Read the response as a blob with progress tracking
      const contentLength = response.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          const progress = (received / total) * 100;
          setDownloadProgress(Math.round(progress));
        }
      }

      // Create blob and download
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Download error:', error);
      setError(error instanceof Error ? error.message : 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`${className} ${
          isDownloading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {children || (
          <span className="flex items-center space-x-2">
            {isDownloading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Downloading... {downloadProgress}%</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <span>Download</span>
                {fileSize && (
                  <span className="text-sm opacity-75">({formatFileSize(fileSize)})</span>
                )}
              </>
            )}
          </span>
        )}
      </button>

      {/* Progress Bar */}
      {isDownloading && downloadProgress > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {downloadProgress}% complete
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

// Hook for programmatic downloads
export const useSecureDownload = () => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const downloadFile = async (projectId: string, projectTitle: string) => {
    if (!user) {
      setError('Please login to download files');
      return false;
    }

    setIsDownloading(true);
    setProgress(0);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/projects/${projectId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Handle the download similar to the component
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${projectTitle}.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error instanceof Error ? error.message : 'Download failed');
      setIsDownloading(false);
      setProgress(0);
      return false;
    }
  };

  return {
    downloadFile,
    isDownloading,
    progress,
    error,
    clearError: () => setError(''),
  };
};
