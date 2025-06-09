import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Enums for moderation
export enum ModerationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_CHANGES = 'REQUEST_CHANGES',
  FLAG = 'FLAG',
  UNFLAG = 'UNFLAG',
}

export enum ModerationReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  POOR_QUALITY = 'POOR_QUALITY',
  INCOMPLETE_PROJECT = 'INCOMPLETE_PROJECT',
  MISLEADING_DESCRIPTION = 'MISLEADING_DESCRIPTION',
  TECHNICAL_ISSUES = 'TECHNICAL_ISSUES',
  PRICING_ISSUES = 'PRICING_ISSUES',
  OTHER = 'OTHER',
}

// Interface for moderation queue item
export interface ModerationQueueItem {
  id: string;
  title: string;
  category: string;
  status: string;
  submittedAt: string;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  flagCount: number;
  lastModeratedAt?: string;
  moderatedBy?: string;
}

// Interface for moderation details
export interface ModerationDetails {
  project: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    techStack: string[];
    tags: string[];
    price: number;
    licenseType: string;
    status: string;
    mainFile?: string;
    demoUrl?: string;
    githubUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    projectCount: number;
    rating: number;
  };
  moderationHistory: Array<{
    id: string;
    action: string;
    reason?: string;
    notes?: string;
    moderatedBy: string;
    moderatedAt: string;
  }>;
  contentAnalysis: {
    fileCount: number;
    totalSize: number;
    fileTypes: string[];
    hasDocumentation: boolean;
    hasDemo: boolean;
    qualityScore: number;
    issues: string[];
  };
}

// Get moderation queue with filtering and pagination
export const getModerationQueue = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  category?: string,
  priority?: string,
  search?: string
): Promise<{
  items: ModerationQueueItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.status = status;
    } else {
      // Default to pending for moderation queue
      whereClause.status = 'PENDING';
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Mock data for now since we don't have database
    const mockItems: ModerationQueueItem[] = [
      {
        id: 'project-1',
        title: 'React E-commerce Dashboard',
        category: 'Web Development',
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        seller: {
          id: 'seller-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        priority: 'HIGH',
        flagCount: 0,
      },
      {
        id: 'project-2',
        title: 'Vue.js Portfolio Template',
        category: 'Frontend Development',
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        seller: {
          id: 'seller-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        },
        priority: 'MEDIUM',
        flagCount: 1,
      },
      {
        id: 'project-3',
        title: 'Angular CRM System',
        category: 'Web Development',
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 172800000).toISOString(),
        seller: {
          id: 'seller-3',
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com',
        },
        priority: 'LOW',
        flagCount: 0,
      },
    ];

    // Filter mock data based on criteria
    let filteredItems = mockItems;

    if (status && status !== 'PENDING') {
      filteredItems = [];
    }

    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const paginatedItems = filteredItems.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
      },
    };

  } catch (error) {
    console.error('Error getting moderation queue:', error);
    throw new AppError('Failed to get moderation queue', 500);
  }
};

// Get detailed moderation information for a project
export const getModerationDetails = async (projectId: string): Promise<ModerationDetails> => {
  try {
    // Mock detailed moderation data
    const mockDetails: ModerationDetails = {
      project: {
        id: projectId,
        title: 'React E-commerce Dashboard',
        shortDescription: 'Modern admin dashboard with analytics',
        description: 'A comprehensive e-commerce admin dashboard built with React and TypeScript. Features include real-time analytics, inventory management, order tracking, and customer management.',
        category: 'Web Development',
        techStack: ['React', 'TypeScript', 'Material-UI', 'Chart.js'],
        tags: ['dashboard', 'ecommerce', 'admin', 'analytics'],
        price: 2999,
        licenseType: 'SINGLE',
        status: 'PENDING',
        mainFile: 'react-dashboard.zip',
        demoUrl: 'https://demo.example.com/react-dashboard',
        githubUrl: 'https://github.com/example/react-dashboard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seller: {
        id: 'seller-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isVerified: true,
        projectCount: 5,
        rating: 4.8,
      },
      moderationHistory: [
        {
          id: 'mod-1',
          action: 'SUBMITTED',
          notes: 'Project submitted for review',
          moderatedBy: 'system',
          moderatedAt: new Date().toISOString(),
        },
      ],
      contentAnalysis: {
        fileCount: 45,
        totalSize: 2.5 * 1024 * 1024, // 2.5 MB
        fileTypes: ['.js', '.tsx', '.css', '.json', '.md'],
        hasDocumentation: true,
        hasDemo: true,
        qualityScore: 85,
        issues: [],
      },
    };

    return mockDetails;

  } catch (error) {
    console.error('Error getting moderation details:', error);
    throw new AppError('Failed to get moderation details', 500);
  }
};

// Moderate a project (approve, reject, etc.)
export const moderateProject = async (
  projectId: string,
  moderatorId: string,
  action: ModerationAction,
  reason?: ModerationReason,
  notes?: string
): Promise<{
  success: boolean;
  project: {
    id: string;
    status: string;
    moderatedAt: string;
    moderatedBy: string;
  };
}> => {
  try {
    // Determine new status based on action
    let newStatus = 'PENDING';
    switch (action) {
      case ModerationAction.APPROVE:
        newStatus = 'APPROVED';
        break;
      case ModerationAction.REJECT:
        newStatus = 'REJECTED';
        break;
      case ModerationAction.REQUEST_CHANGES:
        newStatus = 'PENDING';
        break;
    }

    // Mock moderation result
    const moderationResult = {
      success: true,
      project: {
        id: projectId,
        status: newStatus,
        moderatedAt: new Date().toISOString(),
        moderatedBy: moderatorId,
      },
    };

    // Log moderation action
    await logModerationAction(projectId, moderatorId, action, reason, notes);

    return moderationResult;

  } catch (error) {
    console.error('Error moderating project:', error);
    throw new AppError('Failed to moderate project', 500);
  }
};

// Log moderation action
export const logModerationAction = async (
  projectId: string,
  moderatorId: string,
  action: ModerationAction,
  reason?: ModerationReason,
  notes?: string
): Promise<void> => {
  try {
    // Mock logging - in real implementation, this would save to database
    const logEntry = {
      projectId,
      moderatorId,
      action,
      reason,
      notes,
      timestamp: new Date().toISOString(),
    };

    console.log('Moderation action logged:', logEntry);

  } catch (error) {
    console.error('Error logging moderation action:', error);
    throw new AppError('Failed to log moderation action', 500);
  }
};

// Get moderation statistics
export const getModerationStatistics = async (): Promise<{
  queue: {
    pending: number;
    approved: number;
    rejected: number;
    flagged: number;
  };
  performance: {
    averageReviewTime: number; // in hours
    reviewsToday: number;
    reviewsThisWeek: number;
    reviewsThisMonth: number;
  };
  moderators: Array<{
    id: string;
    name: string;
    reviewsToday: number;
    reviewsThisWeek: number;
    averageReviewTime: number;
  }>;
}> => {
  try {
    // Mock moderation statistics
    const statistics = {
      queue: {
        pending: 12,
        approved: 156,
        rejected: 23,
        flagged: 3,
      },
      performance: {
        averageReviewTime: 4.5,
        reviewsToday: 8,
        reviewsThisWeek: 45,
        reviewsThisMonth: 189,
      },
      moderators: [
        {
          id: 'mod-1',
          name: 'Admin User',
          reviewsToday: 5,
          reviewsThisWeek: 28,
          averageReviewTime: 3.2,
        },
        {
          id: 'mod-2',
          name: 'Senior Moderator',
          reviewsToday: 3,
          reviewsThisWeek: 17,
          averageReviewTime: 5.8,
        },
      ],
    };

    return statistics;

  } catch (error) {
    console.error('Error getting moderation statistics:', error);
    throw new AppError('Failed to get moderation statistics', 500);
  }
};

// Analyze project content for quality and issues
export const analyzeProjectContent = async (projectId: string): Promise<{
  qualityScore: number;
  issues: string[];
  recommendations: string[];
  fileAnalysis: {
    totalFiles: number;
    totalSize: number;
    fileTypes: { [key: string]: number };
    hasReadme: boolean;
    hasLicense: boolean;
    hasDocumentation: boolean;
  };
}> => {
  try {
    // Mock content analysis
    const analysis = {
      qualityScore: 85,
      issues: [
        'Missing README.md file',
        'No license file found',
      ],
      recommendations: [
        'Add comprehensive README with setup instructions',
        'Include a proper license file',
        'Add more detailed code comments',
        'Consider adding unit tests',
      ],
      fileAnalysis: {
        totalFiles: 45,
        totalSize: 2.5 * 1024 * 1024,
        fileTypes: {
          '.js': 15,
          '.tsx': 12,
          '.css': 8,
          '.json': 5,
          '.md': 3,
          '.png': 2,
        },
        hasReadme: false,
        hasLicense: false,
        hasDocumentation: true,
      },
    };

    return analysis;

  } catch (error) {
    console.error('Error analyzing project content:', error);
    throw new AppError('Failed to analyze project content', 500);
  }
};

// Get moderation logs with filtering
export const getModerationLogs = async (
  page: number = 1,
  limit: number = 50,
  projectId?: string,
  moderatorId?: string,
  action?: string,
  startDate?: string,
  endDate?: string
): Promise<{
  logs: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    moderatorName: string;
    action: string;
    reason?: string;
    notes?: string;
    timestamp: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    // Mock moderation logs
    const mockLogs = [
      {
        id: 'log-1',
        projectId: 'project-1',
        projectTitle: 'React E-commerce Dashboard',
        moderatorName: 'Admin User',
        action: 'APPROVE',
        reason: undefined,
        notes: 'High quality project with good documentation',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'log-2',
        projectId: 'project-2',
        projectTitle: 'Vue.js Portfolio',
        moderatorName: 'Senior Moderator',
        action: 'REJECT',
        reason: 'POOR_QUALITY',
        notes: 'Code quality is below standards, missing documentation',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'log-3',
        projectId: 'project-3',
        projectTitle: 'Angular CRM',
        moderatorName: 'Admin User',
        action: 'REQUEST_CHANGES',
        reason: 'INCOMPLETE_PROJECT',
        notes: 'Please add proper README and setup instructions',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    // Apply filtering
    let filteredLogs = mockLogs;

    if (projectId) {
      filteredLogs = filteredLogs.filter(log => log.projectId === projectId);
    }

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(skip, skip + limit);

    return {
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / limit),
      },
    };

  } catch (error) {
    console.error('Error getting moderation logs:', error);
    throw new AppError('Failed to get moderation logs', 500);
  }
};
