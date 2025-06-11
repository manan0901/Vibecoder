'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Download, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Button } from './button';
import { cn, formatCurrency } from '../../lib/utils';

interface ProjectCardProps {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  category: string;
  techStack: string[];
  seller: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  thumbnail?: string;
  isFeatured?: boolean;
  isLiked?: boolean;
  className?: string;
}

export function ProjectCard({
  id,
  title,
  shortDescription,
  price,
  rating,
  reviewCount,
  downloadCount,
  category,
  techStack,
  seller,
  thumbnail = '/api/placeholder/300/200',
  isFeatured = false,
  isLiked = false,
  className
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={cn("group relative", className)}
    >
      <Card className="h-full overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}

        {/* Like Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors">
          <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-vibecoder-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-vibecoder-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {shortDescription}
              </p>
            </div>
            <div className="ml-3 text-right">
              <div className="text-2xl font-bold text-vibecoder-600">
                {formatCurrency(price)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 mb-4">
            {techStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                +{techStack.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span>({reviewCount})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{downloadCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(downloadCount * 2.5)}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibecoder-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
              {seller.firstName[0]}{seller.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {seller.firstName} {seller.lastName}
              </p>
              <p className="text-xs text-gray-600">Seller</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/projects/${id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            <Button variant="vibecoder" size="sm" className="flex-1" asChild>
              <Link href={`/projects/${id}/purchase`}>
                Buy Now
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
