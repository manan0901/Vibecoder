import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaymentStatus, TransactionType } from './paymentService';

// Download access types
export enum DownloadAccessType {
  OWNER = 'OWNER',
  PURCHASED = 'PURCHASED',
  ADMIN = 'ADMIN',
  FREE = 'FREE'
}

// Download status enum
export enum DownloadStatus {
  INITIATED = 'INITIATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

// Interface for download token
export interface DownloadToken {
  projectId: string;
  userId: string;
  accessType: DownloadAccessType;
  expiresAt: number;
  downloadId: string;
}

// Interface for download session
export interface DownloadSession {
  id: string;
  projectId: string;
  userId: string;
  accessType: DownloadAccessType;
  token: string;
  expiresAt: Date;
  status: DownloadStatus;
  downloadCount: number;
  lastDownloadAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Generate secure download token
const generateDownloadToken = (
  projectId: string,
  userId: string,
  accessType: DownloadAccessType,
  downloadId: string
): string => {
  const payload: DownloadToken = {
    projectId,
    userId,
    accessType,
    downloadId,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h',
  });
};

// Verify download token
const verifyDownloadToken = (token: string): DownloadToken => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as DownloadToken;
    
    if (decoded.expiresAt < Date.now()) {
      throw new AppError('Download token has expired', 401);
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Invalid download token', 401);
  }
};

// Check if user has purchased the project
export const checkPurchaseStatus = async (
  userId: string,
  projectId: string
): Promise<{
  hasPurchased: boolean;
  transaction?: any;
  accessType: DownloadAccessType;
}> => {
  try {
    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        sellerId: true,
        price: true,
        status: true,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if user is the owner (seller)
    if (project.sellerId === userId) {
      return {
        hasPurchased: true,
        accessType: DownloadAccessType.OWNER,
      };
    }

    // Check if project is free
    if (project.price === 0) {
      return {
        hasPurchased: true,
        accessType: DownloadAccessType.FREE,
      };
    }

    // Check if user has purchased the project
    const transaction = await prisma.transaction.findFirst({
      where: {
        projectId,
        buyerId: userId,
        status: PaymentStatus.COMPLETED,
        type: TransactionType.PURCHASE,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    if (transaction) {
      return {
        hasPurchased: true,
        transaction,
        accessType: DownloadAccessType.PURCHASED,
      };
    }

    return {
      hasPurchased: false,
      accessType: DownloadAccessType.PURCHASED,
    };

  } catch (error) {
    console.error('Error checking purchase status:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to verify purchase status', 500);
  }
};

// Create download session
export const createDownloadSession = async (
  userId: string,
  projectId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{
  downloadId: string;
  token: string;
  expiresAt: Date;
  accessType: DownloadAccessType;
}> => {
  try {
    // Check purchase status
    const { hasPurchased, accessType, transaction } = await checkPurchaseStatus(userId, projectId);

    if (!hasPurchased) {
      throw new AppError('You must purchase this project before downloading', 403);
    }

    // Generate download session ID
    const downloadId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

    // Generate secure token
    const token = generateDownloadToken(projectId, userId, accessType, downloadId);

    // Create download session record
    const downloadSession = await prisma.downloadSession.create({
      data: {
        id: downloadId,
        projectId,
        userId,
        accessType,
        token,
        expiresAt,
        status: DownloadStatus.INITIATED,
        downloadCount: 0,
        ipAddress,
        userAgent,
        transactionId: transaction?.id,
      },
    });

    // Log download access
    await prisma.downloadLog.create({
      data: {
        downloadSessionId: downloadId,
        projectId,
        userId,
        action: 'SESSION_CREATED',
        ipAddress,
        userAgent,
        metadata: {
          access_type: accessType,
          transaction_id: transaction?.id,
        },
      },
    });

    return {
      downloadId,
      token,
      expiresAt,
      accessType,
    };

  } catch (error) {
    console.error('Error creating download session:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create download session', 500);
  }
};

// Validate download access
export const validateDownloadAccess = async (
  token: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{
  isValid: boolean;
  downloadSession?: any;
  project?: any;
}> => {
  try {
    // Verify token
    const tokenData = verifyDownloadToken(token);

    // Get download session
    const downloadSession = await prisma.downloadSession.findUnique({
      where: { id: tokenData.downloadId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            mainFile: true,
            originalFileName: true,
            fileSize: true,
            sellerId: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!downloadSession) {
      throw new AppError('Download session not found', 404);
    }

    // Check if session is expired
    if (downloadSession.expiresAt < new Date()) {
      await prisma.downloadSession.update({
        where: { id: downloadSession.id },
        data: { status: DownloadStatus.EXPIRED },
      });
      throw new AppError('Download session has expired', 401);
    }

    // Check if project file exists
    if (!downloadSession.project.mainFile) {
      throw new AppError('Project file not available', 404);
    }

    // Verify project is approved (unless owner or admin)
    if (downloadSession.project.status !== 'APPROVED' && 
        downloadSession.accessType !== DownloadAccessType.OWNER &&
        downloadSession.user.role !== 'ADMIN') {
      throw new AppError('Project is not available for download', 403);
    }

    // Log access validation
    await prisma.downloadLog.create({
      data: {
        downloadSessionId: downloadSession.id,
        projectId: downloadSession.projectId,
        userId: downloadSession.userId,
        action: 'ACCESS_VALIDATED',
        ipAddress,
        userAgent,
        metadata: {
          token_valid: true,
          session_status: downloadSession.status,
        },
      },
    });

    return {
      isValid: true,
      downloadSession,
      project: downloadSession.project,
    };

  } catch (error) {
    console.error('Error validating download access:', error);
    
    // Log failed validation
    try {
      const tokenData = verifyDownloadToken(token);
      await prisma.downloadLog.create({
        data: {
          downloadSessionId: tokenData.downloadId,
          projectId: tokenData.projectId,
          userId: tokenData.userId,
          action: 'ACCESS_DENIED',
          ipAddress,
          userAgent,
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            token_valid: false,
          },
        },
      });
    } catch (logError) {
      console.error('Error logging failed validation:', logError);
    }

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Download access validation failed', 500);
  }
};

// Start download process
export const startDownload = async (
  downloadSessionId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}> => {
  try {
    // Get download session
    const downloadSession = await prisma.downloadSession.findUnique({
      where: { id: downloadSessionId },
      include: {
        project: true,
      },
    });

    if (!downloadSession) {
      throw new AppError('Download session not found', 404);
    }

    // Check if session is still valid
    if (downloadSession.expiresAt < new Date()) {
      throw new AppError('Download session has expired', 401);
    }

    if (!downloadSession.project.mainFile) {
      throw new AppError('Project file not available', 404);
    }

    // Construct file path
    const filePath = path.join(
      process.env.UPLOAD_DIR || 'uploads',
      'projects',
      downloadSession.project.mainFile
    );

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new AppError('Project file not found on server', 404);
    }

    // Get file stats
    const stats = await fs.stat(filePath);

    // Update download session
    await prisma.downloadSession.update({
      where: { id: downloadSessionId },
      data: {
        status: DownloadStatus.IN_PROGRESS,
        downloadCount: {
          increment: 1,
        },
        lastDownloadAt: new Date(),
      },
    });

    // Update project download count
    await prisma.project.update({
      where: { id: downloadSession.projectId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // Log download start
    await prisma.downloadLog.create({
      data: {
        downloadSessionId,
        projectId: downloadSession.projectId,
        userId: downloadSession.userId,
        action: 'DOWNLOAD_STARTED',
        ipAddress,
        userAgent,
        metadata: {
          file_name: downloadSession.project.mainFile,
          file_size: stats.size,
          download_count: downloadSession.downloadCount + 1,
        },
      },
    });

    return {
      filePath,
      fileName: downloadSession.project.originalFileName || downloadSession.project.mainFile,
      fileSize: stats.size,
      mimeType: 'application/octet-stream',
    };

  } catch (error) {
    console.error('Error starting download:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to start download', 500);
  }
};

// Complete download process
export const completeDownload = async (
  downloadSessionId: string,
  success: boolean,
  bytesTransferred?: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    const status = success ? DownloadStatus.COMPLETED : DownloadStatus.FAILED;

    // Update download session
    await prisma.downloadSession.update({
      where: { id: downloadSessionId },
      data: {
        status,
      },
    });

    // Log download completion
    await prisma.downloadLog.create({
      data: {
        downloadSessionId,
        projectId: '', // Will be filled by database trigger or separate query
        userId: '', // Will be filled by database trigger or separate query
        action: success ? 'DOWNLOAD_COMPLETED' : 'DOWNLOAD_FAILED',
        ipAddress,
        userAgent,
        metadata: {
          success,
          bytes_transferred: bytesTransferred,
          completed_at: new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Error completing download:', error);
    // Don't throw error here as download might have succeeded
  }
};

// Get user download history
export const getUserDownloadHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  downloads: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    const skip = (page - 1) * limit;

    const [downloads, total] = await Promise.all([
      prisma.downloadSession.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              category: true,
              price: true,
              seller: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.downloadSession.count({
        where: { userId },
      }),
    ]);

    return {
      downloads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Error getting user download history:', error);
    throw new AppError('Failed to get download history', 500);
  }
};

// Get download analytics for project owner
export const getProjectDownloadAnalytics = async (
  projectId: string,
  sellerId: string
): Promise<{
  totalDownloads: number;
  uniqueDownloaders: number;
  downloadsByDate: any[];
  downloadsByCountry: any[];
  recentDownloads: any[];
}> => {
  try {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { sellerId: true },
    });

    if (!project || project.sellerId !== sellerId) {
      throw new AppError('Project not found or access denied', 403);
    }

    // TODO: Implement actual analytics queries
    // For now, return mock data
    const analytics = {
      totalDownloads: 156,
      uniqueDownloaders: 89,
      downloadsByDate: [
        { date: '2024-01-01', downloads: 12 },
        { date: '2024-01-02', downloads: 18 },
        { date: '2024-01-03', downloads: 15 },
      ],
      downloadsByCountry: [
        { country: 'India', downloads: 89 },
        { country: 'United States', downloads: 34 },
        { country: 'United Kingdom', downloads: 23 },
      ],
      recentDownloads: [
        {
          id: '1',
          userName: 'John Doe',
          downloadedAt: new Date().toISOString(),
          ipAddress: '192.168.1.1',
        },
        {
          id: '2',
          userName: 'Jane Smith',
          downloadedAt: new Date(Date.now() - 86400000).toISOString(),
          ipAddress: '192.168.1.2',
        },
      ],
    };

    return analytics;

  } catch (error) {
    console.error('Error getting project download analytics:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get download analytics', 500);
  }
};
