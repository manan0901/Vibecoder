import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        firstName: string;
        lastName: string;
        isVerified: boolean;
        isActive: boolean;
      };
    }
  }
}

// Authentication middleware
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    // Verify token
    let payload: JWTPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      throw new AppError(error instanceof Error ? error.message : 'Invalid token', 401);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// Optional authentication middleware (doesn't throw error if no token)
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            isActive: true,
          },
        });

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors in optional authentication
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Role-based authorization middleware
export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
}

// Email verification middleware
export function requireEmailVerification(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (!req.user.isVerified) {
    throw new AppError('Email verification required', 403);
  }

  next();
}

// Admin only middleware
export function adminOnly(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError('Admin access required', 403);
  }

  next();
}

// Seller only middleware
export function sellerOnly(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== UserRole.SELLER && req.user.role !== UserRole.ADMIN) {
    throw new AppError('Seller access required', 403);
  }

  next();
}

// Owner or admin middleware (for resource access)
export function ownerOrAdmin(getUserId: (req: Request) => string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const resourceUserId = getUserId(req);
      
      if (req.user.role === UserRole.ADMIN || req.user.id === resourceUserId) {
        next();
      } else {
        throw new AppError('Access denied', 403);
      }
    } catch (error) {
      next(error);
    }
  };
}
