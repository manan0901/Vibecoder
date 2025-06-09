import { Router } from 'express';
import {
  createDownloadToken,
  checkProjectPurchase,
  downloadProjectFile,
  getDownloadHistory,
  getDownloadAnalytics,
  validateDownloadToken,
  getDownloadSessionStatus,
  getAllDownloadSessions,
} from '../controllers/downloadController';
import { authenticate, adminOnly, sellerOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiLimiter, downloadLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// Public download endpoint (no authentication required, uses token)
router.get('/file', 
  downloadLimiter,
  validateRequest({
    query: z.object({
      token: z.string().min(1, 'Download token is required'),
    })
  }),
  downloadProjectFile
);

// All other download routes require authentication
router.use(authenticate);

// Create download session/token
router.post('/projects/:projectId/session', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  createDownloadToken
);

// Check purchase status for project
router.get('/projects/:projectId/purchase-status', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  checkProjectPurchase
);

// Validate download token
router.post('/validate-token', 
  apiLimiter,
  validateRequest({
    body: z.object({
      token: z.string().min(1, 'Download token is required'),
    })
  }),
  validateDownloadToken
);

// Get user download history
router.get('/history', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    })
  }),
  getDownloadHistory
);

// Get download session status
router.get('/sessions/:sessionId/status', 
  apiLimiter,
  validateRequest({
    params: z.object({
      sessionId: z.string().min(1, 'Session ID is required'),
    })
  }),
  getDownloadSessionStatus
);

// Get project download analytics (for project owners)
router.get('/projects/:projectId/analytics', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  getDownloadAnalytics
);

// Seller-specific routes
router.use('/seller', sellerOnly);

// Get seller's project download statistics
router.get('/seller/statistics', 
  apiLimiter,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // TODO: Implement actual seller download statistics
      const mockStats = {
        totalDownloads: 245,
        totalProjects: 8,
        averageDownloadsPerProject: 30.6,
        topPerformingProjects: [
          {
            id: 'project-1',
            title: 'React E-commerce Dashboard',
            downloads: 89,
            revenue: 266700, // 89 * 2999
          },
          {
            id: 'project-2',
            title: 'Vue.js Portfolio Template',
            downloads: 67,
            revenue: 133733, // 67 * 1999
          },
          {
            id: 'project-3',
            title: 'Node.js API Boilerplate',
            downloads: 45,
            revenue: 157455, // 45 * 3499
          },
        ],
        downloadsByMonth: [
          { month: 'Jan', downloads: 78 },
          { month: 'Feb', downloads: 92 },
          { month: 'Mar', downloads: 75 },
        ],
        downloadsByCountry: [
          { country: 'India', downloads: 156, percentage: 63.7 },
          { country: 'United States', downloads: 45, percentage: 18.4 },
          { country: 'United Kingdom', downloads: 23, percentage: 9.4 },
          { country: 'Canada', downloads: 21, percentage: 8.6 },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Seller download statistics retrieved successfully',
        data: { statistics: mockStats },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve seller statistics',
      });
    }
  }
);

// Admin-only routes
router.use('/admin', adminOnly);

// Get all download sessions (Admin only)
router.get('/admin/sessions', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.enum(['INITIATED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED']).optional(),
      projectId: z.string().optional(),
    })
  }),
  getAllDownloadSessions
);

// Get download analytics for all projects (Admin only)
router.get('/admin/analytics', 
  apiLimiter,
  async (req, res) => {
    try {
      // TODO: Implement actual admin download analytics
      const mockAnalytics = {
        totalDownloads: 12450,
        totalProjects: 156,
        totalUsers: 2340,
        averageDownloadsPerProject: 79.8,
        downloadGrowth: {
          daily: 15.2,
          weekly: 8.7,
          monthly: 23.4,
        },
        topProjects: [
          {
            id: 'project-1',
            title: 'React E-commerce Dashboard',
            downloads: 234,
            seller: 'John Doe',
            revenue: 701766,
          },
          {
            id: 'project-2',
            title: 'Vue.js Admin Panel',
            downloads: 189,
            seller: 'Jane Smith',
            revenue: 377811,
          },
          {
            id: 'project-3',
            title: 'Angular CRM System',
            downloads: 167,
            seller: 'Bob Wilson',
            revenue: 584833,
          },
        ],
        downloadsByCategory: [
          { category: 'Web Development', downloads: 4567, percentage: 36.7 },
          { category: 'Mobile Development', downloads: 3234, percentage: 26.0 },
          { category: 'Backend Development', downloads: 2890, percentage: 23.2 },
          { category: 'Frontend Development', downloads: 1759, percentage: 14.1 },
        ],
        downloadsByTimeOfDay: [
          { hour: '00', downloads: 234 },
          { hour: '06', downloads: 456 },
          { hour: '12', downloads: 789 },
          { hour: '18', downloads: 567 },
        ],
        downloadsByDevice: {
          desktop: 78.5,
          mobile: 15.2,
          tablet: 6.3,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Admin download analytics retrieved successfully',
        data: { analytics: mockAnalytics },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve admin analytics',
      });
    }
  }
);

// Export download data (Admin only)
router.get('/admin/export', 
  apiLimiter,
  validateRequest({
    query: z.object({
      format: z.enum(['csv', 'excel']).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      projectId: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      const { format = 'csv', startDate, endDate, projectId } = req.query;

      // TODO: Implement actual export functionality
      const mockCsvData = `Download ID,Project Title,User Name,Download Date,File Size,Status,IP Address
dl_1,React Dashboard,John Doe,2024-01-01 10:30:00,45MB,COMPLETED,192.168.1.1
dl_2,Vue Portfolio,Jane Smith,2024-01-01 14:15:00,23MB,COMPLETED,192.168.1.2
dl_3,Angular CRM,Bob Wilson,2024-01-02 09:45:00,67MB,FAILED,192.168.1.3`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=downloads_${Date.now()}.csv`);
      res.status(200).send(mockCsvData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to export download data',
      });
    }
  }
);

// Get download logs (Admin only)
router.get('/admin/logs', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      action: z.string().optional(),
      projectId: z.string().optional(),
      userId: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      const { page = '1', limit = '50', action, projectId, userId } = req.query;

      // TODO: Implement actual log retrieval
      const mockLogs = {
        logs: [
          {
            id: 'log-1',
            action: 'SESSION_CREATED',
            projectTitle: 'React Dashboard',
            userName: 'John Doe',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            timestamp: new Date().toISOString(),
            metadata: {
              access_type: 'PURCHASED',
              transaction_id: 'txn_123',
            },
          },
          {
            id: 'log-2',
            action: 'DOWNLOAD_STARTED',
            projectTitle: 'Vue Portfolio',
            userName: 'Jane Smith',
            ipAddress: '192.168.1.2',
            userAgent: 'Chrome/91.0...',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            metadata: {
              file_size: 23456789,
              download_count: 1,
            },
          },
        ],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: 2,
          totalPages: 1,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Download logs retrieved successfully',
        data: mockLogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve download logs',
      });
    }
  }
);

export default router;
