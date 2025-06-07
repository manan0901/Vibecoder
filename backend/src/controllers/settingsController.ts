import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';

// We'll extend the User model with settings in a future migration
// For now, we'll create a separate UserSettings model concept

interface UserSettings {
  userId: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  profileVisibility: 'PUBLIC' | 'PRIVATE';
  showEmail: boolean;
  showPhone: boolean;
  language: string;
  timezone: string;
  currency: string;
}

// Get user settings
export const getUserSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // For now, we'll return default settings since we haven't created the settings table yet
  // In a real implementation, this would fetch from a UserSettings table
  const defaultSettings: UserSettings = {
    userId: req.user.id,
    emailNotifications: true,
    marketingEmails: false,
    profileVisibility: 'PUBLIC',
    showEmail: false,
    showPhone: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
  };

  const response = {
    success: true,
    message: 'User settings retrieved successfully',
    data: { settings: defaultSettings },
  };

  logApiResponse(response, 'User settings retrieval successful');
  res.status(200).json(response);
});

// Update user settings
export const updateUserSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const {
    emailNotifications,
    marketingEmails,
    profileVisibility,
    showEmail,
    showPhone,
    language,
    timezone,
    currency,
  } = req.body;

  // For now, we'll just return the updated settings
  // In a real implementation, this would update the UserSettings table
  const updatedSettings: UserSettings = {
    userId: req.user.id,
    emailNotifications: emailNotifications ?? true,
    marketingEmails: marketingEmails ?? false,
    profileVisibility: profileVisibility ?? 'PUBLIC',
    showEmail: showEmail ?? false,
    showPhone: showPhone ?? false,
    language: language ?? 'en',
    timezone: timezone ?? 'Asia/Kolkata',
    currency: currency ?? 'INR',
  };

  const response = {
    success: true,
    message: 'User settings updated successfully',
    data: { settings: updatedSettings },
  };

  logApiResponse(response, 'User settings update successful');
  res.status(200).json(response);
});

// Get notification preferences
export const getNotificationSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Default notification settings
  const notificationSettings = {
    email: {
      newPurchase: true,
      newSale: true,
      newReview: true,
      projectApproved: true,
      projectRejected: true,
      weeklyDigest: false,
      marketingEmails: false,
    },
    push: {
      newPurchase: true,
      newSale: true,
      newReview: false,
      projectUpdates: true,
    },
    sms: {
      importantUpdates: false,
      securityAlerts: true,
    },
  };

  const response = {
    success: true,
    message: 'Notification settings retrieved successfully',
    data: { notifications: notificationSettings },
  };

  logApiResponse(response, 'Notification settings retrieval successful');
  res.status(200).json(response);
});

// Update notification preferences
export const updateNotificationSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { email, push, sms } = req.body;

  // Validate notification settings structure
  if (email && typeof email !== 'object') {
    throw new AppError('Invalid email notification settings format', 400);
  }

  if (push && typeof push !== 'object') {
    throw new AppError('Invalid push notification settings format', 400);
  }

  if (sms && typeof sms !== 'object') {
    throw new AppError('Invalid SMS notification settings format', 400);
  }

  // For now, we'll just return the updated settings
  // In a real implementation, this would update the notification preferences in the database
  const updatedNotifications = {
    email: {
      newPurchase: email?.newPurchase ?? true,
      newSale: email?.newSale ?? true,
      newReview: email?.newReview ?? true,
      projectApproved: email?.projectApproved ?? true,
      projectRejected: email?.projectRejected ?? true,
      weeklyDigest: email?.weeklyDigest ?? false,
      marketingEmails: email?.marketingEmails ?? false,
    },
    push: {
      newPurchase: push?.newPurchase ?? true,
      newSale: push?.newSale ?? true,
      newReview: push?.newReview ?? false,
      projectUpdates: push?.projectUpdates ?? true,
    },
    sms: {
      importantUpdates: sms?.importantUpdates ?? false,
      securityAlerts: sms?.securityAlerts ?? true,
    },
  };

  const response = {
    success: true,
    message: 'Notification settings updated successfully',
    data: { notifications: updatedNotifications },
  };

  logApiResponse(response, 'Notification settings update successful');
  res.status(200).json(response);
});

// Get privacy settings
export const getPrivacySettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Default privacy settings
  const privacySettings = {
    profileVisibility: 'PUBLIC',
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    showProjects: true,
    showReviews: true,
    allowDirectMessages: true,
    showOnlineStatus: false,
  };

  const response = {
    success: true,
    message: 'Privacy settings retrieved successfully',
    data: { privacy: privacySettings },
  };

  logApiResponse(response, 'Privacy settings retrieval successful');
  res.status(200).json(response);
});

// Update privacy settings
export const updatePrivacySettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const {
    profileVisibility,
    showEmail,
    showPhone,
    showLastSeen,
    showProjects,
    showReviews,
    allowDirectMessages,
    showOnlineStatus,
  } = req.body;

  // Validate profile visibility
  if (profileVisibility && !['PUBLIC', 'PRIVATE'].includes(profileVisibility)) {
    throw new AppError('Invalid profile visibility setting', 400);
  }

  // Updated privacy settings
  const updatedPrivacy = {
    profileVisibility: profileVisibility ?? 'PUBLIC',
    showEmail: showEmail ?? false,
    showPhone: showPhone ?? false,
    showLastSeen: showLastSeen ?? true,
    showProjects: showProjects ?? true,
    showReviews: showReviews ?? true,
    allowDirectMessages: allowDirectMessages ?? true,
    showOnlineStatus: showOnlineStatus ?? false,
  };

  const response = {
    success: true,
    message: 'Privacy settings updated successfully',
    data: { privacy: updatedPrivacy },
  };

  logApiResponse(response, 'Privacy settings update successful');
  res.status(200).json(response);
});
