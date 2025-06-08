import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Performance monitoring interface
interface PerformanceMetrics {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

// Performance metrics storage (in production, use a proper monitoring service)
const performanceMetrics: PerformanceMetrics[] = [];
const MAX_METRICS_STORAGE = 1000;

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  const requestId = generateRequestId();
  
  // Add request ID to request object
  (req as any).requestId = requestId;

  // Override end method to capture metrics
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

    // Capture performance metrics
    const metrics: PerformanceMetrics = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };

    // Store metrics (limit storage size)
    performanceMetrics.push(metrics);
    if (performanceMetrics.length > MAX_METRICS_STORAGE) {
      performanceMetrics.shift();
    }

    // Log slow requests
    if (responseTime > 1000) { // Log requests slower than 1 second
      console.warn(`🐌 Slow request detected: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
    }

    // Add performance headers
    res.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);
    res.set('X-Request-ID', requestId);

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Get performance statistics
export const getPerformanceStats = () => {
  if (performanceMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      errorRate: 0,
      memoryUsage: process.memoryUsage(),
    };
  }

  const totalRequests = performanceMetrics.length;
  const totalResponseTime = performanceMetrics.reduce((sum, metric) => sum + metric.responseTime, 0);
  const averageResponseTime = totalResponseTime / totalRequests;
  const slowRequests = performanceMetrics.filter(metric => metric.responseTime > 1000).length;
  const errorRequests = performanceMetrics.filter(metric => metric.statusCode >= 400).length;
  const errorRate = (errorRequests / totalRequests) * 100;

  return {
    totalRequests,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    slowRequests,
    errorRate: Math.round(errorRate * 100) / 100,
    memoryUsage: process.memoryUsage(),
    recentMetrics: performanceMetrics.slice(-10), // Last 10 requests
  };
};

// Compression middleware with custom configuration
export const compressionMiddleware = compression({
  filter: (req, res) => {
    // Don't compress if the request includes a cache-control: no-transform directive
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }

    // Compress all responses by default
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9, 6 is default)
  threshold: 1024, // Only compress responses larger than 1KB
});

// Security middleware with helmet
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
});

// Enhanced rate limiting with security features
export const enhancedRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Different limits based on endpoint
    if (req.path.startsWith('/api/auth/')) {
      return 5; // Stricter limit for auth endpoints
    }
    if (req.path.startsWith('/api/admin/')) {
      return 100; // Higher limit for admin endpoints
    }
    if (req.path.startsWith('/api/analytics/')) {
      return 50; // Medium limit for analytics
    }
    return 100; // Default limit
  },
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

// Memory usage monitoring
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
    external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
  };

  // Log memory warnings
  if (memUsageMB.heapUsed > 500) { // Warn if heap usage > 500MB
    console.warn(`⚠️ High memory usage detected: ${memUsageMB.heapUsed}MB heap used`);
  }

  // Add memory info to response headers (for debugging)
  if (process.env.NODE_ENV === 'development') {
    res.set('X-Memory-Usage', JSON.stringify(memUsageMB));
  }

  next();
};

// Database query optimization middleware
export const queryOptimizer = (req: Request, res: Response, next: NextFunction) => {
  // Add query optimization hints to request
  (req as any).queryHints = {
    useIndex: true,
    limit: req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 20,
    offset: req.query.page ? (parseInt(req.query.page as string) - 1) * 20 : 0,
  };

  next();
};

// Response optimization middleware
export const responseOptimizer = (req: Request, res: Response, next: NextFunction) => {
  // Set optimal cache headers for static content
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  } else if (req.path.startsWith('/api/')) {
    // API responses should not be cached by default
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }

  // Add performance headers
  res.set('X-Powered-By', 'VibeCoder API');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-Content-Type-Options', 'nosniff');

  next();
};

// Performance metrics endpoint
export const performanceStatsEndpoint = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/performance/stats' && req.method === 'GET') {
    const stats = getPerformanceStats();
    return res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// Health check endpoint with performance info
export const healthCheckEndpoint = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/health' && req.method === 'GET') {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      },
      performance: getPerformanceStats(),
    };

    return res.json({
      success: true,
      data: health,
    });
  }
  next();
};

// Graceful shutdown handler
export const gracefulShutdown = () => {
  console.log('📊 Performance metrics summary:');
  const stats = getPerformanceStats();
  console.log(`Total requests: ${stats.totalRequests}`);
  console.log(`Average response time: ${stats.averageResponseTime}ms`);
  console.log(`Slow requests: ${stats.slowRequests}`);
  console.log(`Error rate: ${stats.errorRate}%`);
};
