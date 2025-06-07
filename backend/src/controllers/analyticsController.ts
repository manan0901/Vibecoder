import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import {
  getSellerAnalytics,
  getProjectAnalytics,
  getPlatformAnalytics,
  exportAnalyticsData,
} from '../services/analyticsService';

// Get seller analytics
export const getSellerAnalyticsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can access seller analytics', 403);
  }

  const { period = '30d' } = req.query;
  const sellerId = req.params.sellerId || req.user.id;

  // If not admin, can only access own analytics
  if (req.user.role !== 'ADMIN' && sellerId !== req.user.id) {
    throw new AppError('You can only access your own analytics', 403);
  }

  const validPeriods = ['7d', '30d', '90d', '1y'];
  if (!validPeriods.includes(period as string)) {
    throw new AppError('Invalid period. Must be one of: 7d, 30d, 90d, 1y', 400);
  }

  const analytics = await getSellerAnalytics(
    sellerId,
    period as '7d' | '30d' | '90d' | '1y'
  );

  const response = {
    success: true,
    message: 'Seller analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Seller analytics retrieved');
  res.status(200).json(response);
});

// Get project analytics
export const getProjectAnalyticsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can access project analytics', 403);
  }

  const { projectId } = req.params;
  const { period = '30d' } = req.query;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const validPeriods = ['7d', '30d', '90d', '1y'];
  if (!validPeriods.includes(period as string)) {
    throw new AppError('Invalid period. Must be one of: 7d, 30d, 90d, 1y', 400);
  }

  const analytics = await getProjectAnalytics(
    projectId,
    req.user.id,
    period as '7d' | '30d' | '90d' | '1y'
  );

  const response = {
    success: true,
    message: 'Project analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Project analytics retrieved');
  res.status(200).json(response);
});

// Get platform analytics (admin only)
export const getPlatformAnalyticsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access platform analytics', 403);
  }

  const { period = '30d' } = req.query;

  const validPeriods = ['7d', '30d', '90d', '1y'];
  if (!validPeriods.includes(period as string)) {
    throw new AppError('Invalid period. Must be one of: 7d, 30d, 90d, 1y', 400);
  }

  const analytics = await getPlatformAnalytics(
    period as '7d' | '30d' | '90d' | '1y'
  );

  const response = {
    success: true,
    message: 'Platform analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Platform analytics retrieved');
  res.status(200).json(response);
});

// Export analytics data
export const exportAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { type, format = 'csv', period = '30d' } = req.query;
  const { id } = req.params;

  if (!type || !['seller', 'project', 'platform'].includes(type as string)) {
    throw new AppError('Invalid export type. Must be one of: seller, project, platform', 400);
  }

  if (!['csv', 'excel'].includes(format as string)) {
    throw new AppError('Invalid format. Must be csv or excel', 400);
  }

  const validPeriods = ['7d', '30d', '90d', '1y'];
  if (!validPeriods.includes(period as string)) {
    throw new AppError('Invalid period. Must be one of: 7d, 30d, 90d, 1y', 400);
  }

  // Check permissions
  if (type === 'platform' && req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can export platform analytics', 403);
  }

  if ((type === 'seller' || type === 'project') && req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can export their analytics', 403);
  }

  // For seller/project exports, use the authenticated user's ID if not admin
  let exportId = id;
  if (req.user.role !== 'ADMIN' && (type === 'seller' || type === 'project')) {
    exportId = req.user.id;
  }

  const csvData = await exportAnalyticsData(
    type as 'seller' | 'project' | 'platform',
    exportId,
    format as 'csv' | 'excel',
    period as '7d' | '30d' | '90d' | '1y'
  );

  // Set appropriate headers for file download
  const filename = `${type}_analytics_${period}_${Date.now()}.${format}`;
  res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  logApiResponse({ success: true, message: 'Analytics data exported' }, 'Analytics exported');
  res.status(200).send(csvData);
});

// Get seller dashboard summary
export const getSellerDashboardSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can access dashboard summary', 403);
  }

  const sellerId = req.user.id;

  // Mock dashboard summary data
  const summary = {
    todayStats: {
      views: 45,
      downloads: 12,
      sales: 3,
      revenue: 8997, // in paise
    },
    weekStats: {
      views: 234,
      downloads: 67,
      sales: 18,
      revenue: 53982,
    },
    monthStats: {
      views: 1245,
      downloads: 289,
      sales: 78,
      revenue: 233946,
    },
    recentActivity: [
      {
        type: 'SALE',
        description: 'New sale for "React Dashboard"',
        amount: 2999,
        timestamp: new Date().toISOString(),
      },
      {
        type: 'DOWNLOAD',
        description: 'Project downloaded: "Vue Portfolio"',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        type: 'REVIEW',
        description: 'New 5-star review received',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        type: 'VIEW',
        description: '50+ views on "Angular CRM"',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
    ],
    topPerformingProjects: [
      {
        id: 'project-1',
        title: 'React E-commerce Dashboard',
        views: 456,
        sales: 23,
        revenue: 68977,
        trend: 'up',
      },
      {
        id: 'project-2',
        title: 'Vue.js Portfolio Template',
        views: 234,
        sales: 18,
        revenue: 35982,
        trend: 'up',
      },
      {
        id: 'project-3',
        title: 'Angular CRM System',
        views: 189,
        sales: 15,
        revenue: 52485,
        trend: 'down',
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        type: 'SUCCESS',
        title: 'Payment Received',
        message: 'You received ₹29.99 for React Dashboard',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 'notif-2',
        type: 'INFO',
        title: 'New Review',
        message: 'Someone left a review on your Vue Portfolio project',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: 'notif-3',
        type: 'WARNING',
        title: 'Low Performance',
        message: 'Angular CRM views are down 15% this week',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
    ],
  };

  const response = {
    success: true,
    message: 'Seller dashboard summary retrieved successfully',
    data: { summary },
  };

  logApiResponse(response, 'Seller dashboard summary retrieved');
  res.status(200).json(response);
});

// Get analytics comparison
export const getAnalyticsComparison = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can access analytics comparison', 403);
  }

  const { projectIds, period = '30d' } = req.query;

  if (!projectIds) {
    throw new AppError('Project IDs are required for comparison', 400);
  }

  const ids = (projectIds as string).split(',');
  if (ids.length < 2 || ids.length > 5) {
    throw new AppError('You can compare 2-5 projects at a time', 400);
  }

  // Mock comparison data
  const comparison = {
    projects: ids.map((id, index) => ({
      id,
      title: `Project ${index + 1}`,
      metrics: {
        views: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 100) + 10,
        sales: Math.floor(Math.random() * 50) + 5,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        conversionRate: Math.round((Math.random() * 10 + 5) * 10) / 10,
      },
    })),
    insights: [
      'Project 1 has the highest conversion rate at 12.5%',
      'Project 2 generates the most revenue with ₹45,678',
      'Project 3 has the best rating at 4.8 stars',
      'Consider optimizing Project 4 for better performance',
    ],
  };

  const response = {
    success: true,
    message: 'Analytics comparison retrieved successfully',
    data: { comparison },
  };

  logApiResponse(response, 'Analytics comparison retrieved');
  res.status(200).json(response);
});
