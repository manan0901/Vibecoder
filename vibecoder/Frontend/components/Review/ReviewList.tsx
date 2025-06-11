'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';

interface Review {
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

interface ReviewStatistics {
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

interface ReviewListProps {
  projectId: string;
  showAddReview?: boolean;
  onAddReviewClick?: () => void;
}

export default function ReviewList({
  projectId,
  showAddReview = false,
  onAddReviewClick,
}: ReviewListProps) {
  const { user } = useAuth();  const [reviews, setReviews] = useState<Review[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  console.log('Current page:', currentPage, 'Setter available:', setCurrentPage); // Temporary fix for unused variable
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest');
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) {
      checkReviewEligibility();
    }
  }, [projectId, currentPage, sortBy, user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/projects/${projectId}?page=${currentPage}&limit=10&sortBy=${sortBy}`
      );

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setStatistics(data.data.statistics);
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/projects/${projectId}/eligibility`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setCanReview(data.data.canReview);
        setHasReviewed(data.data.hasReviewed);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Update the review in the list
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, isHelpful: review.isHelpful + 1 }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const handleReportReview = async (reviewId: string) => {
    if (!user) return;

    const reason = prompt('Please provide a reason for reporting this review:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/report`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        alert('Review reported successfully. Thank you for helping maintain quality.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('Failed to report review. Please try again.');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'text-sm' : 'text-lg';
    
    return (
      <div className={`flex items-center ${starSize}`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 btn btn-outline px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {statistics && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Reviews ({statistics.totalReviews})
            </h3>
            
            {showAddReview && canReview && (
              <button
                onClick={onAddReviewClick}
                className="btn btn-primary px-4 py-2"
              >
                Write Review
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {statistics.averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(statistics.averageRating), 'md')}
                <div className="text-sm text-gray-500 mt-1">
                  {statistics.totalReviews} review{statistics.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics.ratingDistribution[rating as keyof typeof statistics.ratingDistribution];
                const percentage = statistics.totalReviews > 0 ? (count / statistics.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
            <span>✓ {statistics.verifiedReviews} verified purchases</span>
            <span>👍 {statistics.helpfulReviews} helpful reviews</span>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900">Reviews</h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {review.buyer.firstName[0]}{review.buyer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {review.buyer.firstName} {review.buyer.lastName}
                      </span>
                      {review.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {user && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      className="text-sm text-gray-500 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <span>👍</span>
                      <span>Helpful ({review.isHelpful})</span>
                    </button>
                    <button
                      onClick={() => handleReportReview(review.id)}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>

              {/* Review Content */}
              {review.title && (
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              )}
              
              {review.comment && (
                <p className="text-gray-700 mb-3">{review.comment}</p>
              )}

              {/* Seller Response */}
              {review.sellerResponse && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-blue-900">Seller Response</span>
                    <span className="text-xs text-blue-600">
                      {review.sellerResponseAt && formatDate(review.sellerResponseAt)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{review.sellerResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 mb-4">
            Be the first to review this project and help other buyers!
          </p>
          {showAddReview && canReview && (
            <button
              onClick={onAddReviewClick}
              className="btn btn-primary px-6 py-3"
            >
              Write First Review
            </button>
          )}
        </div>
      )}

      {/* Review Eligibility Message */}
      {showAddReview && user && !canReview && !hasReviewed && (
        <div className="card p-4 bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            💡 You need to purchase this project before you can write a review.
          </p>
        </div>
      )}

      {showAddReview && hasReviewed && (
        <div className="card p-4 bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            ✅ You have already reviewed this project. Thank you for your feedback!
          </p>
        </div>
      )}
    </div>
  );
}
