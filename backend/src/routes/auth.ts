import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  getProfile, 
  logout, 
  changePassword 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRequest, userRegistrationSchema, userLoginSchema } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// Validation schemas
const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
};

const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  }),
};

// Public routes (with rate limiting)
router.post('/register', 
  authLimiter,
  validateRequest(userRegistrationSchema),
  register
);

router.post('/login', 
  authLimiter,
  validateRequest(userLoginSchema),
  login
);

router.post('/refresh-token', 
  authLimiter,
  validateRequest(refreshTokenSchema),
  refreshToken
);

// Protected routes
router.get('/profile', 
  authenticate,
  getProfile
);

router.post('/logout', 
  authenticate,
  logout
);

router.post('/change-password', 
  authenticate,
  validateRequest(changePasswordSchema),
  changePassword
);

// TODO: Implement these endpoints in future iterations
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.get('/verify-email', verifyEmail);
// router.post('/resend-verification', resendVerification);

export default router;
