import { Request, Response, NextFunction } from 'express';
import { createReadStream } from 'fs';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import {
  checkPurchaseStatus,
  createDownloadSession,
  validateDownloadAccess,
  startDownload,
  completeDownload,
  getUserDownloadHistory,
  getProjectDownloadAnalytics,
} from '../services/downloadService';

// Create download session
export const createDownloadToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  const downloadSession = await createDownloadSession(
    req.user.id,
    projectId,
    ipAddress,
    userAgent
  );

  const response = {
    success: true,
    message: 'Download session created successfully',
    data: {
      downloadId: downloadSession.downloadId,
      token: downloadSession.token,
      expiresAt: downloadSession.expiresAt,
      accessType: downloadSession.accessType,
    },
  };

  logApiResponse(response, 'Download session created');
  res.status(201).json(response);
});

// Check purchase status
export const checkProjectPurchase = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const purchaseStatus = await checkPurchaseStatus(req.user.id, projectId);

  const response = {
    success: true,
    message: 'Purchase status retrieved successfully',
    data: {
      projectId,
      hasPurchased: purchaseStatus.hasPurchased,
      accessType: purchaseStatus.accessType,
      canDownload: purchaseStatus.hasPurchased,
    },
  };

  logApiResponse(response, 'Purchase status checked');
  res.status(200).json(response);
});

// Download project file with token
export const downloadProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new AppError('Download token is required', 400);
  }

  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  // Validate download access
  const { isValid, downloadSession, project } = await validateDownloadAccess(
    token,
    ipAddress,
    userAgent
  );

  if (!isValid || !downloadSession || !project) {
    throw new AppError('Invalid download access', 403);
  }

  try {
    // Start download process
    const downloadInfo = await startDownload(
      downloadSession.id,
      ipAddress,
      userAgent
    );

    // Set response headers
    res.setHeader('Content-Type', downloadInfo.mimeType);
    res.setHeader('Content-Length', downloadInfo.fileSize);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadInfo.fileName}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create file stream
    const fileStream = createReadStream(downloadInfo.filePath);
    let bytesTransferred = 0;

    // Track bytes transferred
    fileStream.on('data', (chunk) => {
      bytesTransferred += chunk.length;
    });

    // Handle stream completion
    fileStream.on('end', async () => {
      await completeDownload(
        downloadSession.id,
        true,
        bytesTransferred,
        ipAddress,
        userAgent
      );
    });

    // Handle stream errors
    fileStream.on('error', async (error) => {
      console.error('File stream error:', error);
      await completeDownload(
        downloadSession.id,
        false,
        bytesTransferred,
        ipAddress,
        userAgent
      );
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'File download failed',
        });
      }
    });

    // Pipe file to response
    fileStream.pipe(res);

    // Log successful download initiation
    logApiResponse({ success: true }, 'File download initiated');

  } catch (error) {
    // Log failed download
    await completeDownload(
      downloadSession.id,
      false,
      0,
      ipAddress,
      userAgent
    );
    throw error;
  }
});

// Get user download history
export const getDownloadHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const downloadHistory = await getUserDownloadHistory(req.user.id, pageNum, limitNum);

  const response = {
    success: true,
    message: 'Download history retrieved successfully',
    data: downloadHistory,
  };

  logApiResponse(response, 'Download history retrieved');
  res.status(200).json(response);
});

// Get project download analytics (for project owners)
export const getDownloadAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  // Only sellers and admins can view download analytics
  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only project owners can view download analytics', 403);
  }

  const analytics = await getProjectDownloadAnalytics(projectId, req.user.id);

  const response = {
    success: true,
    message: 'Download analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Download analytics retrieved');
  res.status(200).json(response);
});

// Validate download token (for frontend)
export const validateDownloadToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Download token is required', 400);
  }

  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  try {
    const { isValid, downloadSession, project } = await validateDownloadAccess(
      token,
      ipAddress,
      userAgent
    );

    const response = {
      success: true,
      message: 'Download token validated successfully',
      data: {
        isValid,
        canDownload: isValid,
        project: isValid ? {
          id: project?.id,
          title: project?.title,
          fileName: project?.originalFileName || project?.mainFile,
          fileSize: project?.fileSize,
        } : null,
        session: isValid ? {
          id: downloadSession?.id,
          accessType: downloadSession?.accessType,
          expiresAt: downloadSession?.expiresAt,
          downloadCount: downloadSession?.downloadCount,
        } : null,
      },
    };

    logApiResponse(response, 'Download token validated');
    res.status(200).json(response);

  } catch (error) {
    // Return validation failure instead of throwing error
    const response = {
      success: true,
      message: 'Download token validation completed',
      data: {
        isValid: false,
        canDownload: false,
        error: error instanceof Error ? error.message : 'Token validation failed',
      },
    };

    logApiResponse(response, 'Download token validation failed');
    res.status(200).json(response);
  }
});

// Get download session status
export const getDownloadSessionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { sessionId } = req.params;

  if (!sessionId) {
    throw new AppError('Session ID is required', 400);
  }

  // TODO: Implement actual session status retrieval
  // For now, return mock data
  const sessionStatus = {
    id: sessionId,
    status: 'COMPLETED',
    downloadCount: 1,
    lastDownloadAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    project: {
      id: 'project-123',
      title: 'Sample Project',
      fileName: 'sample-project.zip',
    },
  };

  const response = {
    success: true,
    message: 'Download session status retrieved successfully',
    data: { session: sessionStatus },
  };

  logApiResponse(response, 'Download session status retrieved');
  res.status(200).json(response);
});

// Admin: Get all download sessions
export const getAllDownloadSessions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can view all download sessions', 403);
  }

  const { page = '1', limit = '20', status, projectId } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;

  // TODO: Implement actual admin download sessions retrieval
  // For now, return mock data
  const mockSessions = {
    sessions: [
      {
        id: 'session-1',
        projectTitle: 'React Dashboard',
        userName: 'John Doe',
        status: 'COMPLETED',
        downloadCount: 2,
        createdAt: new Date().toISOString(),
        lastDownloadAt: new Date().toISOString(),
      },
      {
        id: 'session-2',
        projectTitle: 'Vue Portfolio',
        userName: 'Jane Smith',
        status: 'IN_PROGRESS',
        downloadCount: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastDownloadAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: 2,
      totalPages: 1,
    },
  };

  const response = {
    success: true,
    message: 'All download sessions retrieved successfully',
    data: mockSessions,
  };

  logApiResponse(response, 'Admin download sessions retrieved');
  res.status(200).json(response);
});
