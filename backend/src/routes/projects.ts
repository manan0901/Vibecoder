import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getSellerProjects,
  updateProjectStatus,
  submitProjectForReview,
  getProjectAnalytics,
} from '../controllers/projectController';
import { authenticate, sellerOnly, ownerOrAdmin } from '../middleware/auth';
import {
  validateRequest,
  projectCreationSchema,
  commonSchemas
} from '../middleware/validation';
import { z } from 'zod';
import { 
  uploadProjectFile, 
  uploadProjectScreenshots, 
  handleUploadError 
} from '../middleware/upload';
import {
  apiLimiter,
  projectCreationLimiter,
  uploadLimiter,
  searchLimiter
} from '../middleware/rateLimiter';
import { projectListCache, projectDetailsCache, searchCache } from '../middleware/cache';

const router = Router();

// Public routes
router.get('/',
  searchLimiter,
  projectListCache,
  getProjects
);

router.get('/:id',
  apiLimiter,
  projectDetailsCache,
  validateRequest({ params: commonSchemas.id }),
  getProject
);

// Protected routes (require authentication)
router.use(authenticate);

// Create new project (sellers only)
router.post('/', 
  projectCreationLimiter,
  sellerOnly,
  validateRequest(projectCreationSchema),
  createProject
);

// Update project (owner or admin only)
router.put('/:id', 
  apiLimiter,
  validateRequest({ 
    params: commonSchemas.id,
    body: projectCreationSchema.body.partial() // Allow partial updates
  }),
  ownerOrAdmin((req) => {
    // This will be checked in the controller
    return req.params.id;
  }),
  updateProject
);

// Delete project (owner or admin only)
router.delete('/:id', 
  apiLimiter,
  validateRequest({ params: commonSchemas.id }),
  ownerOrAdmin((req) => {
    // This will be checked in the controller
    return req.params.id;
  }),
  deleteProject
);

// Upload project file
router.post('/:id/upload-file', 
  uploadLimiter,
  validateRequest({ params: commonSchemas.id }),
  uploadProjectFile,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      // TODO: Update project with file information
      // This would typically update the project's mainFile field
      
      res.status(200).json({
        success: true,
        message: 'Project file uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          path: req.file.path,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'File upload failed',
      });
    }
  }
);

// Upload project screenshots
router.post('/:id/upload-screenshots', 
  uploadLimiter,
  validateRequest({ params: commonSchemas.id }),
  uploadProjectScreenshots,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No screenshots uploaded',
        });
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        path: file.path,
      }));

      // TODO: Update project with screenshot information
      // This would typically update the project's screenshots field
      
      res.status(200).json({
        success: true,
        message: 'Screenshots uploaded successfully',
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Screenshot upload failed',
      });
    }
  }
);

// Get seller's projects
router.get('/my-projects',
  apiLimiter,
  getSellerProjects
);

// Submit project for review
router.post('/:id/submit',
  apiLimiter,
  validateRequest({ params: commonSchemas.id }),
  submitProjectForReview
);

// Update project status (admin only)
router.patch('/:id/status',
  apiLimiter,
  validateRequest({
    params: commonSchemas.id,
    body: z.object({
      status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']),
      rejectionReason: z.string().optional(),
    })
  }),
  updateProjectStatus
);

// Get project analytics
router.get('/:id/analytics',
  apiLimiter,
  validateRequest({ params: commonSchemas.id }),
  getProjectAnalytics
);

export default router;
