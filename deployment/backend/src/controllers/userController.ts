import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';

// Get user profile by ID (public view)
export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      bio: true,
      role: true,
      isVerified: true,
      createdAt: true,
      // Include public project information for sellers
      projects: {
        where: { status: 'APPROVED', isActive: true },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          price: true,
          rating: true,
          reviewCount: true,
          downloadCount: true,
          screenshots: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 6, // Show latest 6 projects
      },
      // Include review statistics
      _count: {
        select: {
          projects: {
            where: { status: 'APPROVED', isActive: true },
          },
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isVerified) {
    throw new AppError('User profile is not available', 404);
  }

  const response = {
    success: true,
    message: 'User profile retrieved successfully',
    data: { user },
  };

  logApiResponse(response, 'Public profile retrieval successful');
  res.status(200).json(response);
});

// Update user profile (authenticated user only)
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { firstName, lastName, bio, phone } = req.body;

  // Validate that user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Update user profile
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName,
      lastName,
      bio,
      phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      phone: true,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const response = {
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  };

  logApiResponse(response, 'Profile update successful');
  res.status(200).json(response);
});

// Update user avatar
export const updateAvatar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Check if file was uploaded
  if (!req.file) {
    throw new AppError('No avatar file provided', 400);
  }

  // For now, we'll store the filename. In production, this would be an S3 URL
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  // Update user avatar in database
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  const response = {
    success: true,
    message: 'Avatar updated successfully',
    data: { 
      user: updatedUser,
      avatarUrl,
    },
  };

  logApiResponse(response, 'Avatar update successful');
  res.status(200).json(response);
});

// Delete user avatar
export const deleteAvatar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Update user avatar to null
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  const response = {
    success: true,
    message: 'Avatar deleted successfully',
    data: { user: updatedUser },
  };

  logApiResponse(response, 'Avatar deletion successful');
  res.status(200).json(response);
});

// Get user statistics (for profile dashboard)
export const getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const userId = req.user.id;

  // Get comprehensive user statistics
  const [projectStats, transactionStats, reviewStats] = await Promise.all([
    // Project statistics
    prisma.project.aggregate({
      where: { sellerId: userId },
      _count: { id: true },
      _sum: { downloadCount: true, viewCount: true },
      _avg: { rating: true },
    }),

    // Transaction statistics (as buyer and seller)
    Promise.all([
      prisma.transaction.aggregate({
        where: { buyerId: userId, status: 'COMPLETED' },
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { sellerId: userId, status: 'COMPLETED' },
        _count: { id: true },
        _sum: { sellerAmount: true },
      }),
    ]),

    // Review statistics
    prisma.review.aggregate({
      where: { userId: userId },
      _count: { id: true },
      _avg: { rating: true },
    }),
  ]);

  const [buyerTransactions, sellerTransactions] = transactionStats;

  const stats = {
    projects: {
      total: projectStats._count.id || 0,
      totalDownloads: projectStats._sum.downloadCount || 0,
      totalViews: projectStats._sum.viewCount || 0,
      averageRating: projectStats._avg.rating || 0,
    },
    transactions: {
      asBuyer: {
        count: buyerTransactions._count.id || 0,
        totalSpent: buyerTransactions._sum.amount || 0,
      },
      asSeller: {
        count: sellerTransactions._count.id || 0,
        totalEarned: sellerTransactions._sum.sellerAmount || 0,
      },
    },
    reviews: {
      given: reviewStats._count.id || 0,
      averageRating: reviewStats._avg.rating || 0,
    },
  };

  const response = {
    success: true,
    message: 'User statistics retrieved successfully',
    data: { stats },
  };

  logApiResponse(response, 'User stats retrieval successful');
  res.status(200).json(response);
});

// Get user's projects (for profile management)
export const getUserProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { page = 1, limit = 10, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereClause: any = { sellerId: req.user.id };
  if (status) {
    whereClause.status = status;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        shortDescription: true,
        price: true,
        status: true,
        rating: true,
        reviewCount: true,
        downloadCount: true,
        viewCount: true,
        screenshots: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  const response = {
    success: true,
    message: 'User projects retrieved successfully',
    data: { projects },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };

  logApiResponse(response, 'User projects retrieval successful');
  res.status(200).json(response);
});
