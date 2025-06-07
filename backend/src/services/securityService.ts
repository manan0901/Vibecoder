import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

// Security configuration
export const SECURITY_CONFIG = {
  // Password policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Session security
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  
  // File upload security
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'text/plain',
    ],
    maxFiles: 10,
  },
};

// Security utilities
export class SecurityService {
  
  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Generate CSRF token
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }
  
  // Validate CSRF token
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(token, 'base64'),
      Buffer.from(sessionToken, 'base64')
    );
  }
  
  // Hash password securely
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
  
  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  
  // Validate password strength
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.password;
    
    if (password.length < config.minLength) {
      errors.push(`Password must be at least ${config.minLength} characters long`);
    }
    
    if (password.length > config.maxLength) {
      errors.push(`Password must be no more than ${config.maxLength} characters long`);
    }
    
    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    const weakPatterns = [
      /^(.)\1+$/, // All same character
      /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
      /^(password|123456|qwerty|admin|login|welcome)/i,
    ];
    
    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains common weak patterns');
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
      .trim();
  }
  
  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  // Validate file upload
  static validateFileUpload(file: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.upload;
    
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }
    
    // Check file size
    if (file.size > config.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${config.maxFileSize / 1024 / 1024}MB`);
    }
    
    // Check MIME type
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }
    
    // Check for malicious file extensions
    const maliciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (maliciousExtensions.includes(fileExtension)) {
      errors.push('File extension is not allowed for security reasons');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  // Generate secure filename
  static generateSecureFilename(originalName: string): string {
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${timestamp}_${randomString}${extension}`;
  }
  
  // Check for SQL injection patterns
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|'|"|`)/,
      /(\bOR\b|\bAND\b).*?[=<>]/i,
      /\b(WAITFOR|DELAY)\b/i,
      /\b(XP_|SP_)\w+/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  // Rate limiting for specific actions
  static createActionRateLimit(action: string, maxAttempts: number, windowMs: number) {
    return rateLimit({
      windowMs,
      max: maxAttempts,
      keyGenerator: (req: Request) => {
        return `${action}:${req.ip}:${req.user?.id || 'anonymous'}`;
      },
      message: {
        success: false,
        error: `Too many ${action} attempts. Please try again later.`,
        retryAfter: Math.ceil(windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
  
  // Security audit log
  static logSecurityEvent(event: {
    type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'PASSWORD_CHANGE' | 'ACCOUNT_LOCKED' | 'SUSPICIOUS_ACTIVITY' | 'FILE_UPLOAD' | 'PERMISSION_DENIED';
    userId?: string;
    ip: string;
    userAgent?: string;
    details?: any;
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };
    
    // In production, this should be sent to a secure logging service
    console.log('🔒 Security Event:', JSON.stringify(logEntry));
    
    // For critical events, you might want to send alerts
    if (['ACCOUNT_LOCKED', 'SUSPICIOUS_ACTIVITY'].includes(event.type)) {
      console.warn('🚨 Critical Security Event:', JSON.stringify(logEntry));
    }
  }
  
  // Check for suspicious patterns
  static detectSuspiciousActivity(req: Request): boolean {
    const suspiciousPatterns = [
      // Too many different endpoints in short time
      // Unusual user agent strings
      /bot|crawler|spider|scraper/i.test(req.get('User-Agent') || ''),
      
      // Suspicious query parameters
      /(\.\.|\/etc\/|\/proc\/|\/sys\/)/i.test(req.originalUrl),
      
      // Common attack patterns in URL
      /(union|select|insert|delete|drop|create|alter|exec|script)/i.test(req.originalUrl),
    ];
    
    return suspiciousPatterns.some(pattern => 
      typeof pattern === 'boolean' ? pattern : pattern.test(req.originalUrl)
    );
  }
  
  // Validate JWT token structure (basic check)
  static validateJWTStructure(token: string): boolean {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Check if each part is valid base64
      parts.forEach(part => {
        Buffer.from(part, 'base64');
      });
      return true;
    } catch {
      return false;
    }
  }
  
  // Generate security headers
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
    };
  }
}

// Account lockout tracking (in production, use Redis or database)
const accountLockouts = new Map<string, { attempts: number; lockedUntil?: Date }>();

export class AccountSecurityService {
  
  // Track failed login attempt
  static trackFailedLogin(identifier: string): boolean {
    const config = SECURITY_CONFIG.password;
    const current = accountLockouts.get(identifier) || { attempts: 0 };
    
    current.attempts += 1;
    
    if (current.attempts >= config.maxAttempts) {
      current.lockedUntil = new Date(Date.now() + config.lockoutDuration);
      accountLockouts.set(identifier, current);
      return true; // Account is now locked
    }
    
    accountLockouts.set(identifier, current);
    return false; // Account not locked yet
  }
  
  // Check if account is locked
  static isAccountLocked(identifier: string): boolean {
    const lockout = accountLockouts.get(identifier);
    
    if (!lockout || !lockout.lockedUntil) {
      return false;
    }
    
    if (new Date() > lockout.lockedUntil) {
      // Lockout expired, reset
      accountLockouts.delete(identifier);
      return false;
    }
    
    return true;
  }
  
  // Reset failed attempts on successful login
  static resetFailedAttempts(identifier: string): void {
    accountLockouts.delete(identifier);
  }
  
  // Get remaining lockout time
  static getRemainingLockoutTime(identifier: string): number {
    const lockout = accountLockouts.get(identifier);
    
    if (!lockout || !lockout.lockedUntil) {
      return 0;
    }
    
    const remaining = lockout.lockedUntil.getTime() - Date.now();
    return Math.max(0, remaining);
  }
}

export default SecurityService;
