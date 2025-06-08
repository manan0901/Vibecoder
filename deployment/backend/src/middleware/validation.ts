import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { AppError } from './errorHandler';

// Validation middleware factory
export function validateRequest(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query parameters
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      // Validate route parameters
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const message = `Validation failed: ${errorMessages.map(e => `${e.field} - ${e.message}`).join(', ')}`;
        next(new AppError(message, 400));
      } else {
        next(error);
      }
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  // ID parameter validation
  id: z.object({
    id: z.string().min(1, 'ID is required'),
  }),

  // Pagination query validation
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    sortBy: z.enum(['newest', 'oldest', 'price_low', 'price_high', 'rating', 'downloads']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),

  // Search query validation
  search: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
    minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    licenseType: z.enum(['SINGLE', 'MULTI', 'COMMERCIAL']).optional(),
  }),

  // Email validation
  email: z.string().email('Invalid email format'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Name validation
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  // Phone validation (Indian format)
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number format')
    .optional(),

  // URL validation
  url: z.string().url('Invalid URL format').optional(),

  // Price validation
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price cannot exceed 999,999'),

  // Rating validation
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
};

// User registration validation schema
export const userRegistrationSchema = {
  body: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional().default('BUYER'),
    phone: commonSchemas.phone,
  }),
};

// User login validation schema
export const userLoginSchema = {
  body: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),
};

// Project creation validation schema
export const projectCreationSchema = {
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description must be less than 2000 characters'),
    shortDescription: z.string().max(200, 'Short description must be less than 200 characters').optional(),
    techStack: z.array(z.string()).min(1, 'At least one technology is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    price: commonSchemas.price,
    licenseType: z.enum(['SINGLE', 'MULTI', 'COMMERCIAL']),
    demoUrl: commonSchemas.url,
    githubUrl: commonSchemas.url,
  }),
};

// Review creation validation schema
export const reviewCreationSchema = {
  body: z.object({
    rating: commonSchemas.rating,
    comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
  }),
  params: commonSchemas.id,
};

// User profile update validation schema
export const userProfileUpdateSchema = {
  body: z.object({
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    bio: z.string()
      .max(500, 'Bio must be less than 500 characters')
      .optional(),
    phone: commonSchemas.phone,
  }),
};

// User settings update validation schema
export const userSettingsUpdateSchema = {
  body: z.object({
    emailNotifications: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    profileVisibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
  }),
};

// Query validation for user projects
export const userProjectsQuerySchema = {
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']).optional(),
  }),
};
