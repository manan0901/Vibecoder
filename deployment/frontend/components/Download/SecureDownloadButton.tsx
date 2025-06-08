'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';

interface SecureDownloadButtonProps {
  projectId: string;
  projectTitle: string;
  fileSize?: number;
  className?: string;
  children?: React.ReactNode;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: string) => void;
}

export default function SecureDownloadButton({
  projectId,
  projectTitle,
  fileSize,
  className = '',
  children,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}: SecureDownloadButtonProps) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState('');
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const checkPurchaseStatus = async (): Promise<boolean> => {
    if (!user) {
      setError('Please login to download files');
      return false;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/projects/${projectId}/purchase-status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to check purchase status');
      }

      return data.data.hasPurchased;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      setError(error instanceof Error ? error.message : 'Failed to check purchase status');
      return false;
    }
  };

  const createDownloadSession = async (): Promise<string | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/projects/${projectId}/session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create download session');
      }

      return data.data.token;
    } catch (error) {
      console.error('Error creating download session:', error);
      throw error;
    }
  };

  const downloadFile = async (downloadToken: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/file?token=${encodeURIComponent(downloadToken)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${projectTitle}.zip`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Handle download with progress tracking
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
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!user) {
      setError('Please login to download files');
      onDownloadError?.('Please login to download files');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setError('');
    onDownloadStart?.();

    try {
      // Check purchase status if not already checked
      if (hasPurchased === null) {
        const purchased = await checkPurchaseStatus();
        setHasPurchased(purchased);

        if (!purchased) {
          throw new Error('You must purchase this project before downloading');
        }
      }

      // Create download session
      const downloadToken = await createDownloadSession();

      if (!downloadToken) {
        throw new Error('Failed to create download session');
      }

      // Download file
      await downloadFile(downloadToken);

      // Reset after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        onDownloadComplete?.();
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setError(errorMessage);
      setIsDownloading(false);
      setDownloadProgress(0);
      onDownloadError?.(errorMessage);
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

      {/* Purchase Required Message */}
      {hasPurchased === false && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          Purchase required to download this project
        </div>
      )}
    </div>
  );
}
