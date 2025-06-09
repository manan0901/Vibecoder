import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import prisma from '../config/database';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';

// File storage configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types
const ALLOWED_PROJECT_TYPES = ['.zip', '.rar', '.7z', '.tar.gz', '.tar'];
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_DOCUMENT_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.md'];

// Generate secure filename
const generateSecureFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `${timestamp}-${randomBytes}${ext}`;
};

// Validate file type
const validateFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return allowedTypes.some(type => ext.includes(type.replace('.', '')));
};

// Upload project file
export const uploadProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;
  
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  // Validate file size
  if (req.file.size > MAX_FILE_SIZE) {
    throw new AppError('File size exceeds 500MB limit', 400);
  }

  // Validate file type
  if (!validateFileType(req.file.originalname, ALLOWED_PROJECT_TYPES)) {
    throw new AppError('Invalid file type. Only ZIP, RAR, 7Z, and TAR files are allowed', 400);
  }

  // Check if project exists and user owns it
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only upload files to your own projects', 403);
  }

  // Generate secure filename
  const secureFilename = generateSecureFilename(req.file.originalname);
  const filePath = path.join(UPLOAD_DIR, 'projects', secureFilename);

  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Move file to secure location
    await fs.rename(req.file.path, filePath);

    // Update project with file information
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        mainFile: secureFilename,
        fileSize: req.file.size,
        originalFileName: req.file.originalname,
      },
    });

    const response = {
      success: true,
      message: 'Project file uploaded successfully',
      data: {
        filename: secureFilename,
        originalName: req.file.originalname,
        size: req.file.size,
        project: updatedProject,
      },
    };

    logApiResponse(response, 'Project file upload successful');
    res.status(200).json(response);
  } catch (error) {
    // Clean up file if database update fails
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Failed to clean up file:', unlinkError);
    }
    throw new AppError('File upload failed', 500);
  }
});

// Upload project screenshots
export const uploadProjectScreenshots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;
  
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError('No screenshots uploaded', 400);
  }

  // Validate number of files (max 5)
  if (req.files.length > 5) {
    throw new AppError('Maximum 5 screenshots allowed', 400);
  }

  // Check if project exists and user owns it
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only upload screenshots to your own projects', 403);
  }

  const uploadedFiles = [];
  const filePaths = [];

  try {
    // Process each file
    for (const file of req.files) {
      // Validate file size
      if (file.size > MAX_SCREENSHOT_SIZE) {
        throw new AppError('Each screenshot must be less than 5MB', 400);
      }

      // Validate file type
      if (!validateFileType(file.originalname, ALLOWED_IMAGE_TYPES)) {
        throw new AppError('Only image files are allowed for screenshots', 400);
      }

      // Generate secure filename
      const secureFilename = generateSecureFilename(file.originalname);
      const filePath = path.join(UPLOAD_DIR, 'screenshots', secureFilename);
      filePaths.push(filePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Move file to secure location
      await fs.rename(file.path, filePath);

      uploadedFiles.push({
        filename: secureFilename,
        originalName: file.originalname,
        size: file.size,
      });
    }

    // Update project with screenshot information
    const currentScreenshots = project.screenshots || [];
    const newScreenshots = uploadedFiles.map(file => file.filename);
    
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        screenshots: [...currentScreenshots, ...newScreenshots],
      },
    });

    const response = {
      success: true,
      message: 'Screenshots uploaded successfully',
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length,
        project: updatedProject,
      },
    };

    logApiResponse(response, 'Screenshots upload successful');
    res.status(200).json(response);
  } catch (error) {
    // Clean up files if database update fails
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to clean up file:', filePath, unlinkError);
      }
    }
    throw error;
  }
});

// Download project file (authenticated)
export const downloadProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  // Get project details
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!project.mainFile) {
    throw new AppError('No file available for download', 404);
  }

  // Check if user has access to download
  const hasAccess = 
    project.sellerId === req.user.id || // Owner
    req.user.role === 'ADMIN' || // Admin
    project.status === 'APPROVED'; // Public approved project

  if (!hasAccess) {
    throw new AppError('You do not have permission to download this file', 403);
  }

  // TODO: Check if user has purchased the project (for buyers)
  // This would be implemented when payment system is ready

  const filePath = path.join(UPLOAD_DIR, 'projects', project.mainFile);

  try {
    // Check if file exists
    await fs.access(filePath);

    // Increment download count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // TODO: Log download activity
    // This would track user downloads for analytics

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${project.originalFileName || project.mainFile}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file to response
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);

    logApiResponse({ success: true }, 'File download initiated');
  } catch (error) {
    throw new AppError('File not found or corrupted', 404);
  }
});

// Get file information
export const getFileInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      mainFile: true,
      originalFileName: true,
      fileSize: true,
      screenshots: true,
      sellerId: true,
      status: true,
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check if user has access to file info
  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only view file info for your own projects', 403);
  }

  const fileInfo = {
    projectId: project.id,
    title: project.title,
    mainFile: {
      filename: project.mainFile,
      originalName: project.originalFileName,
      size: project.fileSize,
      sizeFormatted: project.fileSize ? formatFileSize(project.fileSize) : null,
    },
    screenshots: project.screenshots || [],
    screenshotCount: project.screenshots?.length || 0,
  };

  const response = {
    success: true,
    message: 'File information retrieved successfully',
    data: { fileInfo },
  };

  logApiResponse(response, 'File info retrieval successful');
  res.status(200).json(response);
});

// Delete project file
export const deleteProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;
  const { fileType } = req.body; // 'main' or 'screenshot'
  const { filename } = req.body;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete files from your own projects', 403);
  }

  try {
    if (fileType === 'main' && project.mainFile) {
      // Delete main project file
      const filePath = path.join(UPLOAD_DIR, 'projects', project.mainFile);
      await fs.unlink(filePath);

      // Update project
      await prisma.project.update({
        where: { id: projectId },
        data: {
          mainFile: null,
          originalFileName: null,
          fileSize: null,
        },
      });
    } else if (fileType === 'screenshot' && filename) {
      // Delete specific screenshot
      const filePath = path.join(UPLOAD_DIR, 'screenshots', filename);
      await fs.unlink(filePath);

      // Update project screenshots
      const currentScreenshots = project.screenshots || [];
      const updatedScreenshots = currentScreenshots.filter(s => s !== filename);
      
      await prisma.project.update({
        where: { id: projectId },
        data: {
          screenshots: updatedScreenshots,
        },
      });
    } else {
      throw new AppError('Invalid file type or filename', 400);
    }

    const response = {
      success: true,
      message: 'File deleted successfully',
      data: null,
    };

    logApiResponse(response, 'File deletion successful');
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete file', 500);
  }
});

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
