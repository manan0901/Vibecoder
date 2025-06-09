import { Router } from 'express';
import {
  getDashboardOverview,
  getPlatformStats,
  getUserAnalyticsData,
  getRevenueAnalyticsData,
  getAllUsers,
  getUserDetails,
  updateUser,
  getSystemHealthData,
  getRecentActivitiesData,
  deleteUser,
  getModerationQueueData,
  getProjectModerationDetails,
  moderateProjectAction,
  getModerationStats,
  analyzeProjectContentData,
  getModerationLogsData,
} from '../controllers/adminController';
import { authenticate, adminOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// Dashboard overview
router.get('/dashboard/overview', 
  apiLimiter,
  getDashboardOverview
);

// Platform statistics
router.get('/statistics/platform', 
  apiLimiter,
  getPlatformStats
);

// User analytics
router.get('/analytics/users', 
  apiLimiter,
  getUserAnalyticsData
);

// Revenue analytics
router.get('/analytics/revenue', 
  apiLimiter,
  getRevenueAnalyticsData
);

// System health
router.get('/system/health', 
  apiLimiter,
  getSystemHealthData
);

// Recent activities
router.get('/activities/recent', 
  apiLimiter,
  validateRequest({
    query: z.object({
      limit: z.string().optional(),
    })
  }),
  getRecentActivitiesData
);

// User management routes
router.get('/users', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional(),
      search: z.string().optional(),
      status: z.string().optional(),
    })
  }),
  getAllUsers
);

router.get('/users/:userId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      userId: z.string().min(1, 'User ID is required'),
    })
  }),
  getUserDetails
);

router.patch('/users/:userId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      userId: z.string().min(1, 'User ID is required'),
    }),
    body: z.object({
      role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional(),
      isVerified: z.boolean().optional(),
    })
  }),
  updateUser
);

router.delete('/users/:userId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      userId: z.string().min(1, 'User ID is required'),
    })
  }),
  deleteUser
);

// Moderation routes
router.get('/moderation/queue',
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
      category: z.string().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      search: z.string().optional(),
    })
  }),
  getModerationQueueData
);

router.get('/moderation/projects/:projectId',
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  getProjectModerationDetails
);

router.post('/moderation/projects/:projectId/moderate',
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    }),
    body: z.object({
      action: z.enum(['APPROVE', 'REJECT', 'REQUEST_CHANGES', 'FLAG', 'UNFLAG']),
      reason: z.enum([
        'INAPPROPRIATE_CONTENT',
        'COPYRIGHT_VIOLATION',
        'POOR_QUALITY',
        'INCOMPLETE_PROJECT',
        'MISLEADING_DESCRIPTION',
        'TECHNICAL_ISSUES',
        'PRICING_ISSUES',
        'OTHER'
      ]).optional(),
      notes: z.string().optional(),
    })
  }),
  moderateProjectAction
);

router.get('/moderation/statistics',
  apiLimiter,
  getModerationStats
);

router.get('/moderation/projects/:projectId/analyze',
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  analyzeProjectContentData
);

router.get('/moderation/logs',
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      projectId: z.string().optional(),
      moderatorId: z.string().optional(),
      action: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  }),
  getModerationLogsData
);

// Project management routes
router.get('/projects', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
      category: z.string().optional(),
      search: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      // TODO: Implement actual project management
      const mockProjects = {
        projects: [
          {
            id: 'project-1',
            title: 'React E-commerce Dashboard',
            category: 'Web Development',
            status: 'PENDING',
            price: 2999,
            seller: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
            createdAt: new Date().toISOString(),
            downloadCount: 0,
          },
          {
            id: 'project-2',
            title: 'Vue.js Portfolio Template',
            category: 'Frontend Development',
            status: 'APPROVED',
            price: 1999,
            seller: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            downloadCount: 45,
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Admin projects retrieved successfully',
        data: mockProjects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve admin projects',
      });
    }
  }
);

router.get('/projects/:projectId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  async (req, res) => {
    try {
      const { projectId } = req.params;

      // TODO: Implement actual project details retrieval
      const mockProject = {
        id: projectId,
        title: 'React E-commerce Dashboard',
        shortDescription: 'Modern admin dashboard with analytics',
        description: 'A comprehensive e-commerce admin dashboard built with React and TypeScript...',
        category: 'Web Development',
        techStack: ['React', 'TypeScript', 'Material-UI'],
        tags: ['dashboard', 'ecommerce', 'admin'],
        price: 2999,
        licenseType: 'SINGLE',
        status: 'PENDING',
        seller: {
          id: 'seller-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isVerified: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadCount: 0,
        viewCount: 25,
        rating: 0,
        reviewCount: 0,
        moderationNotes: [],
      };

      res.status(200).json({
        success: true,
        message: 'Project details retrieved successfully',
        data: { project: mockProject },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve project details',
      });
    }
  }
);

// Project moderation actions
router.patch('/projects/:projectId/status', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    }),
    body: z.object({
      status: z.enum(['APPROVED', 'REJECTED']),
      moderationNotes: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const { status, moderationNotes } = req.body;

      // TODO: Implement actual project status update
      const updatedProject = {
        id: projectId,
        status,
        moderationNotes,
        moderatedBy: req.user?.id,
        moderatedAt: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        message: `Project ${status.toLowerCase()} successfully`,
        data: { project: updatedProject },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update project status',
      });
    }
  }
);

// Transaction management routes
router.get('/transactions', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']).optional(),
      type: z.enum(['PURCHASE', 'REFUND', 'COMMISSION']).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      // TODO: Implement actual transaction management
      const mockTransactions = {
        transactions: [
          {
            id: 'txn-1',
            amount: 2999,
            status: 'COMPLETED',
            type: 'PURCHASE',
            project: {
              id: 'project-1',
              title: 'React Dashboard',
            },
            buyer: {
              firstName: 'Alice',
              lastName: 'Johnson',
              email: 'alice@example.com',
            },
            seller: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Admin transactions retrieved successfully',
        data: mockTransactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve admin transactions',
      });
    }
  }
);

// Export data routes
router.get('/export/users', 
  apiLimiter,
  validateRequest({
    query: z.object({
      format: z.enum(['csv', 'excel']).optional(),
      role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional(),
    })
  }),
  async (req, res) => {
    try {
      const { format = 'csv' } = req.query;

      // TODO: Implement actual user export
      const csvData = `ID,Name,Email,Role,Verified,Created At
user-1,John Doe,john@example.com,SELLER,true,2024-01-01
user-2,Jane Smith,jane@example.com,BUYER,true,2024-01-02`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.csv`);
      res.status(200).send(csvData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to export user data',
      });
    }
  }
);

router.get('/export/projects', 
  apiLimiter,
  validateRequest({
    query: z.object({
      format: z.enum(['csv', 'excel']).optional(),
      status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
    })
  }),
  async (req, res) => {
    try {
      const { format = 'csv' } = req.query;

      // TODO: Implement actual project export
      const csvData = `ID,Title,Category,Status,Price,Seller,Created At
project-1,React Dashboard,Web Development,APPROVED,2999,John Doe,2024-01-01
project-2,Vue Portfolio,Frontend Development,PENDING,1999,Jane Smith,2024-01-02`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=projects_${Date.now()}.csv`);
      res.status(200).send(csvData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to export project data',
      });
    }
  }
);

export default router;
