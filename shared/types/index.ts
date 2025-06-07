// Shared types for VibeCoder Marketplace
export * from './database';

// Common utility types
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  licenseType?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'downloads';
  page?: number;
  limit?: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'BUYER' | 'SELLER';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
}
