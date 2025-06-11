import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testDatabaseConnection, disconnectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { initializeEmailService } from './services/emailService';
import {
  performanceMonitor,
  memoryMonitor,
  queryOptimizer,
  responseOptimizer,
  performanceStatsEndpoint,
  healthCheckEndpoint,
  gracefulShutdown,
} from './middleware/performance';
import { cacheStats, cacheHealthCheck } from './middleware/cache';
import {
  securityHeaders,
  sanitizeInput,
  sqlInjectionProtection,
  suspiciousActivityDetection,
  validateJWTStructure,
  securityAuditLog,
  validateContentType,
  requestSizeLimit,
} from './middleware/security';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// CORS configuration - Production Security
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.NEXT_PUBLIC_APP_URL,
      'https://vibecodeseller.com',
      'https://www.vibecodeseller.com',
      'http://localhost:3000', // Development
    ].filter(Boolean);

    // In production, be strict about origins
    if (process.env.NODE_ENV === 'production') {
      if (!origin) {
        return callback(new Error('Origin required in production'));
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development mode - more permissive
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
}));

// Compression middleware
app.use(compression());

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom request logger
app.use(requestLogger);

// Performance monitoring middleware
app.use(performanceMonitor);
app.use(memoryMonitor);
app.use(queryOptimizer);
app.use(responseOptimizer);

// Enhanced security middleware
app.use(securityHeaders);
app.use(requestSizeLimit(10 * 1024 * 1024)); // 10MB limit
app.use(validateContentType(['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']));
app.use(sanitizeInput);
app.use(sqlInjectionProtection);
app.use(suspiciousActivityDetection);
app.use(validateJWTStructure);
app.use(securityAuditLog);

// Cache and performance endpoints
app.use(cacheStats);
app.use(cacheHealthCheck);
app.use(performanceStatsEndpoint);
app.use(healthCheckEndpoint);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VibeCoder API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || 'v1',
  });
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VibeCoder Marketplace API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/docs',
    health: '/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  gracefulShutdown();
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  gracefulShutdown();
  await disconnectDatabase();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const isConnected = await testDatabaseConnection();

    if (!isConnected) {
      console.log('⚠️ Database connection failed, but starting server anyway...');
      console.log('📝 Make sure to set up your database before using the API');
    }

    // Initialize email service
    console.log('📧 Initializing email service...');
    initializeEmailService();

    // Start the server
    app.listen(PORT, () => {
      console.log('🚀 VibeCoder API Server started successfully!');
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🎯 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
