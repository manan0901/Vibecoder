import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: number;
  stack?: string;
}

// Handle Prisma errors
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      return new AppError('Duplicate field value entered', 400);
    case 'P2014':
      return new AppError('Invalid ID provided', 400);
    case 'P2003':
      return new AppError('Invalid input data', 400);
    case 'P2025':
      return new AppError('Record not found', 404);
    default:
      return new AppError('Database error occurred', 500);
  }
}

// Handle validation errors
function handleValidationError(error: any): AppError {
  const message = Object.values(error.errors).map((val: any) => val.message).join(', ');
  return new AppError(`Invalid input data: ${message}`, 400);
}

// Handle JWT errors
function handleJWTError(): AppError {
  return new AppError('Invalid token. Please log in again', 401);
}

function handleJWTExpiredError(): AppError {
  return new AppError('Your token has expired. Please log in again', 401);
}

// Send error response in development
function sendErrorDev(err: AppError, res: Response): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  };

  res.status(err.statusCode).json(errorResponse);
}

// Send error response in production
function sendErrorProd(err: AppError, res: Response): void {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    };

    res.status(err.statusCode).json(errorResponse);
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Something went wrong!',
      statusCode: 500,
    };

    res.status(500).json(errorResponse);
  }
}

// Global error handling middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Cast error to AppError if it's not already
  if (!(error instanceof AppError)) {
    error = new AppError(error.message || 'Internal Server Error', error.statusCode || 500);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
}

// 404 handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
}

// Async error wrapper
export function catchAsync(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
