import { Router } from 'express';
import {
  uploadProjectFile,
  uploadProjectScreenshots,
  downloadProjectFile,
  getFileInfo,
  deleteProjectFile,
} from '../controllers/fileController';
import { authenticate, sellerOnly } from '../middleware/auth';
import { validateRequest, commonSchemas } from '../middleware/validation';
import { 
  uploadProjectFileMiddleware, 
  uploadProjectScreenshotsMiddleware, 
  handleUploadError 
} from '../middleware/upload';
import {
  apiLimiter,
  uploadLimiter
} from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// All file routes require authentication
router.use(authenticate);

// Upload project file
router.post('/projects/:projectId/upload',
  uploadLimiter,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  uploadProjectFileMiddleware,
  handleUploadError,
  uploadProjectFile
);

// Upload project screenshots
router.post('/projects/:projectId/screenshots',
  uploadLimiter,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  uploadProjectScreenshotsMiddleware,
  handleUploadError,
  uploadProjectScreenshots
);

// Download project file
router.get('/projects/:projectId/download',
  apiLimiter,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  downloadProjectFile
);

// Get file information
router.get('/projects/:projectId/info',
  apiLimiter,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getFileInfo
);

// Delete project file
router.delete('/projects/:projectId/delete',
  apiLimiter,
  validateRequest({
    params: z.object({ projectId: z.string() }),
    body: z.object({
      fileType: z.enum(['main', 'screenshot']),
      filename: z.string().optional(),
    })
  }),
  deleteProjectFile
);

// Get storage usage for user
router.get('/storage/usage', 
  apiLimiter,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // TODO: Calculate actual storage usage from database
      // For now, return mock data
      const storageUsage = {
        used: 1024 * 1024 * 150, // 150MB
        limit: 1024 * 1024 * 1024 * 5, // 5GB
        projects: 3,
        files: 8,
      };

      const usagePercentage = (storageUsage.used / storageUsage.limit) * 100;

      res.status(200).json({
        success: true,
        message: 'Storage usage retrieved successfully',
        data: {
          usage: storageUsage,
          percentage: Math.round(usagePercentage * 100) / 100,
          formatted: {
            used: formatFileSize(storageUsage.used),
            limit: formatFileSize(storageUsage.limit),
            available: formatFileSize(storageUsage.limit - storageUsage.used),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve storage usage',
      });
    }
  }
);

// Get file management dashboard data
router.get('/dashboard', 
  apiLimiter,
  sellerOnly,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // TODO: Get actual data from database
      // For now, return mock data
      const dashboardData = {
        totalFiles: 12,
        totalSize: 1024 * 1024 * 250, // 250MB
        projectFiles: 3,
        screenshots: 9,
        recentUploads: [
          {
            id: '1',
            filename: 'react-dashboard.zip',
            projectTitle: 'React E-commerce Dashboard',
            uploadedAt: new Date().toISOString(),
            size: 1024 * 1024 * 45, // 45MB
            type: 'project',
          },
          {
            id: '2',
            filename: 'screenshot-1.png',
            projectTitle: 'Mobile Task Manager',
            uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            size: 1024 * 512, // 512KB
            type: 'screenshot',
          },
        ],
        storageBreakdown: {
          projects: 1024 * 1024 * 200, // 200MB
          screenshots: 1024 * 1024 * 30, // 30MB
          documents: 1024 * 1024 * 20, // 20MB
        },
      };

      res.status(200).json({
        success: true,
        message: 'File management dashboard data retrieved successfully',
        data: { dashboard: dashboardData },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve dashboard data',
      });
    }
  }
);

// Bulk file operations
router.post('/bulk/delete', 
  apiLimiter,
  validateRequest({
    body: z.object({
      files: z.array(z.object({
        projectId: z.string(),
        fileType: z.enum(['main', 'screenshot']),
        filename: z.string().optional(),
      })),
    })
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const { files } = req.body;
      const results = [];

      for (const file of files) {
        try {
          // TODO: Implement actual bulk delete logic
          // For now, just simulate success
          results.push({
            projectId: file.projectId,
            fileType: file.fileType,
            filename: file.filename,
            success: true,
          });
        } catch (error) {
          results.push({
            projectId: file.projectId,
            fileType: file.fileType,
            filename: file.filename,
            success: false,
            error: 'Failed to delete file',
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      res.status(200).json({
        success: true,
        message: `Bulk delete completed: ${successCount} successful, ${failureCount} failed`,
        data: { results },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Bulk delete operation failed',
      });
    }
  }
);

// File integrity check
router.post('/integrity/check', 
  apiLimiter,
  validateRequest({
    body: z.object({
      projectId: z.string(),
    })
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const { projectId } = req.body;

      // TODO: Implement actual file integrity check
      // This would verify file checksums, existence, etc.
      const integrityCheck = {
        projectId,
        mainFile: {
          exists: true,
          checksum: 'abc123def456',
          size: 1024 * 1024 * 45,
          lastModified: new Date().toISOString(),
        },
        screenshots: [
          {
            filename: 'screenshot-1.png',
            exists: true,
            checksum: 'def456ghi789',
            size: 1024 * 512,
          },
        ],
        status: 'healthy',
        issues: [],
      };

      res.status(200).json({
        success: true,
        message: 'File integrity check completed',
        data: { integrity: integrityCheck },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'File integrity check failed',
      });
    }
  }
);

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default router;
