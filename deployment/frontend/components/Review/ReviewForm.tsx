'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';

interface ReviewFormProps {
  projectId: string;
  projectTitle: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  projectId,
  projectTitle,
  onReviewSubmitted,
  onCancel,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/projects/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        onReviewSubmitted?.();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
          disabled={isSubmitting}
        >
          ★
        </button>
      );
    });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review for "{projectTitle}"
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating} star{rating !== 1 ? 's' : ''}
                  {rating === 1 && ' - Poor'}
                  {rating === 2 && ' - Fair'}
                  {rating === 3 && ' - Good'}
                  {rating === 4 && ' - Very Good'}
                  {rating === 5 && ' - Excellent'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience..."
            maxLength={100}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your detailed experience with this project..."
            rows={4}
            maxLength={1000}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="btn btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-outline px-6 py-2 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Review Guidelines</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Be honest and constructive in your feedback</li>
          <li>• Focus on the project quality, documentation, and usability</li>
          <li>• Avoid personal attacks or inappropriate language</li>
          <li>• You can only review projects you have purchased</li>
          <li>• Reviews help other buyers make informed decisions</li>
        </ul>
      </div>
    </div>
  );
}
