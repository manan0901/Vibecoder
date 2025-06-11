import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import SecurityService, { AccountSecurityService } from '../services/securityService';

// Register user
export const register = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, firstName, lastName, role = UserRole.BUYER, phone } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new AppError(`Password validation failed: ${passwordValidation.errors.join(', ')}`, 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const response = {
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      tokens,
    },
  };

  logApiResponse(response, 'User registration successful');
  res.status(201).json(response);
});

// Login user
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const identifier = email.toLowerCase();

  // Check if account is locked
  if (AccountSecurityService.isAccountLocked(identifier)) {
    const remainingTime = AccountSecurityService.getRemainingLockoutTime(identifier);
    const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));

    SecurityService.logSecurityEvent({
      type: 'PERMISSION_DENIED',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: {
        reason: 'Account locked due to too many failed attempts',
        identifier,
        remainingTime: remainingMinutes,
      },
    });

    throw new AppError(
      `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      423
    );
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: identifier },
  });

  if (!user) {
    // Track failed login attempt
    const isLocked = AccountSecurityService.trackFailedLogin(identifier);

    SecurityService.logSecurityEvent({
      type: 'LOGIN_FAILURE',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: {
        reason: 'User not found',
        identifier,
        isLocked,
      },
    });

    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    SecurityService.logSecurityEvent({
      type: 'LOGIN_FAILURE',
      userId: user.id,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: {
        reason: 'Account deactivated',
        identifier,
      },
    });

    throw new AppError('Account is deactivated', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    // Track failed login attempt
    const isLocked = AccountSecurityService.trackFailedLogin(identifier);

    SecurityService.logSecurityEvent({
      type: 'LOGIN_FAILURE',
      userId: user.id,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: {
        reason: 'Invalid password',
        identifier,
        isLocked,
      },
    });

    if (isLocked) {
      SecurityService.logSecurityEvent({
        type: 'ACCOUNT_LOCKED',
        userId: user.id,
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent'),
        details: {
          reason: 'Too many failed login attempts',
          identifier,
        },
      });
    }

    throw new AppError('Invalid email or password', 401);
  }

  // Reset failed attempts on successful login
  AccountSecurityService.resetFailedAttempts(identifier);

  // Log successful login
  SecurityService.logSecurityEvent({
    type: 'LOGIN_SUCCESS',
    userId: user.id,
    ip: req.ip || 'unknown',
    userAgent: req.get('User-Agent'),
    details: {
      identifier,
      loginTime: new Date().toISOString(),
    },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  const response = {
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      tokens,
    },
  };

  logApiResponse(response, 'User login successful');
  res.status(200).json(response);
});

// Refresh token
export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Find user
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

  // Generate new tokens
  const tokens = generateTokens(user);

  const response = {
    success: true,
    message: 'Token refreshed successfully',
    data: {
      user,
      tokens,
    },
  };

  logApiResponse(response, 'Token refresh successful');
  res.status(200).json(response);
});

// Get current user profile
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Get full user profile
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      phone: true,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response = {
    success: true,
    message: 'Profile retrieved successfully',
    data: { user },
  };

  logApiResponse(response, 'Profile retrieval successful');
  res.status(200).json(response);
});

// Logout user (client-side token removal)
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // In a more advanced implementation, you might want to blacklist the token
  // For now, we'll just return a success response
  // The client should remove the token from storage

  const response = {
    success: true,
    message: 'Logout successful',
    data: null,
  };

  logApiResponse(response, 'User logout successful');
  res.status(200).json(response);
});

// Change password
export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Validate new password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new AppError(`Password validation failed: ${passwordValidation.errors.join(', ')}`, 400);
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  // Log password change
  SecurityService.logSecurityEvent({
    type: 'PASSWORD_CHANGE',
    userId: user.id,
    ip: req.ip || 'unknown',
    userAgent: req.get('User-Agent'),
    details: {
      changeTime: new Date().toISOString(),
    },
  });

  const response = {
    success: true,
    message: 'Password changed successfully',
    data: null,
  };

  logApiResponse(response, 'Password change successful');
  res.status(200).json(response);
});
