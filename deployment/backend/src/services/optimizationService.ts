import prisma from '../config/database';

// Database optimization service
export class DatabaseOptimizationService {
  
  // Optimize project queries with proper indexing and pagination
  static async getOptimizedProjects(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      minPrice,
      maxPrice,
    } = options;

    const skip = (page - 1) * Math.min(limit, 100); // Limit max results per page
    const take = Math.min(limit, 100);

    // Build where clause efficiently
    const where: any = {
      status: 'APPROVED', // Only show approved projects
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Optimize sorting
    const orderBy: any = {};
    switch (sortBy) {
      case 'price_low':
        orderBy.price = 'asc';
        break;
      case 'price_high':
        orderBy.price = 'desc';
        break;
      case 'rating':
        orderBy.averageRating = 'desc';
        break;
      case 'downloads':
        orderBy.downloadCount = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    try {
      // Use Promise.all for parallel execution
      const [projects, totalCount] = await Promise.all([
        prisma.project.findMany({
          where,
          orderBy,
          skip,
          take,
          select: {
            id: true,
            title: true,
            shortDescription: true,
            price: true,
            category: true,
            tags: true,
            screenshots: true,
            averageRating: true,
            reviewCount: true,
            downloadCount: true,
            createdAt: true,
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
          },
        }),
        prisma.project.count({ where }),
      ]);

      return {
        projects,
        pagination: {
          page,
          limit: take,
          total: totalCount,
          pages: Math.ceil(totalCount / take),
          hasNext: skip + take < totalCount,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Database optimization error:', error);
      throw error;
    }
  }

  // Optimize user queries
  static async getOptimizedUser(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profilePicture: true,
          bio: true,
          website: true,
          socialLinks: true,
          isVerified: true,
          createdAt: true,
          // Only include necessary related data
          _count: {
            select: {
              projects: true,
              purchases: true,
              reviews: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('User optimization error:', error);
      throw error;
    }
  }

  // Optimize review queries
  static async getOptimizedReviews(projectId: string, options: {
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
    } = options;

    const skip = (page - 1) * Math.min(limit, 50);
    const take = Math.min(limit, 50);

    const orderBy: any = {};
    switch (sortBy) {
      case 'rating_high':
        orderBy.rating = 'desc';
        break;
      case 'rating_low':
        orderBy.rating = 'asc';
        break;
      case 'helpful':
        orderBy.helpfulCount = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    try {
      const [reviews, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: { projectId },
          orderBy,
          skip,
          take,
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            helpfulCount: true,
            createdAt: true,
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
            sellerResponse: {
              select: {
                response: true,
                createdAt: true,
              },
            },
          },
        }),
        prisma.review.count({ where: { projectId } }),
      ]);

      return {
        reviews,
        pagination: {
          page,
          limit: take,
          total: totalCount,
          pages: Math.ceil(totalCount / take),
          hasNext: skip + take < totalCount,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Review optimization error:', error);
      throw error;
    }
  }

  // Batch operations for better performance
  static async batchUpdateProjects(updates: Array<{ id: string; data: any }>) {
    try {
      const updatePromises = updates.map(({ id, data }) =>
        prisma.project.update({
          where: { id },
          data,
        })
      );

      return await Promise.all(updatePromises);
    } catch (error) {
      console.error('Batch update error:', error);
      throw error;
    }
  }

  // Connection pool optimization
  static async optimizeConnectionPool() {
    try {
      // Test connection pool health
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        healthy: responseTime < 100, // Consider healthy if < 100ms
        responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Connection pool optimization error:', error);
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Query performance monitoring
  static async monitorQueryPerformance(query: string, operation: () => Promise<any>) {
    const startTime = process.hrtime.bigint();
    
    try {
      const result = await operation();
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      // Log slow queries
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected: ${query} - ${duration.toFixed(2)}ms`);
      }

      return {
        result,
        performance: {
          query,
          duration: Math.round(duration * 100) / 100,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;

      console.error(`❌ Query failed: ${query} - ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  // Database health check
  static async healthCheck() {
    try {
      const checks = await Promise.all([
        // Basic connectivity
        prisma.$queryRaw`SELECT 1 as connectivity`,
        
        // Check if we can read from main tables
        prisma.user.count(),
        prisma.project.count(),
        
        // Connection pool status
        this.optimizeConnectionPool(),
      ]);

      return {
        status: 'healthy',
        checks: {
          connectivity: !!checks[0],
          userTable: typeof checks[1] === 'number',
          projectTable: typeof checks[2] === 'number',
          connectionPool: checks[3],
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Clean up old data
  static async cleanupOldData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Clean up old sessions, logs, etc.
      const cleanupResults = await Promise.all([
        // Example: Clean up old password reset tokens
        prisma.user.updateMany({
          where: {
            passwordResetExpires: {
              lt: new Date(),
            },
          },
          data: {
            passwordResetToken: null,
            passwordResetExpires: null,
          },
        }),
        
        // Example: Clean up old email verification tokens
        prisma.user.updateMany({
          where: {
            emailVerificationExpires: {
              lt: new Date(),
            },
          },
          data: {
            emailVerificationToken: null,
            emailVerificationExpires: null,
          },
        }),
      ]);

      return {
        success: true,
        cleaned: cleanupResults.reduce((sum, result) => sum + result.count, 0),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Data cleanup error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default DatabaseOptimizationService;
