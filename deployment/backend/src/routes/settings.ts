import { Router } from 'express';
import {
  getUserSettings,
  updateUserSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
} from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { validateRequest, userSettingsUpdateSchema } from '../middleware/validation';
import { apiLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

// Validation schemas for settings
const notificationSettingsSchema = {
  body: z.object({
    email: z.object({
      newPurchase: z.boolean().optional(),
      newSale: z.boolean().optional(),
      newReview: z.boolean().optional(),
      projectApproved: z.boolean().optional(),
      projectRejected: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
      marketingEmails: z.boolean().optional(),
    }).optional(),
    push: z.object({
      newPurchase: z.boolean().optional(),
      newSale: z.boolean().optional(),
      newReview: z.boolean().optional(),
      projectUpdates: z.boolean().optional(),
    }).optional(),
    sms: z.object({
      importantUpdates: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
    }).optional(),
  }),
};

const privacySettingsSchema = {
  body: z.object({
    profileVisibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    showLastSeen: z.boolean().optional(),
    showProjects: z.boolean().optional(),
    showReviews: z.boolean().optional(),
    allowDirectMessages: z.boolean().optional(),
    showOnlineStatus: z.boolean().optional(),
  }),
};

const generalSettingsSchema = {
  body: z.object({
    emailNotifications: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    profileVisibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    language: z.string().min(2).max(5).optional(),
    timezone: z.string().optional(),
    currency: z.string().length(3).optional(),
  }),
};

// General settings routes
router.get('/', 
  apiLimiter,
  getUserSettings
);

router.put('/', 
  apiLimiter,
  validateRequest(generalSettingsSchema),
  updateUserSettings
);

// Notification settings routes
router.get('/notifications', 
  apiLimiter,
  getNotificationSettings
);

router.put('/notifications', 
  apiLimiter,
  validateRequest(notificationSettingsSchema),
  updateNotificationSettings
);

// Privacy settings routes
router.get('/privacy', 
  apiLimiter,
  getPrivacySettings
);

router.put('/privacy', 
  apiLimiter,
  validateRequest(privacySettingsSchema),
  updatePrivacySettings
);

export default router;
