import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Interface for seller analytics
export interface SellerAnalytics {
  overview: {
    totalProjects: number;
    totalSales: number;
    totalRevenue: number;
    totalDownloads: number;
    averageRating: number;
    conversionRate: number; // percentage
  };
  salesTrend: Array<{
    period: string;
    sales: number;
    revenue: number;
    downloads: number;
  }>;
  topProjects: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
    downloads: number;
    rating: number;
    conversionRate: number;
  }>;
  customerInsights: {
    totalCustomers: number;
    repeatCustomers: number;
    averageOrderValue: number;
    customersByCountry: Array<{
      country: string;
      customers: number;
      percentage: number;
    }>;
  };
  revenueBreakdown: {
    grossRevenue: number;
    platformCommission: number;
    netRevenue: number;
    refunds: number;
  };
}

// Interface for project analytics
export interface ProjectAnalytics {
  overview: {
    views: number;
    downloads: number;
    sales: number;
    revenue: number;
    rating: number;
    reviewCount: number;
    conversionRate: number;
  };
  performanceTrend: Array<{
    date: string;
    views: number;
    downloads: number;
    sales: number;
  }>;
  audienceInsights: {
    topCountries: Array<{
      country: string;
      views: number;
      downloads: number;
      percentage: number;
    }>;
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    trafficSources: Array<{
      source: string;
      visits: number;
      percentage: number;
    }>;
  };
  customerFeedback: {
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    recentReviews: Array<{
      rating: number;
      comment: string;
      date: string;
      buyerName: string;
    }>;
  };
}

// Interface for platform analytics (admin)
export interface PlatformAnalytics {
  overview: {
    totalUsers: number;
    totalProjects: number;
    totalTransactions: number;
    totalRevenue: number;
    platformCommission: number;
    activeUsers: number;
  };
  growthMetrics: {
    userGrowth: Array<{
      period: string;
      newUsers: number;
      activeUsers: number;
      churnRate: number;
    }>;
    revenueGrowth: Array<{
      period: string;
      revenue: number;
      transactions: number;
      averageOrderValue: number;
    }>;
  };
  marketInsights: {
    topCategories: Array<{
      category: string;
      projects: number;
      sales: number;
      revenue: number;
    }>;
    topSellers: Array<{
      id: string;
      name: string;
      projects: number;
      sales: number;
      revenue: number;
    }>;
    geographicDistribution: Array<{
      country: string;
      users: number;
      revenue: number;
      percentage: number;
    }>;
  };
}

// Get seller analytics
export const getSellerAnalytics = async (
  sellerId: string,
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<SellerAnalytics> => {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Mock analytics data for now
    const mockAnalytics: SellerAnalytics = {
      overview: {
        totalProjects: 12,
        totalSales: 156,
        totalRevenue: 467400, // in paise
        totalDownloads: 234,
        averageRating: 4.3,
        conversionRate: 15.2,
      },
      salesTrend: generateSalesTrend(period),
      topProjects: [
        {
          id: 'project-1',
          title: 'React E-commerce Dashboard',
          sales: 45,
          revenue: 134550,
          downloads: 67,
          rating: 4.6,
          conversionRate: 18.5,
        },
        {
          id: 'project-2',
          title: 'Vue.js Portfolio Template',
          sales: 38,
          revenue: 75962,
          downloads: 52,
          rating: 4.2,
          conversionRate: 16.8,
        },
        {
          id: 'project-3',
          title: 'Angular CRM System',
          sales: 32,
          revenue: 111968,
          downloads: 45,
          rating: 4.4,
          conversionRate: 14.2,
        },
      ],
      customerInsights: {
        totalCustomers: 134,
        repeatCustomers: 23,
        averageOrderValue: 2996,
        customersByCountry: [
          { country: 'India', customers: 89, percentage: 66.4 },
          { country: 'United States', customers: 23, percentage: 17.2 },
          { country: 'United Kingdom', customers: 12, percentage: 9.0 },
          { country: 'Canada', customers: 10, percentage: 7.5 },
        ],
      },
      revenueBreakdown: {
        grossRevenue: 467400,
        platformCommission: 46740, // 10%
        netRevenue: 420660,
        refunds: 5988,
      },
    };

    return mockAnalytics;

  } catch (error) {
    console.error('Error getting seller analytics:', error);
    throw new AppError('Failed to get seller analytics', 500);
  }
};

// Get project analytics
export const getProjectAnalytics = async (
  projectId: string,
  sellerId: string,
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<ProjectAnalytics> => {
  try {
    // Mock project verification for now
    // In real implementation, verify project ownership
    // const project = await prisma.project.findFirst({
    //   where: {
    //     id: projectId,
    //     sellerId: sellerId,
    //   },
    // });

    // if (!project) {
    //   throw new AppError('Project not found or access denied', 404);
    // }

    // Mock project analytics data
    const mockAnalytics: ProjectAnalytics = {
      overview: {
        views: 1245,
        downloads: 89,
        sales: 67,
        revenue: 200733,
        rating: 4.5,
        reviewCount: 23,
        conversionRate: 7.2,
      },
      performanceTrend: generatePerformanceTrend(period),
      audienceInsights: {
        topCountries: [
          { country: 'India', views: 567, downloads: 34, percentage: 45.5 },
          { country: 'United States', views: 234, downloads: 18, percentage: 18.8 },
          { country: 'United Kingdom', views: 156, downloads: 12, percentage: 12.5 },
          { country: 'Germany', views: 123, downloads: 8, percentage: 9.9 },
          { country: 'Canada', views: 98, downloads: 6, percentage: 7.9 },
        ],
        deviceBreakdown: {
          desktop: 72.3,
          mobile: 21.4,
          tablet: 6.3,
        },
        trafficSources: [
          { source: 'Direct', visits: 456, percentage: 36.7 },
          { source: 'Search', visits: 334, percentage: 26.8 },
          { source: 'Social Media', visits: 234, percentage: 18.8 },
          { source: 'Referral', visits: 156, percentage: 12.5 },
          { source: 'Email', visits: 65, percentage: 5.2 },
        ],
      },
      customerFeedback: {
        averageRating: 4.5,
        ratingDistribution: { 5: 12, 4: 8, 3: 2, 2: 1, 1: 0 },
        recentReviews: [
          {
            rating: 5,
            comment: 'Excellent project with great documentation!',
            date: new Date().toISOString(),
            buyerName: 'John D.',
          },
          {
            rating: 4,
            comment: 'Good quality code, easy to customize.',
            date: new Date(Date.now() - 86400000).toISOString(),
            buyerName: 'Sarah M.',
          },
          {
            rating: 5,
            comment: 'Perfect for my needs, saved me hours of work.',
            date: new Date(Date.now() - 172800000).toISOString(),
            buyerName: 'Mike R.',
          },
        ],
      },
    };

    return mockAnalytics;

  } catch (error) {
    console.error('Error getting project analytics:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get project analytics', 500);
  }
};

// Get platform analytics (admin only)
export const getPlatformAnalytics = async (
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<PlatformAnalytics> => {
  try {
    // Mock platform analytics data
    const mockAnalytics: PlatformAnalytics = {
      overview: {
        totalUsers: 2456,
        totalProjects: 234,
        totalTransactions: 1567,
        totalRevenue: 4698750,
        platformCommission: 469875,
        activeUsers: 1234,
      },
      growthMetrics: {
        userGrowth: generateUserGrowth(period),
        revenueGrowth: generateRevenueGrowth(period),
      },
      marketInsights: {
        topCategories: [
          {
            category: 'Web Development',
            projects: 89,
            sales: 567,
            revenue: 1698750,
          },
          {
            category: 'Mobile Development',
            projects: 67,
            sales: 423,
            revenue: 1267890,
          },
          {
            category: 'Backend Development',
            projects: 45,
            sales: 334,
            revenue: 1001250,
          },
          {
            category: 'Frontend Development',
            projects: 33,
            sales: 243,
            revenue: 730860,
          },
        ],
        topSellers: [
          {
            id: 'seller-1',
            name: 'John Doe',
            projects: 12,
            sales: 156,
            revenue: 467400,
          },
          {
            id: 'seller-2',
            name: 'Jane Smith',
            projects: 8,
            sales: 134,
            revenue: 401250,
          },
          {
            id: 'seller-3',
            name: 'Bob Wilson',
            projects: 15,
            sales: 123,
            revenue: 369750,
          },
        ],
        geographicDistribution: [
          { country: 'India', users: 1234, revenue: 2349375, percentage: 50.2 },
          { country: 'United States', users: 456, revenue: 1409625, percentage: 18.6 },
          { country: 'United Kingdom', users: 234, revenue: 704850, percentage: 9.5 },
          { country: 'Germany', users: 189, revenue: 563775, percentage: 7.7 },
          { country: 'Canada', users: 167, revenue: 498750, percentage: 6.8 },
        ],
      },
    };

    return mockAnalytics;

  } catch (error) {
    console.error('Error getting platform analytics:', error);
    throw new AppError('Failed to get platform analytics', 500);
  }
};

// Helper function to generate sales trend data
function generateSalesTrend(period: string): Array<{
  period: string;
  sales: number;
  revenue: number;
  downloads: number;
}> {
  const data = [];
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      period: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 10) + 1,
      revenue: Math.floor(Math.random() * 30000) + 5000,
      downloads: Math.floor(Math.random() * 15) + 2,
    });
  }
  
  return data;
}

// Helper function to generate performance trend data
function generatePerformanceTrend(period: string): Array<{
  date: string;
  views: number;
  downloads: number;
  sales: number;
}> {
  const data = [];
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 8) + 1,
      sales: Math.floor(Math.random() * 5) + 1,
    });
  }
  
  return data;
}

// Helper function to generate user growth data
function generateUserGrowth(period: string): Array<{
  period: string;
  newUsers: number;
  activeUsers: number;
  churnRate: number;
}> {
  const data = [];
  const months = period === '7d' ? 1 : period === '30d' ? 6 : period === '90d' ? 12 : 24;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    data.push({
      period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      newUsers: Math.floor(Math.random() * 200) + 50,
      activeUsers: Math.floor(Math.random() * 500) + 200,
      churnRate: Math.random() * 5 + 2,
    });
  }
  
  return data;
}

// Helper function to generate revenue growth data
function generateRevenueGrowth(period: string): Array<{
  period: string;
  revenue: number;
  transactions: number;
  averageOrderValue: number;
}> {
  const data = [];
  const months = period === '7d' ? 1 : period === '30d' ? 6 : period === '90d' ? 12 : 24;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const transactions = Math.floor(Math.random() * 100) + 20;
    const revenue = transactions * (Math.floor(Math.random() * 2000) + 1500);
    
    data.push({
      period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue,
      transactions,
      averageOrderValue: Math.floor(revenue / transactions),
    });
  }
  
  return data;
}

// Export analytics data
export const exportAnalyticsData = async (
  type: 'seller' | 'project' | 'platform',
  id?: string,
  format: 'csv' | 'excel' = 'csv',
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<string> => {
  try {
    let data: any;
    
    switch (type) {
      case 'seller':
        if (!id) throw new AppError('Seller ID is required', 400);
        data = await getSellerAnalytics(id, period);
        break;
      case 'project':
        if (!id) throw new AppError('Project ID is required', 400);
        // Note: This would need seller ID in real implementation
        data = await getProjectAnalytics(id, 'seller-id', period);
        break;
      case 'platform':
        data = await getPlatformAnalytics(period);
        break;
      default:
        throw new AppError('Invalid export type', 400);
    }

    // Convert to CSV format
    if (format === 'csv') {
      return convertToCSV(data, type);
    }

    // For Excel format, you would use a library like xlsx
    throw new AppError('Excel export not implemented yet', 501);

  } catch (error) {
    console.error('Error exporting analytics data:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to export analytics data', 500);
  }
};

// Helper function to convert data to CSV
function convertToCSV(data: any, type: string): string {
  // This is a simplified CSV conversion
  // In a real implementation, you'd want a more robust CSV library
  
  let csv = '';
  
  if (type === 'seller') {
    csv = 'Type,Value\n';
    csv += `Total Projects,${data.overview.totalProjects}\n`;
    csv += `Total Sales,${data.overview.totalSales}\n`;
    csv += `Total Revenue,${data.overview.totalRevenue}\n`;
    csv += `Average Rating,${data.overview.averageRating}\n`;
    csv += `Conversion Rate,${data.overview.conversionRate}%\n`;
  } else if (type === 'project') {
    csv = 'Metric,Value\n';
    csv += `Views,${data.overview.views}\n`;
    csv += `Downloads,${data.overview.downloads}\n`;
    csv += `Sales,${data.overview.sales}\n`;
    csv += `Revenue,${data.overview.revenue}\n`;
    csv += `Rating,${data.overview.rating}\n`;
    csv += `Conversion Rate,${data.overview.conversionRate}%\n`;
  } else if (type === 'platform') {
    csv = 'Metric,Value\n';
    csv += `Total Users,${data.overview.totalUsers}\n`;
    csv += `Total Projects,${data.overview.totalProjects}\n`;
    csv += `Total Transactions,${data.overview.totalTransactions}\n`;
    csv += `Total Revenue,${data.overview.totalRevenue}\n`;
    csv += `Platform Commission,${data.overview.platformCommission}\n`;
  }
  
  return csv;
}
