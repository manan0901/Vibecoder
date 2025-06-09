import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Default rate limit configuration
const defaultConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(defaultConfig.windowMs / 1000 / 60) + ' minutes',
    });
  },
};

// General API rate limiter
export const apiLimiter = rateLimit({
  ...defaultConfig,
  max: 100, // 100 requests per 15 minutes
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: '1 hour',
  },
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    error: 'Too many upload attempts, please try again later.',
    retryAfter: '1 hour',
  },
});

// Rate limiter for project creation
export const projectCreationLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 projects per day
  message: {
    success: false,
    error: 'Too many projects created today, please try again tomorrow.',
    retryAfter: '24 hours',
  },
});

// Rate limiter for reviews
export const reviewLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reviews per hour
  message: {
    success: false,
    error: 'Too many reviews submitted, please try again later.',
    retryAfter: '1 hour',
  },
});

// Rate limiter for search requests
export const searchLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    error: 'Too many search requests, please slow down.',
    retryAfter: '1 minute',
  },
});

// Rate limiter for payment operations
export const paymentLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 payment attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.',
    retryAfter: '15 minutes',
  },
});

// Rate limiter for download operations
export const downloadLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 download attempts per minute
  message: {
    success: false,
    error: 'Too many download attempts, please wait before trying again.',
    retryAfter: '1 minute',
  },
});

// Create custom rate limiter
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
  retryAfter: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: options.message,
      retryAfter: options.retryAfter,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: options.message,
        retryAfter: options.retryAfter,
      });
    },
  });
}
