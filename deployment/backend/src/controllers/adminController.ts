import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import {
  getPlatformStatistics,
  getUserAnalytics,
  getRevenueAnalytics,
  getSystemHealth,
  getRecentActivities,
} from '../services/adminService';
import {
  getModerationQueue,
  getModerationDetails,
  moderateProject,
  getModerationStatistics,
  analyzeProjectContent,
  getModerationLogs,
  ModerationAction,
  ModerationReason,
} from '../services/moderationService';
import prisma from '../config/database';

// Get admin dashboard overview
export const getDashboardOverview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access dashboard overview', 403);
  }

  const [statistics, systemHealth, recentActivities] = await Promise.all([
    getPlatformStatistics(),
    getSystemHealth(),
    getRecentActivities(10),
  ]);

  const response = {
    success: true,
    message: 'Dashboard overview retrieved successfully',
    data: {
      statistics,
      systemHealth,
      recentActivities,
    },
  };

  logApiResponse(response, 'Admin dashboard overview retrieved');
  res.status(200).json(response);
});

// Get platform statistics
export const getPlatformStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access platform statistics', 403);
  }

  const statistics = await getPlatformStatistics();

  const response = {
    success: true,
    message: 'Platform statistics retrieved successfully',
    data: { statistics },
  };

  logApiResponse(response, 'Platform statistics retrieved');
  res.status(200).json(response);
});

// Get user analytics
export const getUserAnalyticsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access user analytics', 403);
  }

  const analytics = await getUserAnalytics();

  const response = {
    success: true,
    message: 'User analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'User analytics retrieved');
  res.status(200).json(response);
});

// Get revenue analytics
export const getRevenueAnalyticsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access revenue analytics', 403);
  }

  const analytics = await getRevenueAnalytics();

  const response = {
    success: true,
    message: 'Revenue analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Revenue analytics retrieved');
  res.status(200).json(response);
});

// Get all users with pagination and filtering
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access user management', 403);
  }

  const { page = '1', limit = '20', role, search, status } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const whereClause: any = {};
  
  if (role && ['BUYER', 'SELLER', 'ADMIN'].includes(role as string)) {
    whereClause.role = role;
  }

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search as string, mode: 'insensitive' } },
      { lastName: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            purchases: true,
            sales: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitNum,
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const response = {
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  };

  logApiResponse(response, 'Admin users list retrieved');
  res.status(200).json(response);
});

// Get user details by ID
export const getUserDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access user details', 403);
  }

  const { userId } = req.params;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: {
        select: {
          id: true,
          title: true,
          status: true,
          price: true,
          downloadCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      purchases: {
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      sales: {
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          projects: true,
          purchases: true,
          sales: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response = {
    success: true,
    message: 'User details retrieved successfully',
    data: { user },
  };

  logApiResponse(response, 'User details retrieved');
  res.status(200).json(response);
});

// Update user role or status
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can update users', 403);
  }

  const { userId } = req.params;
  const { role, isVerified } = req.body;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  // Validate role if provided
  if (role && !['BUYER', 'SELLER', 'ADMIN'].includes(role)) {
    throw new AppError('Invalid role specified', 400);
  }

  // Prevent admin from changing their own role
  if (userId === req.user.id && role && role !== req.user.role) {
    throw new AppError('Cannot change your own role', 400);
  }

  const updateData: any = {};
  if (role !== undefined) updateData.role = role;
  if (isVerified !== undefined) updateData.isVerified = isVerified;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  const response = {
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser },
  };

  logApiResponse(response, 'User updated by admin');
  res.status(200).json(response);
});

// Get system health
export const getSystemHealthData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access system health', 403);
  }

  const health = await getSystemHealth();

  const response = {
    success: true,
    message: 'System health retrieved successfully',
    data: { health },
  };

  logApiResponse(response, 'System health retrieved');
  res.status(200).json(response);
});

// Get recent activities
export const getRecentActivitiesData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access recent activities', 403);
  }

  const { limit = '20' } = req.query;
  const limitNum = parseInt(limit as string) || 20;

  if (limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid limit parameter', 400);
  }

  const activities = await getRecentActivities(limitNum);

  const response = {
    success: true,
    message: 'Recent activities retrieved successfully',
    data: { activities },
  };

  logApiResponse(response, 'Recent activities retrieved');
  res.status(200).json(response);
});

// Delete user (soft delete)
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can delete users', 403);
  }

  const { userId } = req.params;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  // Prevent admin from deleting themselves
  if (userId === req.user.id) {
    throw new AppError('Cannot delete your own account', 400);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // For now, we'll just mark the user as deleted by updating their email
  // In a real implementation, you might want to implement soft delete
  const deletedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted_${Date.now()}_${user.email}`,
      isVerified: false,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const response = {
    success: true,
    message: 'User deleted successfully',
    data: { user: deletedUser },
  };

  logApiResponse(response, 'User deleted by admin');
  res.status(200).json(response);
});

// MODERATION CONTROLLERS

// Get moderation queue
export const getModerationQueueData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access moderation queue', 403);
  }

  const { page = '1', limit = '20', status, category, priority, search } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const queueData = await getModerationQueue(
    pageNum,
    limitNum,
    status as string,
    category as string,
    priority as string,
    search as string
  );

  const response = {
    success: true,
    message: 'Moderation queue retrieved successfully',
    data: queueData,
  };

  logApiResponse(response, 'Moderation queue retrieved');
  res.status(200).json(response);
});

// Get moderation details for a project
export const getProjectModerationDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access moderation details', 403);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const details = await getModerationDetails(projectId);

  const response = {
    success: true,
    message: 'Moderation details retrieved successfully',
    data: { details },
  };

  logApiResponse(response, 'Moderation details retrieved');
  res.status(200).json(response);
});

// Moderate a project (approve/reject/request changes)
export const moderateProjectAction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can moderate projects', 403);
  }

  const { projectId } = req.params;
  const { action, reason, notes } = req.body;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  if (!action || !Object.values(ModerationAction).includes(action)) {
    throw new AppError('Valid moderation action is required', 400);
  }

  if (action === ModerationAction.REJECT && !reason) {
    throw new AppError('Reason is required for rejection', 400);
  }

  const result = await moderateProject(
    projectId,
    req.user.id,
    action as ModerationAction,
    reason as ModerationReason,
    notes
  );

  const response = {
    success: true,
    message: `Project ${action.toLowerCase()}ed successfully`,
    data: result,
  };

  logApiResponse(response, 'Project moderated');
  res.status(200).json(response);
});

// Get moderation statistics
export const getModerationStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access moderation statistics', 403);
  }

  const statistics = await getModerationStatistics();

  const response = {
    success: true,
    message: 'Moderation statistics retrieved successfully',
    data: { statistics },
  };

  logApiResponse(response, 'Moderation statistics retrieved');
  res.status(200).json(response);
});

// Analyze project content
export const analyzeProjectContentData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can analyze project content', 403);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const analysis = await analyzeProjectContent(projectId);

  const response = {
    success: true,
    message: 'Project content analysis completed',
    data: { analysis },
  };

  logApiResponse(response, 'Project content analyzed');
  res.status(200).json(response);
});

// Get moderation logs
export const getModerationLogsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can access moderation logs', 403);
  }

  const {
    page = '1',
    limit = '50',
    projectId,
    moderatorId,
    action,
    startDate,
    endDate
  } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const logsData = await getModerationLogs(
    pageNum,
    limitNum,
    projectId as string,
    moderatorId as string,
    action as string,
    startDate as string,
    endDate as string
  );

  const response = {
    success: true,
    message: 'Moderation logs retrieved successfully',
    data: logsData,
  };

  logApiResponse(response, 'Moderation logs retrieved');
  res.status(200).json(response);
});
