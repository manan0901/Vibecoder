import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  getUserStats,
  getUserProjects,
} from '../controllers/userController';
import { authenticate, ownerOrAdmin } from '../middleware/auth';
import { 
  validateRequest, 
  userProfileUpdateSchema, 
  userProjectsQuerySchema,
  commonSchemas 
} from '../middleware/validation';
import { uploadAvatar, handleUploadError } from '../middleware/upload';
import { apiLimiter, uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.get('/:id', 
  validateRequest({ params: commonSchemas.id }),
  getUserProfile
);

// Protected routes (require authentication)
router.use(authenticate);

// Get current user's statistics
router.get('/me/stats', 
  apiLimiter,
  getUserStats
);

// Get current user's projects
router.get('/me/projects', 
  apiLimiter,
  validateRequest(userProjectsQuerySchema),
  getUserProjects
);

// Update user profile
router.put('/me/profile', 
  apiLimiter,
  validateRequest(userProfileUpdateSchema),
  updateProfile
);

// Avatar management routes
router.post('/me/avatar', 
  uploadLimiter,
  uploadAvatar,
  handleUploadError,
  updateAvatar
);

router.delete('/me/avatar', 
  apiLimiter,
  deleteAvatar
);

// Admin routes for user management
router.get('/admin/list', 
  // TODO: Add admin middleware when implemented
  // adminOnly,
  (req, res) => {
    res.status(501).json({
      success: false,
      message: 'Admin user management not yet implemented',
    });
  }
);

export default router;
