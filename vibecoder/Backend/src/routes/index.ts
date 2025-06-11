import { Router } from 'express';
import { checkDatabaseHealth } from '../utils/database';
import { catchAsync } from '../middleware/errorHandler';
import authRoutes from './auth';
import userRoutes from './users';
import settingsRoutes from './settings';
import projectRoutes from './projects';
import fileRoutes from './files';
import paymentRoutes from './payments';
import downloadRoutes from './downloads';
import adminRoutes from './admin';
import reviewRoutes from './reviews';
import analyticsRoutes from './analytics';

const router = Router();

// API version
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check endpoint
router.get('/health', catchAsync(async (req, res) => {
  const healthCheck = await checkDatabaseHealth();
  
  res.status(healthCheck.status === 'healthy' ? 200 : 503).json({
    success: healthCheck.status === 'healthy',
    message: healthCheck.message,
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    database: healthCheck.status,
    stats: healthCheck.stats,
  });
}));

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VibeCoder Marketplace API Documentation',
    version: API_VERSION,
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      health: 'GET /api/health - API health check',
      docs: 'GET /api/docs - API documentation',
      // TODO: Add more endpoints as they are implemented
      auth: {
        register: 'POST /api/auth/register - User registration',
        login: 'POST /api/auth/login - User login',
        logout: 'POST /api/auth/logout - User logout',
        refresh: 'POST /api/auth/refresh - Refresh token',
      },
      users: {
        profile: 'GET /api/users/:id - Get public user profile',
        myProfile: 'GET /api/auth/profile - Get my profile (protected)',
        updateProfile: 'PUT /api/users/me/profile - Update my profile (protected)',
        myStats: 'GET /api/users/me/stats - Get my statistics (protected)',
        myProjects: 'GET /api/users/me/projects - Get my projects (protected)',
        uploadAvatar: 'POST /api/users/me/avatar - Upload avatar (protected)',
        deleteAvatar: 'DELETE /api/users/me/avatar - Delete avatar (protected)',
      },
      settings: {
        get: 'GET /api/settings - Get user settings (protected)',
        update: 'PUT /api/settings - Update user settings (protected)',
        notifications: 'GET /api/settings/notifications - Get notification settings (protected)',
        updateNotifications: 'PUT /api/settings/notifications - Update notification settings (protected)',
        privacy: 'GET /api/settings/privacy - Get privacy settings (protected)',
        updatePrivacy: 'PUT /api/settings/privacy - Update privacy settings (protected)',
      },
      files: {
        uploadProject: 'POST /api/files/projects/:projectId/upload - Upload project file (protected)',
        uploadScreenshots: 'POST /api/files/projects/:projectId/screenshots - Upload screenshots (protected)',
        download: 'GET /api/files/projects/:projectId/download - Download project file (protected)',
        info: 'GET /api/files/projects/:projectId/info - Get file information (protected)',
        delete: 'DELETE /api/files/projects/:projectId/delete - Delete project file (protected)',
        storageUsage: 'GET /api/files/storage/usage - Get storage usage (protected)',
        dashboard: 'GET /api/files/dashboard - Get file management dashboard (sellers only)',
        bulkDelete: 'POST /api/files/bulk/delete - Bulk delete files (protected)',
        integrityCheck: 'POST /api/files/integrity/check - Check file integrity (protected)',
      },
      payments: {
        createOrder: 'POST /api/payments/orders - Create payment order (protected)',
        verifyPayment: 'POST /api/payments/verify - Verify payment (protected)',
        handleFailure: 'POST /api/payments/failure - Handle payment failure (protected)',
        getOrderStatus: 'GET /api/payments/orders/:orderId/status - Get payment status (protected)',
        getTransactions: 'GET /api/payments/transactions - Get transaction history (protected)',
        getAnalytics: 'GET /api/payments/analytics - Get payment analytics (sellers/admins)',
        refund: 'POST /api/payments/refund - Initiate refund (admin only)',
        webhook: 'POST /api/payments/webhook - Razorpay webhook (public)',
        adminTransactions: 'GET /api/payments/admin/transactions - Get all transactions (admin only)',
        adminStatistics: 'GET /api/payments/admin/statistics - Get payment statistics (admin only)',
        exportData: 'GET /api/payments/admin/export - Export transaction data (admin only)',
      },
      downloads: {
        downloadFile: 'GET /api/downloads/file?token=xxx - Download project file (public with token)',
        createSession: 'POST /api/downloads/projects/:projectId/session - Create download session (protected)',
        checkPurchase: 'GET /api/downloads/projects/:projectId/purchase-status - Check purchase status (protected)',
        validateToken: 'POST /api/downloads/validate-token - Validate download token (protected)',
        getHistory: 'GET /api/downloads/history - Get download history (protected)',
        getSessionStatus: 'GET /api/downloads/sessions/:sessionId/status - Get session status (protected)',
        getAnalytics: 'GET /api/downloads/projects/:projectId/analytics - Get download analytics (sellers)',
        sellerStats: 'GET /api/downloads/seller/statistics - Get seller download stats (sellers only)',
        adminSessions: 'GET /api/downloads/admin/sessions - Get all download sessions (admin only)',
        adminAnalytics: 'GET /api/downloads/admin/analytics - Get admin download analytics (admin only)',
        adminExport: 'GET /api/downloads/admin/export - Export download data (admin only)',
        adminLogs: 'GET /api/downloads/admin/logs - Get download logs (admin only)',
      },
      admin: {
        dashboardOverview: 'GET /api/admin/dashboard/overview - Get admin dashboard overview (admin only)',
        platformStats: 'GET /api/admin/statistics/platform - Get platform statistics (admin only)',
        userAnalytics: 'GET /api/admin/analytics/users - Get user analytics (admin only)',
        revenueAnalytics: 'GET /api/admin/analytics/revenue - Get revenue analytics (admin only)',
        systemHealth: 'GET /api/admin/system/health - Get system health (admin only)',
        recentActivities: 'GET /api/admin/activities/recent - Get recent activities (admin only)',
        getAllUsers: 'GET /api/admin/users - Get all users with pagination (admin only)',
        getUserDetails: 'GET /api/admin/users/:userId - Get user details (admin only)',
        updateUser: 'PATCH /api/admin/users/:userId - Update user role/status (admin only)',
        deleteUser: 'DELETE /api/admin/users/:userId - Delete user (admin only)',
        getProjects: 'GET /api/admin/projects - Get all projects for moderation (admin only)',
        getProjectDetails: 'GET /api/admin/projects/:projectId - Get project details (admin only)',
        updateProjectStatus: 'PATCH /api/admin/projects/:projectId/status - Approve/reject project (admin only)',
        getTransactions: 'GET /api/admin/transactions - Get all transactions (admin only)',
        exportUsers: 'GET /api/admin/export/users - Export user data (admin only)',
        exportProjects: 'GET /api/admin/export/projects - Export project data (admin only)',
        moderationQueue: 'GET /api/admin/moderation/queue - Get moderation queue (admin only)',
        moderationStats: 'GET /api/admin/moderation/statistics - Get moderation statistics (admin only)',
        moderateProject: 'POST /api/admin/moderation/projects/:projectId/moderate - Moderate project (admin only)',
        moderationLogs: 'GET /api/admin/moderation/logs - Get moderation logs (admin only)',
      },
      reviews: {
        getProjectReviews: 'GET /api/reviews/projects/:projectId - Get reviews for project (public)',
        getProjectStats: 'GET /api/reviews/projects/:projectId/statistics - Get review statistics (public)',
        checkEligibility: 'GET /api/reviews/projects/:projectId/eligibility - Check review eligibility (protected)',
        createReview: 'POST /api/reviews/projects/:projectId - Create review (protected)',
        getMyReviews: 'GET /api/reviews/my-reviews - Get user reviews (protected)',
        updateReview: 'PATCH /api/reviews/:reviewId - Update review (protected)',
        deleteReview: 'DELETE /api/reviews/:reviewId - Delete review (protected)',
        markHelpful: 'POST /api/reviews/:reviewId/helpful - Mark review helpful (protected)',
        reportReview: 'POST /api/reviews/:reviewId/report - Report review (protected)',
        sellerResponse: 'POST /api/reviews/seller/:reviewId/response - Add seller response (sellers only)',
        sellerReviews: 'GET /api/reviews/seller/my-project-reviews - Get seller project reviews (sellers only)',
        sellerAnalytics: 'GET /api/reviews/seller/analytics - Get seller review analytics (sellers only)',
      },
      analytics: {
        sellerDashboard: 'GET /api/analytics/seller/dashboard-summary - Get seller dashboard summary (sellers only)',
        sellerAnalytics: 'GET /api/analytics/seller/:sellerId? - Get seller analytics (sellers only)',
        projectAnalytics: 'GET /api/analytics/projects/:projectId - Get project analytics (sellers only)',
        projectComparison: 'GET /api/analytics/projects/compare - Compare project analytics (sellers only)',
        platformAnalytics: 'GET /api/analytics/platform - Get platform analytics (admin only)',
        exportAnalytics: 'GET /api/analytics/export/:type/:id? - Export analytics data (protected)',
        revenueBreakdown: 'GET /api/analytics/seller/:sellerId/revenue-breakdown - Get revenue breakdown (sellers only)',
        customerAnalytics: 'GET /api/analytics/seller/:sellerId/customers - Get customer analytics (sellers only)',
        performanceInsights: 'GET /api/analytics/seller/:sellerId/insights - Get performance insights (sellers only)',
      },
      projects: {
        list: 'GET /api/projects - List projects (public)',
        create: 'POST /api/projects - Create project (sellers only)',
        get: 'GET /api/projects/:id - Get project details',
        update: 'PUT /api/projects/:id - Update project (owner/admin)',
        delete: 'DELETE /api/projects/:id - Delete project (owner/admin)',
        myProjects: 'GET /api/projects/my-projects - Get seller\'s projects (protected)',
        uploadFile: 'POST /api/projects/:id/upload-file - Upload project file (protected)',
        uploadScreenshots: 'POST /api/projects/:id/upload-screenshots - Upload screenshots (protected)',
        submit: 'POST /api/projects/:id/submit - Submit for review (protected)',
        updateStatus: 'PATCH /api/projects/:id/status - Update project status (admin only)',
        analytics: 'GET /api/projects/:id/analytics - Get project analytics (protected)',
      },
      transactions: {
        create: 'POST /api/transactions - Create transaction',
        list: 'GET /api/transactions - List user transactions',
        get: 'GET /api/transactions/:id - Get transaction details',
      },
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT token in Authorization header for protected routes',
    },
    errors: {
      400: 'Bad Request - Invalid input data',
      401: 'Unauthorized - Authentication required',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource not found',
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error - Server error',
    },
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VibeCoder API is operational',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
  });
});

// Test endpoint for development
if (process.env.NODE_ENV === 'development') {
  router.get('/test', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Test endpoint is working!',
      timestamp: new Date().toISOString(),
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        ip: req.ip,
      },
    });
  });

  router.post('/test', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'POST test endpoint is working!',
      timestamp: new Date().toISOString(),
      body: req.body,
    });
  });
}

// Authentication routes
router.use('/auth', authRoutes);

// User management routes
router.use('/users', userRoutes);

// User settings routes
router.use('/settings', settingsRoutes);

// Project management routes
router.use('/projects', projectRoutes);

// File management routes
router.use('/files', fileRoutes);

// Payment and transaction routes
router.use('/payments', paymentRoutes);

// Download and access control routes
router.use('/downloads', downloadRoutes);

// Admin panel and management routes
router.use('/admin', adminRoutes);

// Review and rating routes
router.use('/reviews', reviewRoutes);

// Analytics and reporting routes
router.use('/analytics', analyticsRoutes);

export default router;
