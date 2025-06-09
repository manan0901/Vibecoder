import { Router } from 'express';
import {
  createProjectReview,
  getReviewsForProject,
  getProjectReviewStats,
  addSellerResponseToReview,
  markAsHelpful,
  reportReviewForModeration,
  getMyReviews,
  checkReviewEligibility,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { authenticate, sellerOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiLimiter } from '../middleware/rateLimiter';
import { reviewsCache } from '../middleware/cache';
import { z } from 'zod';

const router = Router();

// Public routes (no authentication required)

// Get reviews for a project
router.get('/projects/:projectId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    }),
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sortBy: z.enum(['newest', 'oldest', 'rating_high', 'rating_low', 'helpful']).optional(),
    })
  }),
  getReviewsForProject
);

// Get review statistics for a project
router.get('/projects/:projectId/statistics', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  getProjectReviewStats
);

// Protected routes (authentication required)
router.use(authenticate);

// Check if user can review a project
router.get('/projects/:projectId/eligibility', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    })
  }),
  checkReviewEligibility
);

// Create a review for a project
router.post('/projects/:projectId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
    }),
    body: z.object({
      rating: z.number().min(1).max(5),
      title: z.string().max(100).optional(),
      comment: z.string().max(1000).optional(),
    })
  }),
  createProjectReview
);

// Get user's own reviews
router.get('/my-reviews', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    })
  }),
  getMyReviews
);

// Update a review
router.patch('/:reviewId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      reviewId: z.string().min(1, 'Review ID is required'),
    }),
    body: z.object({
      rating: z.number().min(1).max(5).optional(),
      title: z.string().max(100).optional(),
      comment: z.string().max(1000).optional(),
    })
  }),
  updateReview
);

// Delete a review
router.delete('/:reviewId', 
  apiLimiter,
  validateRequest({
    params: z.object({
      reviewId: z.string().min(1, 'Review ID is required'),
    })
  }),
  deleteReview
);

// Mark a review as helpful
router.post('/:reviewId/helpful', 
  apiLimiter,
  validateRequest({
    params: z.object({
      reviewId: z.string().min(1, 'Review ID is required'),
    })
  }),
  markAsHelpful
);

// Report a review for moderation
router.post('/:reviewId/report', 
  apiLimiter,
  validateRequest({
    params: z.object({
      reviewId: z.string().min(1, 'Review ID is required'),
    }),
    body: z.object({
      reason: z.string().min(1, 'Report reason is required').max(500),
    })
  }),
  reportReviewForModeration
);

// Seller-specific routes
router.use('/seller', sellerOnly);

// Add seller response to a review
router.post('/seller/:reviewId/response', 
  apiLimiter,
  validateRequest({
    params: z.object({
      reviewId: z.string().min(1, 'Review ID is required'),
    }),
    body: z.object({
      response: z.string().min(1, 'Response is required').max(1000),
    })
  }),
  addSellerResponseToReview
);

// Get reviews for seller's projects
router.get('/seller/my-project-reviews', 
  apiLimiter,
  validateRequest({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      projectId: z.string().optional(),
      rating: z.string().optional(),
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

      const { page = '1', limit = '20', projectId, rating } = req.query;

      // TODO: Implement actual seller review retrieval
      const mockReviews = {
        reviews: [
          {
            id: 'review-1',
            projectId: 'project-1',
            projectTitle: 'React E-commerce Dashboard',
            rating: 5,
            title: 'Excellent project!',
            comment: 'Very well structured code and great documentation.',
            buyer: {
              firstName: 'John',
              lastName: 'Doe',
            },
            isVerified: true,
            sellerResponse: 'Thank you for the positive feedback!',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'review-2',
            projectId: 'project-2',
            projectTitle: 'Vue.js Portfolio Template',
            rating: 4,
            title: 'Good quality',
            comment: 'Nice design but could use more customization options.',
            buyer: {
              firstName: 'Jane',
              lastName: 'Smith',
            },
            isVerified: true,
            sellerResponse: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: 2,
          totalPages: 1,
        },
        statistics: {
          totalReviews: 2,
          averageRating: 4.5,
          ratingDistribution: {
            5: 1,
            4: 1,
            3: 0,
            2: 0,
            1: 0,
          },
        },
      };

      res.status(200).json({
        success: true,
        message: 'Seller project reviews retrieved successfully',
        data: mockReviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve seller project reviews',
      });
    }
  }
);

// Get seller review analytics
router.get('/seller/analytics', 
  apiLimiter,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // TODO: Implement actual seller review analytics
      const mockAnalytics = {
        overview: {
          totalReviews: 45,
          averageRating: 4.3,
          responseRate: 78.5, // Percentage of reviews with seller response
          helpfulVotes: 156,
        },
        ratingTrend: [
          { month: 'Jan', averageRating: 4.1, reviewCount: 8 },
          { month: 'Feb', averageRating: 4.2, reviewCount: 12 },
          { month: 'Mar', averageRating: 4.3, reviewCount: 15 },
          { month: 'Apr', averageRating: 4.4, reviewCount: 10 },
        ],
        projectPerformance: [
          {
            projectId: 'project-1',
            projectTitle: 'React Dashboard',
            reviewCount: 18,
            averageRating: 4.6,
            responseRate: 85,
          },
          {
            projectId: 'project-2',
            projectTitle: 'Vue Portfolio',
            reviewCount: 15,
            averageRating: 4.2,
            responseRate: 70,
          },
          {
            projectId: 'project-3',
            projectTitle: 'Angular CRM',
            reviewCount: 12,
            averageRating: 4.1,
            responseRate: 80,
          },
        ],
        recentReviews: [
          {
            id: 'review-recent-1',
            projectTitle: 'React Dashboard',
            rating: 5,
            comment: 'Amazing work! Highly recommended.',
            buyerName: 'Alice Johnson',
            createdAt: new Date().toISOString(),
            hasResponse: false,
          },
          {
            id: 'review-recent-2',
            projectTitle: 'Vue Portfolio',
            rating: 4,
            comment: 'Good quality but needs better documentation.',
            buyerName: 'Bob Wilson',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            hasResponse: true,
          },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Seller review analytics retrieved successfully',
        data: { analytics: mockAnalytics },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve seller review analytics',
      });
    }
  }
);

export default router;
