import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Interface for review creation
export interface CreateReviewData {
  projectId: string;
  buyerId: string;
  rating: number;
  title?: string;
  comment?: string;
}

// Interface for review response
export interface ReviewResponse {
  id: string;
  projectId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isHelpful: number;
  sellerResponse?: string;
  sellerResponseAt?: string;
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface for review statistics
export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  helpfulReviews: number;
}

// Create a new review
export const createReview = async (reviewData: CreateReviewData): Promise<ReviewResponse> => {
  try {
    const { projectId, buyerId, rating, title, comment } = reviewData;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if user has purchased the project
    const purchase = await prisma.transaction.findFirst({
      where: {
        projectId,
        buyerId,
        status: 'COMPLETED',
        type: 'PURCHASE',
      },
    });

    if (!purchase) {
      throw new AppError('You can only review projects you have purchased', 403);
    }

    // Check if user has already reviewed this project
    const existingReview = await prisma.review.findUnique({
      where: {
        projectId_buyerId: {
          projectId,
          buyerId,
        },
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this project', 409);
    }

    // Get project seller
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { sellerId: true },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        projectId,
        buyerId,
        sellerId: project.sellerId,
        rating,
        title,
        comment,
        isVerified: true, // Verified since we checked purchase
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

    // Update project rating
    await updateProjectRating(projectId);

    return {
      id: review.id,
      projectId: review.projectId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      isHelpful: review.isHelpful,
      sellerResponse: review.sellerResponse,
      sellerResponseAt: review.sellerResponseAt?.toISOString(),
      buyer: review.buyer,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };

  } catch (error) {
    console.error('Error creating review:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create review', 500);
  }
};

// Get reviews for a project
export const getProjectReviews = async (
  projectId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful' = 'newest'
): Promise<{
  reviews: ReviewResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: ReviewStatistics;
}> => {
  try {
    const skip = (page - 1) * limit;

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'rating_high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating_low':
        orderBy = { rating: 'asc' };
        break;
      case 'helpful':
        orderBy = { isHelpful: 'desc' };
        break;
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { projectId },
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { projectId },
      }),
    ]);

    // Get review statistics
    const statistics = await getReviewStatistics(projectId);

    const reviewResponses: ReviewResponse[] = reviews.map(review => ({
      id: review.id,
      projectId: review.projectId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      isHelpful: review.isHelpful,
      sellerResponse: review.sellerResponse,
      sellerResponseAt: review.sellerResponseAt?.toISOString(),
      buyer: review.buyer,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));

    return {
      reviews: reviewResponses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics,
    };

  } catch (error) {
    console.error('Error getting project reviews:', error);
    throw new AppError('Failed to get project reviews', 500);
  }
};

// Get review statistics for a project
export const getReviewStatistics = async (projectId: string): Promise<ReviewStatistics> => {
  try {
    // Get all reviews for the project
    const reviews = await prisma.review.findMany({
      where: { projectId },
      select: {
        rating: true,
        isVerified: true,
        isHelpful: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length,
    };

    const verifiedReviews = reviews.filter(r => r.isVerified).length;
    const helpfulReviews = reviews.filter(r => r.isHelpful > 0).length;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      ratingDistribution,
      verifiedReviews,
      helpfulReviews,
    };

  } catch (error) {
    console.error('Error getting review statistics:', error);
    throw new AppError('Failed to get review statistics', 500);
  }
};

// Update project rating based on reviews
export const updateProjectRating = async (projectId: string): Promise<void> => {
  try {
    const statistics = await getReviewStatistics(projectId);

    await prisma.project.update({
      where: { id: projectId },
      data: {
        rating: statistics.averageRating,
        reviewCount: statistics.totalReviews,
      },
    });

  } catch (error) {
    console.error('Error updating project rating:', error);
    // Don't throw error here as this is a background operation
  }
};

// Add seller response to review
export const addSellerResponse = async (
  reviewId: string,
  sellerId: string,
  response: string
): Promise<ReviewResponse> => {
  try {
    // Verify the seller owns the project
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        project: {
          select: { sellerId: true },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.project.sellerId !== sellerId) {
      throw new AppError('You can only respond to reviews of your own projects', 403);
    }

    if (review.sellerResponse) {
      throw new AppError('You have already responded to this review', 409);
    }

    // Update review with seller response
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        sellerResponse: response,
        sellerResponseAt: new Date(),
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

    return {
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
    };

  } catch (error) {
    console.error('Error adding seller response:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to add seller response', 500);
  }
};

// Mark review as helpful
export const markReviewHelpful = async (reviewId: string, userId: string): Promise<void> => {
  try {
    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Increment helpful count
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        isHelpful: {
          increment: 1,
        },
      },
    });

  } catch (error) {
    console.error('Error marking review as helpful:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to mark review as helpful', 500);
  }
};

// Report review for moderation
export const reportReview = async (reviewId: string, reporterId: string, reason: string): Promise<void> => {
  try {
    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Mark review as reported
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        isReported: true,
      },
    });

    // Log the report (in a real implementation, you'd create a separate reports table)
    console.log(`Review ${reviewId} reported by user ${reporterId} for: ${reason}`);

  } catch (error) {
    console.error('Error reporting review:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to report review', 500);
  }
};

// Get user's reviews (reviews they've written)
export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  reviews: Array<ReviewResponse & { project: { id: string; title: string } }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { buyerId: userId },
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { buyerId: userId },
      }),
    ]);

    const reviewResponses = reviews.map(review => ({
      id: review.id,
      projectId: review.projectId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      isHelpful: review.isHelpful,
      sellerResponse: review.sellerResponse,
      sellerResponseAt: review.sellerResponseAt?.toISOString(),
      buyer: review.buyer,
      project: review.project,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));

    return {
      reviews: reviewResponses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw new AppError('Failed to get user reviews', 500);
  }
};
