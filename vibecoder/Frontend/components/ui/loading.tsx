'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-vibecoder-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
        />
      ))}
    </>
  );
}

interface ProjectCardSkeletonProps {
  count?: number;
}

export function ProjectCardSkeleton({ count = 6 }: ProjectCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <LoadingSkeleton className="h-48 w-full" />
          <div className="p-6">
            <LoadingSkeleton className="h-4 w-3/4 mb-2" />
            <LoadingSkeleton className="h-3 w-full mb-4" />
            <div className="flex gap-2 mb-4">
              <LoadingSkeleton className="h-6 w-16 rounded-full" />
              <LoadingSkeleton className="h-6 w-20 rounded-full" />
              <LoadingSkeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="h-6 w-16" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <LoadingSkeleton className="h-8 w-8 rounded-full" />
              <LoadingSkeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <LoadingSkeleton className="h-10 flex-1 rounded-md" />
              <LoadingSkeleton className="h-10 flex-1 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
