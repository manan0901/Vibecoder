import { Request, Response, NextFunction } from 'express';
import { ProjectStatus, LicenseType } from '@prisma/client';
import prisma from '../config/database';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';

// Create new project
export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can create projects', 403);
  }

  const {
    title,
    description,
    shortDescription,
    techStack,
    category,
    tags,
    price,
    licenseType,
    demoUrl,
    githubUrl,
  } = req.body;

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug already exists
  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (existingProject) {
    throw new AppError('A project with this title already exists', 400);
  }

  // Create project
  const project = await prisma.project.create({
    data: {
      title,
      description,
      shortDescription,
      techStack,
      category,
      tags,
      price: parseFloat(price),
      licenseType: licenseType as LicenseType,
      demoUrl,
      githubUrl,
      slug,
      sellerId: req.user.id,
      status: ProjectStatus.DRAFT,
      screenshots: [],
    },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  const response = {
    success: true,
    message: 'Project created successfully',
    data: { project },
  };

  logApiResponse(response, 'Project creation successful');
  res.status(201).json(response);
});

// Get all projects (public)
export const getProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    minPrice,
    maxPrice,
    licenseType,
    sortBy = 'newest',
    featured,
    sellerId,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  // Build where clause
  const whereClause: any = {
    status: ProjectStatus.APPROVED,
    isActive: true,
  };

  if (category) {
    whereClause.category = category;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { tags: { hasSome: [search as string] } },
    ];
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = parseFloat(minPrice as string);
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice as string);
  }

  if (licenseType) {
    whereClause.licenseType = licenseType;
  }

  if (featured === 'true') {
    whereClause.isFeatured = true;
  }

  if (sellerId) {
    whereClause.sellerId = sellerId;
  }

  // Build order by clause
  let orderBy: any = { createdAt: 'desc' };
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'price_low':
      orderBy = { price: 'asc' };
      break;
    case 'price_high':
      orderBy = { price: 'desc' };
      break;
    case 'rating':
      orderBy = { rating: 'desc' };
      break;
    case 'downloads':
      orderBy = { downloadCount: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
      orderBy,
      skip,
      take: Number(limit),
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  const response = {
    success: true,
    message: 'Projects retrieved successfully',
    data: { projects },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };

  logApiResponse(response, 'Projects retrieval successful');
  res.status(200).json(response);
});

// Get project by ID
export const getProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              projects: {
                where: { status: ProjectStatus.APPROVED, isActive: true },
              },
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check if project is accessible
  if (project.status !== ProjectStatus.APPROVED && project.sellerId !== req.user?.id) {
    throw new AppError('Project not found', 404);
  }

  // Increment view count (only for approved projects)
  if (project.status === ProjectStatus.APPROVED) {
    await prisma.project.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  const response = {
    success: true,
    message: 'Project retrieved successfully',
    data: { project },
  };

  logApiResponse(response, 'Project retrieval successful');
  res.status(200).json(response);
});

// Update project
export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const {
    title,
    description,
    shortDescription,
    techStack,
    category,
    tags,
    price,
    licenseType,
    demoUrl,
    githubUrl,
  } = req.body;

  // Find project
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  // Check ownership
  if (existingProject.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only update your own projects', 403);
  }

  // Generate new slug if title changed
  let slug = existingProject.slug;
  if (title && title !== existingProject.title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if new slug already exists
    const slugExists = await prisma.project.findFirst({
      where: { slug, id: { not: id } },
    });

    if (slugExists) {
      throw new AppError('A project with this title already exists', 400);
    }
  }

  // Update project
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      shortDescription,
      techStack,
      category,
      tags,
      price: price ? parseFloat(price) : undefined,
      licenseType: licenseType as LicenseType,
      demoUrl,
      githubUrl,
      slug,
      // Reset status to DRAFT if project was previously rejected
      status: existingProject.status === ProjectStatus.REJECTED ? ProjectStatus.DRAFT : undefined,
    },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  const response = {
    success: true,
    message: 'Project updated successfully',
    data: { project: updatedProject },
  };

  logApiResponse(response, 'Project update successful');
  res.status(200).json(response);
});

// Delete project
export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Find project
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check ownership
  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete your own projects', 403);
  }

  // Soft delete by setting isActive to false
  await prisma.project.update({
    where: { id },
    data: { isActive: false },
  });

  const response = {
    success: true,
    message: 'Project deleted successfully',
    data: null,
  };

  logApiResponse(response, 'Project deletion successful');
  res.status(200).json(response);
});

// Get seller's projects
export const getSellerProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'newest',
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  // Build where clause
  const whereClause: any = {
    sellerId: req.user.id,
  };

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  // Build order by clause
  let orderBy: any = { createdAt: 'desc' };
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'title':
      orderBy = { title: 'asc' };
      break;
    case 'price_high':
      orderBy = { price: 'desc' };
      break;
    case 'price_low':
      orderBy = { price: 'asc' };
      break;
    case 'views':
      orderBy = { viewCount: 'desc' };
      break;
    case 'downloads':
      orderBy = { downloadCount: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy,
      skip,
      take: Number(limit),
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  const response = {
    success: true,
    message: 'Seller projects retrieved successfully',
    data: { projects },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };

  logApiResponse(response, 'Seller projects retrieval successful');
  res.status(200).json(response);
});

// Update project status (admin only)
export const updateProjectStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can update project status', 403);
  }

  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  // Validate status
  const validStatuses = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid project status', 400);
  }

  // Find project
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Update project status
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      status: status as ProjectStatus,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      approvedAt: status === 'APPROVED' ? new Date() : null,
    },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // TODO: Send notification email to seller about status change
  // This would be implemented when email service is set up

  const response = {
    success: true,
    message: `Project status updated to ${status}`,
    data: { project: updatedProject },
  };

  logApiResponse(response, 'Project status update successful');
  res.status(200).json(response);
});

// Submit project for review
export const submitProjectForReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Find project
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check ownership
  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only submit your own projects', 403);
  }

  // Check if project is in draft status
  if (project.status !== ProjectStatus.DRAFT && project.status !== ProjectStatus.REJECTED) {
    throw new AppError('Only draft or rejected projects can be submitted for review', 400);
  }

  // TODO: Add validation for required files (main file, screenshots)
  // This would check if project has uploaded files before submission

  // Update project status to pending
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      status: ProjectStatus.PENDING,
      submittedAt: new Date(),
    },
  });

  const response = {
    success: true,
    message: 'Project submitted for review successfully',
    data: { project: updatedProject },
  };

  logApiResponse(response, 'Project submission successful');
  res.status(200).json(response);
});

// Get project analytics
export const getProjectAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Find project
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      reviews: {
        select: {
          rating: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check ownership
  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only view analytics for your own projects', 403);
  }

  // Calculate analytics
  const totalReviews = project._count.reviews;
  const averageRating = totalReviews > 0
    ? project.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  // Get monthly stats (last 12 months)
  const monthlyStats = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    // TODO: Get actual download and view stats from database
    // For now, using mock data
    monthlyStats.push({
      month: date.toISOString().slice(0, 7), // YYYY-MM format
      views: Math.floor(Math.random() * 100),
      downloads: Math.floor(Math.random() * 20),
      revenue: Math.floor(Math.random() * 5000),
    });
  }

  const analytics = {
    overview: {
      totalViews: project.viewCount,
      totalDownloads: project.downloadCount,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalRevenue: project.downloadCount * project.price, // Simplified calculation
    },
    monthlyStats,
    recentReviews: project.reviews.slice(0, 5),
  };

  const response = {
    success: true,
    message: 'Project analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Project analytics retrieval successful');
  res.status(200).json(response);
});
