import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaymentStatus, TransactionType } from './paymentService';

// Interface for platform statistics
export interface PlatformStatistics {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    admins: number;
    newThisMonth: number;
    growthRate: number;
  };
  projects: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    newThisMonth: number;
    topCategories: Array<{ category: string; count: number }>;
  };
  transactions: {
    total: number;
    totalRevenue: number;
    platformCommission: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageOrderValue: number;
    revenueThisMonth: number;
    revenueGrowth: number;
  };
  downloads: {
    total: number;
    uniqueDownloaders: number;
    downloadsThisMonth: number;
    topProjects: Array<{ title: string; downloads: number }>;
  };
}

// Interface for user analytics
export interface UserAnalytics {
  registrationTrend: Array<{ date: string; count: number }>;
  usersByRole: Array<{ role: string; count: number; percentage: number }>;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  topSellers: Array<{
    id: string;
    name: string;
    projectCount: number;
    totalRevenue: number;
    rating: number;
  }>;
}

// Interface for revenue analytics
export interface RevenueAnalytics {
  monthlyRevenue: Array<{ month: string; revenue: number; transactions: number }>;
  revenueByCategory: Array<{ category: string; revenue: number; percentage: number }>;
  paymentMethodDistribution: Array<{ method: string; count: number; percentage: number }>;
  commissionBreakdown: {
    totalCommission: number;
    sellerPayouts: number;
    platformRevenue: number;
  };
}

// Get comprehensive platform statistics
export const getPlatformStatistics = async (): Promise<PlatformStatistics> => {
  try {
    // Get current date for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // User statistics
    const [
      totalUsers,
      buyerCount,
      sellerCount,
      adminCount,
      newUsersThisMonth,
      newUsersLastMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'BUYER' } }),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          } 
        } 
      }),
    ]);

    const userGrowthRate = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : 0;

    // Project statistics
    const [
      totalProjects,
      approvedProjects,
      pendingProjects,
      rejectedProjects,
      newProjectsThisMonth,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'APPROVED' } }),
      prisma.project.count({ where: { status: 'PENDING' } }),
      prisma.project.count({ where: { status: 'REJECTED' } }),
      prisma.project.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Top categories
    const topCategories = await prisma.project.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 5,
    });

    // Transaction statistics
    const [
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      revenueData,
      revenueThisMonth,
      revenueLastMonth,
    ] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: PaymentStatus.COMPLETED } }),
      prisma.transaction.count({ where: { status: PaymentStatus.FAILED } }),
      prisma.transaction.aggregate({
        where: { 
          status: PaymentStatus.COMPLETED,
          type: TransactionType.PURCHASE,
        },
        _sum: { amount: true, commission: true },
        _avg: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { 
          status: PaymentStatus.COMPLETED,
          type: TransactionType.PURCHASE,
          completedAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { 
          status: PaymentStatus.COMPLETED,
          type: TransactionType.PURCHASE,
          completedAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = revenueData._sum.amount || 0;
    const platformCommission = revenueData._sum.commission || 0;
    const averageOrderValue = revenueData._avg.amount || 0;
    const revenueGrowth = (revenueLastMonth._sum.amount || 0) > 0 
      ? (((revenueThisMonth._sum.amount || 0) - (revenueLastMonth._sum.amount || 0)) / (revenueLastMonth._sum.amount || 0)) * 100 
      : 0;

    // Download statistics (mock data for now)
    const downloadStats = {
      total: 5420,
      uniqueDownloaders: 1234,
      downloadsThisMonth: 456,
      topProjects: [
        { title: 'React E-commerce Dashboard', downloads: 234 },
        { title: 'Vue.js Admin Panel', downloads: 189 },
        { title: 'Angular CRM System', downloads: 167 },
      ],
    };

    return {
      users: {
        total: totalUsers,
        buyers: buyerCount,
        sellers: sellerCount,
        admins: adminCount,
        newThisMonth: newUsersThisMonth,
        growthRate: Math.round(userGrowthRate * 100) / 100,
      },
      projects: {
        total: totalProjects,
        approved: approvedProjects,
        pending: pendingProjects,
        rejected: rejectedProjects,
        newThisMonth: newProjectsThisMonth,
        topCategories: topCategories.map(cat => ({
          category: cat.category,
          count: cat._count.category,
        })),
      },
      transactions: {
        total: totalTransactions,
        totalRevenue,
        platformCommission,
        successfulTransactions,
        failedTransactions,
        averageOrderValue: Math.round(averageOrderValue),
        revenueThisMonth: revenueThisMonth._sum.amount || 0,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      },
      downloads: downloadStats,
    };

  } catch (error) {
    console.error('Error getting platform statistics:', error);
    throw new AppError('Failed to get platform statistics', 500);
  }
};

// Get user analytics
export const getUserAnalytics = async (): Promise<UserAnalytics> => {
  try {
    // Registration trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Mock registration trend data
    const registrationTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 20) + 5,
      };
    });

    // Users by role
    const [buyerCount, sellerCount, adminCount] = await Promise.all([
      prisma.user.count({ where: { role: 'BUYER' } }),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    const totalUsers = buyerCount + sellerCount + adminCount;
    const usersByRole = [
      { role: 'BUYER', count: buyerCount, percentage: Math.round((buyerCount / totalUsers) * 100) },
      { role: 'SELLER', count: sellerCount, percentage: Math.round((sellerCount / totalUsers) * 100) },
      { role: 'ADMIN', count: adminCount, percentage: Math.round((adminCount / totalUsers) * 100) },
    ];

    // Active users (mock data)
    const activeUsers = {
      daily: Math.floor(totalUsers * 0.15),
      weekly: Math.floor(totalUsers * 0.35),
      monthly: Math.floor(totalUsers * 0.65),
    };

    // Top sellers (mock data)
    const topSellers = [
      { id: '1', name: 'John Doe', projectCount: 12, totalRevenue: 45000, rating: 4.8 },
      { id: '2', name: 'Jane Smith', projectCount: 8, totalRevenue: 32000, rating: 4.9 },
      { id: '3', name: 'Bob Wilson', projectCount: 15, totalRevenue: 28000, rating: 4.7 },
    ];

    return {
      registrationTrend,
      usersByRole,
      activeUsers,
      topSellers,
    };

  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw new AppError('Failed to get user analytics', 500);
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (): Promise<RevenueAnalytics> => {
  try {
    // Monthly revenue (last 12 months)
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      return {
        month: monthName,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        transactions: Math.floor(Math.random() * 200) + 50,
      };
    });

    // Revenue by category (mock data)
    const revenueByCategory = [
      { category: 'Web Development', revenue: 125000, percentage: 35 },
      { category: 'Mobile Development', revenue: 89000, percentage: 25 },
      { category: 'Backend Development', revenue: 67000, percentage: 19 },
      { category: 'Frontend Development', revenue: 45000, percentage: 13 },
      { category: 'Data Science', revenue: 28000, percentage: 8 },
    ];

    // Payment method distribution (mock data)
    const paymentMethodDistribution = [
      { method: 'UPI', count: 1250, percentage: 45 },
      { method: 'Credit Card', count: 875, percentage: 32 },
      { method: 'Debit Card', count: 420, percentage: 15 },
      { method: 'Net Banking', count: 222, percentage: 8 },
    ];

    // Commission breakdown
    const totalRevenue = await prisma.transaction.aggregate({
      where: { 
        status: PaymentStatus.COMPLETED,
        type: TransactionType.PURCHASE,
      },
      _sum: { amount: true, commission: true, sellerAmount: true },
    });

    const commissionBreakdown = {
      totalCommission: totalRevenue._sum.commission || 0,
      sellerPayouts: totalRevenue._sum.sellerAmount || 0,
      platformRevenue: totalRevenue._sum.commission || 0,
    };

    return {
      monthlyRevenue,
      revenueByCategory,
      paymentMethodDistribution,
      commissionBreakdown,
    };

  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw new AppError('Failed to get revenue analytics', 500);
  }
};

// Get system health metrics
export const getSystemHealth = async (): Promise<{
  database: { status: string; responseTime: number };
  storage: { used: number; total: number; percentage: number };
  api: { uptime: number; requestsPerMinute: number; errorRate: number };
}> => {
  try {
    // Database health check
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStart;

    // Mock system health data
    const systemHealth = {
      database: {
        status: 'healthy',
        responseTime: dbResponseTime,
      },
      storage: {
        used: 45.6, // GB
        total: 100, // GB
        percentage: 45.6,
      },
      api: {
        uptime: 99.8, // percentage
        requestsPerMinute: 245,
        errorRate: 0.2, // percentage
      },
    };

    return systemHealth;

  } catch (error) {
    console.error('Error getting system health:', error);
    throw new AppError('Failed to get system health', 500);
  }
};

// Get recent activities
export const getRecentActivities = async (limit: number = 20): Promise<Array<{
  id: string;
  type: string;
  description: string;
  user?: string;
  timestamp: string;
  metadata?: any;
}>> => {
  try {
    // Mock recent activities data
    const activities = [
      {
        id: '1',
        type: 'USER_REGISTRATION',
        description: 'New user registered',
        user: 'john.doe@example.com',
        timestamp: new Date().toISOString(),
        metadata: { role: 'BUYER' },
      },
      {
        id: '2',
        type: 'PROJECT_SUBMITTED',
        description: 'New project submitted for review',
        user: 'jane.smith@example.com',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        metadata: { projectTitle: 'React Dashboard' },
      },
      {
        id: '3',
        type: 'PAYMENT_COMPLETED',
        description: 'Payment completed successfully',
        user: 'bob.wilson@example.com',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        metadata: { amount: 2999, projectTitle: 'Vue Portfolio' },
      },
      {
        id: '4',
        type: 'PROJECT_APPROVED',
        description: 'Project approved and published',
        user: 'admin@vibecoder.com',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        metadata: { projectTitle: 'Angular CRM' },
      },
      {
        id: '5',
        type: 'DOWNLOAD_COMPLETED',
        description: 'Project downloaded successfully',
        user: 'alice.brown@example.com',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        metadata: { projectTitle: 'Node.js API' },
      },
    ];

    return activities.slice(0, limit);

  } catch (error) {
    console.error('Error getting recent activities:', error);
    throw new AppError('Failed to get recent activities', 500);
  }
};
