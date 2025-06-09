import { Request, Response, NextFunction } from 'express';
import cacheService, { CACHE_TTL } from '../services/cacheService';
import crypto from 'crypto';

// Interface for cache options
interface CacheOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  condition?: (req: Request, res: Response) => boolean;
  skipCache?: (req: Request) => boolean;
}

// Generate cache key from request
function generateCacheKey(req: Request, customGenerator?: (req: Request) => string): string {
  if (customGenerator) {
    return customGenerator(req);
  }

  // Default key generation
  const { method, originalUrl, query, user } = req;
  const userId = user?.id || 'anonymous';
  
  // Create a hash of the request details
  const keyData = {
    method,
    url: originalUrl,
    query,
    userId,
  };

  const keyString = JSON.stringify(keyData);
  return crypto.createHash('md5').update(keyString).digest('hex');
}

// Cache middleware factory
export function cacheMiddleware(options: CacheOptions = {}) {
  const {
    ttl = CACHE_TTL.MEDIUM,
    keyGenerator,
    condition,
    skipCache,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests by default
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache if condition is provided and returns false
    if (skipCache && skipCache(req)) {
      return next();
    }

    // Check if caching is available
    if (!cacheService.isAvailable()) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = generateCacheKey(req, keyGenerator);

      // Try to get cached response
      const cachedResponse = await cacheService.get(cacheKey);

      if (cachedResponse) {
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Key', cacheKey);
        
        // Return cached response
        return res.json(cachedResponse);
      }

      // Cache miss - continue to route handler
      res.set('X-Cache', 'MISS');
      res.set('X-Cache-Key', cacheKey);

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache response
      res.json = function(body: any) {
        // Check condition before caching
        if (!condition || condition(req, res)) {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            cacheService.set(cacheKey, body, ttl).catch(error => {
              console.error('Failed to cache response:', error);
            });
          }
        }

        // Call original json method
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

// Specific cache middleware for different endpoints
export const projectListCache = cacheMiddleware({
  ttl: CACHE_TTL.SHORT,
  keyGenerator: (req) => {
    const { page, limit, category, search, sortBy } = req.query;
    return `projects:list:${page}:${limit}:${category}:${search}:${sortBy}`;
  },
});

export const projectDetailsCache = cacheMiddleware({
  ttl: CACHE_TTL.MEDIUM,
  keyGenerator: (req) => `project:${req.params.projectId}`,
});

export const userProfileCache = cacheMiddleware({
  ttl: CACHE_TTL.MEDIUM,
  keyGenerator: (req) => `user:profile:${req.user?.id}`,
  condition: (req, res) => req.user?.id !== undefined,
});

export const analyticsCache = cacheMiddleware({
  ttl: CACHE_TTL.LONG,
  keyGenerator: (req) => {
    const { period } = req.query;
    const userId = req.user?.id;
    const endpoint = req.route?.path || req.path;
    return `analytics:${userId}:${endpoint}:${period}`;
  },
});

export const reviewsCache = cacheMiddleware({
  ttl: CACHE_TTL.SHORT,
  keyGenerator: (req) => {
    const { projectId } = req.params;
    const { page, limit, sortBy } = req.query;
    return `reviews:${projectId}:${page}:${limit}:${sortBy}`;
  },
});

export const searchCache = cacheMiddleware({
  ttl: CACHE_TTL.SHORT,
  keyGenerator: (req) => {
    const { q, category, minPrice, maxPrice, sortBy, page } = req.query;
    return `search:${q}:${category}:${minPrice}:${maxPrice}:${sortBy}:${page}`;
  },
});

// Cache invalidation helpers
export const invalidateCache = {
  // Invalidate user-related cache
  user: async (userId: string) => {
    await cacheService.deletePattern(`*user:${userId}*`);
    await cacheService.deletePattern(`*profile:${userId}*`);
  },

  // Invalidate project-related cache
  project: async (projectId: string) => {
    await cacheService.deletePattern(`*project:${projectId}*`);
    await cacheService.deletePattern(`*projects:list:*`);
    await cacheService.deletePattern(`*search:*`);
  },

  // Invalidate reviews cache
  reviews: async (projectId: string) => {
    await cacheService.deletePattern(`*reviews:${projectId}*`);
    await cacheService.deletePattern(`*project:${projectId}*`);
  },

  // Invalidate analytics cache
  analytics: async (userId: string) => {
    await cacheService.deletePattern(`*analytics:${userId}*`);
  },

  // Invalidate search cache
  search: async () => {
    await cacheService.deletePattern(`*search:*`);
    await cacheService.deletePattern(`*projects:list:*`);
  },

  // Invalidate all cache
  all: async () => {
    await cacheService.clear();
  },
};

// Cache warming functions
export const warmCache = {
  // Warm popular projects cache
  popularProjects: async () => {
    try {
      // This would typically fetch and cache popular projects
      console.log('Warming popular projects cache...');
      // Implementation would go here
    } catch (error) {
      console.error('Failed to warm popular projects cache:', error);
    }
  },

  // Warm user sessions cache
  userSessions: async () => {
    try {
      console.log('Warming user sessions cache...');
      // Implementation would go here
    } catch (error) {
      console.error('Failed to warm user sessions cache:', error);
    }
  },
};

// Cache statistics middleware
export const cacheStats = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/cache/stats' && req.method === 'GET') {
    try {
      const stats = await cacheService.getStats();
      return res.json({
        success: true,
        data: {
          cache: stats,
          isAvailable: cacheService.isAvailable(),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get cache statistics',
      });
    }
  }
  next();
};

// Cache health check middleware
export const cacheHealthCheck = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/health/cache' && req.method === 'GET') {
    try {
      const isHealthy = cacheService.isAvailable();
      const status = isHealthy ? 'healthy' : 'unhealthy';
      
      return res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        status,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Cache health check failed',
        timestamp: new Date().toISOString(),
      });
    }
  }
  next();
};
