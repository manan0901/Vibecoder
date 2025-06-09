import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/avatars',
  'uploads/projects',
  'uploads/documents',
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File type validation
const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedDocumentTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
];
const allowedProjectTypes = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/gzip',
  'application/x-tar',
];

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${timestamp}${ext}`);
  },
});

// Storage configuration for project files
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects/');
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `project-${userId}-${timestamp}-${sanitizedName}`);
  },
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `doc-${userId}-${timestamp}-${sanitizedName}`);
  },
});

// File filter for avatars
const avatarFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP images are allowed for avatars.', 400));
  }
};

// File filter for project files
const projectFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedProjectTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only ZIP, RAR, 7Z, TAR, and GZIP files are allowed for projects.', 400));
  }
};

// File filter for documents
const documentFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedDocumentTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed for documents.', 400));
  }
};

// Avatar upload middleware
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
    files: 1,
  },
}).single('avatar');

// Project file upload middleware
export const uploadProjectFile = multer({
  storage: projectStorage,
  fileFilter: projectFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000'), // 500MB default
    files: 1,
  },
}).single('projectFile');

// Multiple project screenshots upload
export const uploadProjectScreenshots = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/projects/screenshots/');
    },
    filename: (req, file, cb) => {
      const userId = (req as any).user?.id || 'anonymous';
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `screenshot-${userId}-${timestamp}-${Math.random().toString(36).substr(2, 9)}${ext}`);
    },
  }),
  fileFilter: avatarFileFilter, // Same as avatar filter (images only)
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per screenshot
    files: 5, // Maximum 5 screenshots
  },
}).array('screenshots', 5);

// Document upload middleware
export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for documents
    files: 1,
  },
}).single('document');

// Generic file upload error handler
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large',
          message: 'The uploaded file exceeds the maximum allowed size.',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files',
          message: 'You can only upload a limited number of files at once.',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field',
          message: 'The file field name is not expected.',
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'Upload error',
          message: error.message,
        });
    }
  }
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
};

// Utility function to delete uploaded file
export const deleteUploadedFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Utility function to get file URL
export const getFileUrl = (filename: string, type: 'avatar' | 'project' | 'document' | 'screenshot'): string => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${type}s/${filename}`;
};

// Additional upload middleware aliases for file controller
export const uploadProjectFileMiddleware = uploadProjectFile;
export const uploadProjectScreenshotsMiddleware = uploadProjectScreenshots;
