import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';
import SecurityService, { AccountSecurityService, SECURITY_CONFIG } from '../services/securityService';

// CSRF Protection Middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API endpoints that use JWT authentication
  if (req.path.startsWith('/api/') && req.headers.authorization) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = (req.session as any)?.csrfToken;

  if (!SecurityService.validateCSRFToken(token, sessionToken)) {
    SecurityService.logSecurityEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      details: { reason: 'Invalid CSRF token', path: req.path },
    });

    throw new AppError('Invalid CSRF token', 403);
  }

  next();
};

// Input Sanitization Middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Recursive object sanitization
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return SecurityService.sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[SecurityService.sanitizeInput(key)] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

// SQL Injection Detection Middleware
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const checkForSQLInjection = (obj: any, path: string = ''): void => {
    if (typeof obj === 'string') {
      if (SecurityService.detectSQLInjection(obj)) {
        SecurityService.logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          details: { 
            reason: 'SQL injection attempt detected',
            path: req.path,
            field: path,
            value: obj.substring(0, 100) // Log first 100 chars only
          },
        });

        throw new AppError('Invalid input detected', 400);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => checkForSQLInjection(item, `${path}[${index}]`));
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => 
        checkForSQLInjection(value, path ? `${path}.${key}` : key)
      );
    }
  };

  // Check all input sources
  checkForSQLInjection(req.body, 'body');
  checkForSQLInjection(req.query, 'query');
  checkForSQLInjection(req.params, 'params');

  next();
};

// Suspicious Activity Detection Middleware
export const suspiciousActivityDetection = (req: Request, res: Response, next: NextFunction) => {
  if (SecurityService.detectSuspiciousActivity(req)) {
    SecurityService.logSecurityEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      details: { 
        reason: 'Suspicious request pattern detected',
        path: req.path,
        method: req.method,
      },
    });

    // For now, just log and continue. In production, you might want to block or challenge
    console.warn(`🚨 Suspicious activity detected from ${req.ip}: ${req.method} ${req.path}`);
  }

  next();
};

// Account Lockout Middleware
export const accountLockoutProtection = (req: Request, res: Response, next: NextFunction) => {
  // Only apply to login endpoints
  if (!req.path.includes('/login') && !req.path.includes('/auth')) {
    return next();
  }

  const identifier = req.body.email || req.body.username || req.ip;
  
  if (AccountSecurityService.isAccountLocked(identifier)) {
    const remainingTime = AccountSecurityService.getRemainingLockoutTime(identifier);
    const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));

    SecurityService.logSecurityEvent({
      type: 'PERMISSION_DENIED',
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      details: { 
        reason: 'Account locked due to too many failed attempts',
        identifier,
        remainingTime: remainingMinutes,
      },
    });

    throw new AppError(
      `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      423 // Locked status code
    );
  }

  next();
};

// Security Headers Middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  const headers = SecurityService.getSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Add additional security headers based on environment
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

// File Upload Security Middleware
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files ? (Array.isArray(req.files) ? req.files : [req.file]) : [req.file];

  for (const file of files) {
    if (file) {
      const validation = SecurityService.validateFileUpload(file);
      
      if (!validation.isValid) {
        SecurityService.logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          details: { 
            reason: 'Invalid file upload attempt',
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            errors: validation.errors,
          },
        });

        throw new AppError(`File upload failed: ${validation.errors.join(', ')}`, 400);
      }

      // Generate secure filename
      file.secureFilename = SecurityService.generateSecureFilename(file.originalname);
    }
  }

  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = SecurityService.createActionRateLimit('auth', 5, 15 * 60 * 1000);

// Rate limiting for password reset
export const passwordResetRateLimit = SecurityService.createActionRateLimit('password_reset', 3, 60 * 60 * 1000);

// Rate limiting for file uploads
export const uploadRateLimit = SecurityService.createActionRateLimit('upload', 10, 60 * 1000);

// JWT Token Validation Middleware
export const validateJWTStructure = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    if (!SecurityService.validateJWTStructure(token)) {
      SecurityService.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { 
          reason: 'Invalid JWT token structure',
          path: req.path,
        },
      });

      throw new AppError('Invalid token format', 401);
    }
  }

  next();
};

// Password Strength Validation Middleware
export const validatePasswordStrength = (req: Request, res: Response, next: NextFunction) => {
  // Only apply to endpoints that involve password setting/changing
  const passwordFields = ['password', 'newPassword'];
  
  for (const field of passwordFields) {
    if (req.body[field]) {
      const validation = SecurityService.validatePassword(req.body[field]);
      
      if (!validation.isValid) {
        throw new AppError(`Password validation failed: ${validation.errors.join(', ')}`, 400);
      }
    }
  }

  next();
};

// Security Audit Logging Middleware
export const securityAuditLog = (req: Request, res: Response, next: NextFunction) => {
  // Log security-sensitive operations
  const sensitiveEndpoints = [
    '/api/auth/',
    '/api/admin/',
    '/api/users/',
    '/api/payments/',
  ];

  const isSensitive = sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint));

  if (isSensitive) {
    SecurityService.logSecurityEvent({
      type: 'LOGIN_ATTEMPT', // This would be more specific in real implementation
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
      },
    });
  }

  next();
};

// Content Type Validation Middleware
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.get('Content-Type');
      
      if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
        throw new AppError('Invalid content type', 415);
      }
    }

    next();
  };
};

// Request Size Limiting Middleware
export const requestSizeLimit = (maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      throw new AppError('Request entity too large', 413);
    }

    next();
  };
};
