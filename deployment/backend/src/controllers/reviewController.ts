import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import {
  createReview,
  getProjectReviews,
  getReviewStatistics,
  addSellerResponse,
  markReviewHelpful,
  reportReview,
  getUserReviews,
  updateProjectRating,
} from '../services/reviewService';
import prisma from '../config/database';

// Create a new review
export const createProjectReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;
  const { rating, title, comment } = req.body;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  const review = await createReview({
    projectId,
    buyerId: req.user.id,
    rating: parseInt(rating),
    title,
    comment,
  });

  const response = {
    success: true,
    message: 'Review created successfully',
    data: { review },
  };

  logApiResponse(response, 'Review created');
  res.status(201).json(response);
});

// Get reviews for a project
export const getReviewsForProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  const { page = '1', limit = '10', sortBy = 'newest' } = req.query;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const validSortOptions = ['newest', 'oldest', 'rating_high', 'rating_low', 'helpful'];
  if (!validSortOptions.includes(sortBy as string)) {
    throw new AppError('Invalid sort option', 400);
  }

  const reviewData = await getProjectReviews(
    projectId,
    pageNum,
    limitNum,
    sortBy as 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'
  );

  const response = {
    success: true,
    message: 'Project reviews retrieved successfully',
    data: reviewData,
  };

  logApiResponse(response, 'Project reviews retrieved');
  res.status(200).json(response);
});

// Get review statistics for a project
export const getProjectReviewStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const statistics = await getReviewStatistics(projectId);

  const response = {
    success: true,
    message: 'Review statistics retrieved successfully',
    data: { statistics },
  };

  logApiResponse(response, 'Review statistics retrieved');
  res.status(200).json(response);
});

// Add seller response to a review
export const addSellerResponseToReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers can respond to reviews', 403);
  }

  const { reviewId } = req.params;
  const { response: sellerResponse } = req.body;

  if (!reviewId) {
    throw new AppError('Review ID is required', 400);
  }

  if (!sellerResponse || sellerResponse.trim().length === 0) {
    throw new AppError('Response content is required', 400);
  }

  if (sellerResponse.length > 1000) {
    throw new AppError('Response must be less than 1000 characters', 400);
  }

  const updatedReview = await addSellerResponse(reviewId, req.user.id, sellerResponse.trim());

  const response = {
    success: true,
    message: 'Seller response added successfully',
    data: { review: updatedReview },
  };

  logApiResponse(response, 'Seller response added');
  res.status(200).json(response);
});

// Mark a review as helpful
export const markAsHelpful = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { reviewId } = req.params;

  if (!reviewId) {
    throw new AppError('Review ID is required', 400);
  }

  await markReviewHelpful(reviewId, req.user.id);

  const response = {
    success: true,
    message: 'Review marked as helpful',
    data: {},
  };

  logApiResponse(response, 'Review marked as helpful');
  res.status(200).json(response);
});

// Report a review
export const reportReviewForModeration = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { reviewId } = req.params;
  const { reason } = req.body;

  if (!reviewId) {
    throw new AppError('Review ID is required', 400);
  }

  if (!reason || reason.trim().length === 0) {
    throw new AppError('Report reason is required', 400);
  }

  await reportReview(reviewId, req.user.id, reason.trim());

  const response = {
    success: true,
    message: 'Review reported for moderation',
    data: {},
  };

  logApiResponse(response, 'Review reported');
  res.status(200).json(response);
});

// Get user's own reviews
export const getMyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const reviewData = await getUserReviews(req.user.id, pageNum, limitNum);

  const response = {
    success: true,
    message: 'User reviews retrieved successfully',
    data: reviewData,
  };

  logApiResponse(response, 'User reviews retrieved');
  res.status(200).json(response);
});

// Check if user can review a project
export const checkReviewEligibility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  try {
    // Check if user has purchased the project
    const purchase = await prisma.transaction.findFirst({
      where: {
        projectId,
        buyerId: req.user.id,
        status: 'COMPLETED',
        type: 'PURCHASE',
      },
    });

    const hasPurchased = !!purchase;

    // Check if user has already reviewed
    const existingReview = await prisma.review.findUnique({
      where: {
        projectId_buyerId: {
          projectId,
          buyerId: req.user.id,
        },
      },
    });

    const hasReviewed = !!existingReview;

    const response = {
      success: true,
      message: 'Review eligibility checked',
      data: {
        canReview: hasPurchased && !hasReviewed,
        hasPurchased,
        hasReviewed,
        existingReview: hasReviewed ? {
          id: existingReview.id,
          rating: existingReview.rating,
          title: existingReview.title,
          comment: existingReview.comment,
          createdAt: existingReview.createdAt.toISOString(),
        } : null,
      },
    };

    logApiResponse(response, 'Review eligibility checked');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    throw new AppError('Failed to check review eligibility', 500);
  }
});

// Update a review (only by the reviewer)
export const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;

  if (!reviewId) {
    throw new AppError('Review ID is required', 400);
  }

  if (rating && (rating < 1 || rating > 5)) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  try {
    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new AppError('Review not found', 404);
    }

    if (existingReview.buyerId !== req.user.id) {
      throw new AppError('You can only update your own reviews', 403);
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(title !== undefined && { title }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update project rating if rating changed
    if (rating && rating !== existingReview.rating) {
      await updateProjectRating(existingReview.projectId);
    }

    const response = {
      success: true,
      message: 'Review updated successfully',
      data: {
        review: {
          id: updatedReview.id,
          projectId: updatedReview.projectId,
          rating: updatedReview.rating,
          title: updatedReview.title,
          comment: updatedReview.comment,
          isVerified: updatedReview.isVerified,
          isHelpful: updatedReview.isHelpful,
          sellerResponse: updatedReview.sellerResponse,
          sellerResponseAt: updatedReview.sellerResponseAt?.toISOString(),
          buyer: updatedReview.buyer,
          createdAt: updatedReview.createdAt.toISOString(),
          updatedAt: updatedReview.updatedAt.toISOString(),
        },
      },
    };

    logApiResponse(response, 'Review updated');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error updating review:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update review', 500);
  }
});

// Delete a review (only by the reviewer or admin)
export const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { reviewId } = req.params;

  if (!reviewId) {
    throw new AppError('Review ID is required', 400);
  }

  try {
    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new AppError('Review not found', 404);
    }

    // Check permissions
    if (existingReview.buyerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('You can only delete your own reviews', 403);
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update project rating
    await updateProjectRating(existingReview.projectId);

    const response = {
      success: true,
      message: 'Review deleted successfully',
      data: {},
    };

    logApiResponse(response, 'Review deleted');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error deleting review:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete review', 500);
  }
});
