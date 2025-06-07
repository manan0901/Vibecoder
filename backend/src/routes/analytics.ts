import { Router } from 'express';
import {
  getSellerAnalyticsData,
  getProjectAnalyticsData,
  getPlatformAnalyticsData,
  exportAnalytics,
  getSellerDashboardSummary,
  getAnalyticsComparison,
} from '../controllers/analyticsController';
import { authenticate, sellerOnly, adminOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiLimiter } from '../middleware/rateLimiter';
import { analyticsCache } from '../middleware/cache';
import { z } from 'zod';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Seller analytics routes
router.get('/seller/dashboard-summary',
  apiLimiter,
  analyticsCache,
  sellerOnly,
  getSellerDashboardSummary
);

router.get('/seller/:sellerId?',
  apiLimiter,
  analyticsCache,
  validateRequest({
    params: z.object({
      sellerId: z.string().optional(),
    }),
    query: z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    })
  }),
  getSellerAnalyticsData
);

// Project analytics routes
router.get('/projects/:projectId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    }),
    query: z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    })
  }),
  getProjectAnalyticsData
);

// Analytics comparison
router.get('/projects/compare', 
  apiLimiter,
  validateRequest({
    query: z.object({
      projectIds: z.string().min(1, 'Project IDs are required'),
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    })
  }),
  getAnalyticsComparison
);

// Platform analytics (admin only)
router.get('/platform', 
  apiLimiter,
  adminOnly,
  validateRequest({
    query: z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    })
  }),
  getPlatformAnalyticsData
);

// Export analytics data
router.get('/export/:type/:id?', 
  apiLimiter,
  validateRequest({
    params: z.object({
      type: z.enum(['seller', 'project', 'platform']),
      id: z.string().optional(),
    }),
    query: z.object({
      format: z.enum(['csv', 'excel']).optional(),
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    })
  }),
  exportAnalytics
);

// Advanced analytics routes for sellers
router.get('/seller/:sellerId/revenue-breakdown', 
  apiLimiter,
  validateRequest({
    params: z.object({
      sellerId: z.string().optional(),
    }),
    query: z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
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

      const sellerId = req.params.sellerId || req.user.id;

      // Check permissions
      if (req.user.role !== 'ADMIN' && sellerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'You can only access your own revenue breakdown',
        });
      }

      // Mock revenue breakdown data
      const revenueBreakdown = {
        overview: {
          totalRevenue: 467400,
          netRevenue: 420660,
          platformCommission: 46740,
          refunds: 5988,
          taxes: 0,
        },
        monthlyBreakdown: [
          {
            month: 'Jan 2024',
            grossRevenue: 45600,
            platformCommission: 4560,
            netRevenue: 41040,
            refunds: 0,
            transactions: 23,
          },
          {
            month: 'Feb 2024',
            grossRevenue: 67800,
            platformCommission: 6780,
            netRevenue: 61020,
            refunds: 1999,
            transactions: 34,
          },
          {
            month: 'Mar 2024',
            grossRevenue: 89400,
            platformCommission: 8940,
            netRevenue: 80460,
            refunds: 2999,
            transactions: 45,
          },
          {
            month: 'Apr 2024',
            grossRevenue: 78900,
            platformCommission: 7890,
            netRevenue: 71010,
            refunds: 990,
            transactions: 39,
          },
        ],
        paymentMethods: [
          { method: 'UPI', revenue: 234560, percentage: 50.2 },
          { method: 'Credit Card', revenue: 156780, percentage: 33.5 },
          { method: 'Debit Card', revenue: 67890, percentage: 14.5 },
          { method: 'Net Banking', revenue: 8170, percentage: 1.8 },
        ],
        topProjects: [
          {
            id: 'project-1',
            title: 'React Dashboard',
            revenue: 156780,
            percentage: 33.5,
            transactions: 78,
          },
          {
            id: 'project-2',
            title: 'Vue Portfolio',
            revenue: 123450,
            percentage: 26.4,
            transactions: 62,
          },
          {
            id: 'project-3',
            title: 'Angular CRM',
            revenue: 98760,
            percentage: 21.1,
            transactions: 49,
          },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Revenue breakdown retrieved successfully',
        data: { revenueBreakdown },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve revenue breakdown',
      });
    }
  }
);

// Customer analytics for sellers
router.get('/seller/:sellerId/customers', 
  apiLimiter,
  validateRequest({
    params: z.object({
      sellerId: z.string().optional(),
    }),
    query: z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional(),
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

      const sellerId = req.params.sellerId || req.user.id;

      // Check permissions
      if (req.user.role !== 'ADMIN' && sellerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'You can only access your own customer analytics',
        });
      }

      // Mock customer analytics data
      const customerAnalytics = {
        overview: {
          totalCustomers: 234,
          newCustomers: 45,
          returningCustomers: 23,
          customerRetentionRate: 18.5,
          averageOrderValue: 2847,
          customerLifetimeValue: 5694,
        },
        customerSegments: [
          {
            segment: 'High Value',
            customers: 23,
            percentage: 9.8,
            averageSpend: 8500,
            description: 'Customers who spend >₹5000',
          },
          {
            segment: 'Regular',
            customers: 156,
            percentage: 66.7,
            averageSpend: 2500,
            description: 'Customers who spend ₹1000-₹5000',
          },
          {
            segment: 'Occasional',
            customers: 55,
            percentage: 23.5,
            averageSpend: 1200,
            description: 'Customers who spend <₹1000',
          },
        ],
        geographicDistribution: [
          { country: 'India', customers: 156, percentage: 66.7, revenue: 234560 },
          { country: 'United States', customers: 34, percentage: 14.5, revenue: 89750 },
          { country: 'United Kingdom', customers: 23, percentage: 9.8, revenue: 67890 },
          { country: 'Canada', customers: 21, percentage: 9.0, revenue: 56780 },
        ],
        purchaseBehavior: {
          averageTimeBetweenPurchases: 45, // days
          mostPopularPurchaseTime: '2:00 PM - 4:00 PM',
          preferredPaymentMethod: 'UPI',
          averageProjectsPerCustomer: 2.3,
        },
        topCustomers: [
          {
            id: 'customer-1',
            name: 'John D.',
            totalSpent: 15600,
            projectsPurchased: 8,
            lastPurchase: '2024-04-15',
            segment: 'High Value',
          },
          {
            id: 'customer-2',
            name: 'Sarah M.',
            totalSpent: 12400,
            projectsPurchased: 6,
            lastPurchase: '2024-04-12',
            segment: 'High Value',
          },
          {
            id: 'customer-3',
            name: 'Mike R.',
            totalSpent: 9800,
            projectsPurchased: 5,
            lastPurchase: '2024-04-10',
            segment: 'High Value',
          },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Customer analytics retrieved successfully',
        data: { customerAnalytics },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customer analytics',
      });
    }
  }
);

// Performance insights for sellers
router.get('/seller/:sellerId/insights', 
  apiLimiter,
  validateRequest({
    params: z.object({
      sellerId: z.string().optional(),
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

      const sellerId = req.params.sellerId || req.user.id;

      // Check permissions
      if (req.user.role !== 'ADMIN' && sellerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'You can only access your own insights',
        });
      }

      // Mock performance insights
      const insights = {
        recommendations: [
          {
            type: 'OPTIMIZATION',
            priority: 'HIGH',
            title: 'Improve Project Descriptions',
            description: 'Projects with detailed descriptions have 35% higher conversion rates',
            action: 'Add more screenshots and detailed feature lists to your projects',
            potentialImpact: '+25% sales',
          },
          {
            type: 'PRICING',
            priority: 'MEDIUM',
            title: 'Consider Price Adjustment',
            description: 'Your React Dashboard is priced 15% below market average',
            action: 'Consider increasing price to ₹3,499 based on market analysis',
            potentialImpact: '+18% revenue',
          },
          {
            type: 'MARKETING',
            priority: 'MEDIUM',
            title: 'Leverage Social Media',
            description: 'Only 12% of your traffic comes from social media',
            action: 'Share your projects on LinkedIn and Twitter for better visibility',
            potentialImpact: '+30% views',
          },
          {
            type: 'CONTENT',
            priority: 'LOW',
            title: 'Add Video Demos',
            description: 'Projects with video demos have 45% higher engagement',
            action: 'Create short demo videos for your top-performing projects',
            potentialImpact: '+40% engagement',
          },
        ],
        marketTrends: [
          {
            trend: 'React Projects in High Demand',
            description: 'React-based projects have seen 28% growth this quarter',
            relevance: 'HIGH',
            suggestion: 'Consider creating more React-based templates',
          },
          {
            trend: 'Mobile-First Design Trending',
            description: 'Mobile-responsive projects are selling 40% better',
            relevance: 'MEDIUM',
            suggestion: 'Ensure all your projects are mobile-optimized',
          },
          {
            trend: 'AI Integration Popular',
            description: 'Projects with AI features are commanding premium prices',
            relevance: 'MEDIUM',
            suggestion: 'Consider adding AI-powered features to your projects',
          },
        ],
        competitorAnalysis: {
          yourPosition: 'Top 15%',
          averageRating: 4.3,
          marketAverageRating: 3.8,
          priceCompetitiveness: 'Competitive',
          strengthAreas: ['Code Quality', 'Documentation', 'Customer Support'],
          improvementAreas: ['Marketing', 'Project Variety', 'Update Frequency'],
        },
        growthOpportunities: [
          {
            opportunity: 'Enterprise Templates',
            description: 'Large-scale enterprise templates are underserved',
            marketSize: 'Large',
            difficulty: 'High',
            timeToMarket: '2-3 months',
          },
          {
            opportunity: 'Tutorial Content',
            description: 'Bundling tutorials with projects increases value',
            marketSize: 'Medium',
            difficulty: 'Medium',
            timeToMarket: '1 month',
          },
          {
            opportunity: 'Niche Industries',
            description: 'Healthcare and fintech templates have less competition',
            marketSize: 'Medium',
            difficulty: 'Medium',
            timeToMarket: '1-2 months',
          },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Performance insights retrieved successfully',
        data: { insights },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve performance insights',
      });
    }
  }
);

export default router;
