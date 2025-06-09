import Redis from 'ioredis';

// Cache configuration
const CACHE_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Cache TTL (Time To Live) constants in seconds
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400, // 24 hours
};

// Cache key prefixes
export const CACHE_KEYS = {
  USER: 'user:',
  PROJECT: 'project:',
  ANALYTICS: 'analytics:',
  REVIEWS: 'reviews:',
  SEARCH: 'search:',
  STATS: 'stats:',
  SESSION: 'session:',
};

class CacheService {
  private redis: Redis | null = null;
  private isConnected = false;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.redis = new Redis(CACHE_CONFIG);

      this.redis.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        console.log('🔌 Redis connection closed');
        this.isConnected = false;
      });

      // Test connection
      await this.redis.ping();
    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error);
      this.redis = null;
      this.isConnected = false;
    }
  }

  // Check if cache is available
  public isAvailable(): boolean {
    return this.isConnected && this.redis !== null;
  }

  // Get value from cache
  public async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const value = await this.redis!.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set value in cache
  public async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await this.redis!.setex(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete value from cache
  public async delete(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.redis!.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Delete multiple keys matching pattern
  public async deletePattern(pattern: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = await this.redis!.keys(pattern);
      if (keys.length > 0) {
        await this.redis!.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  // Check if key exists
  public async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const result = await this.redis!.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set expiration for existing key
  public async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.redis!.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  // Increment counter
  public async increment(key: string, ttl?: number): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const result = await this.redis!.incr(key);
      if (ttl && result === 1) {
        await this.redis!.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  // Get multiple values
  public async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isAvailable() || keys.length === 0) {
      return [];
    }

    try {
      const values = await this.redis!.mget(...keys);
      return values.map(value => {
        if (value) {
          try {
            return JSON.parse(value) as T;
          } catch {
            return null;
          }
        }
        return null;
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return [];
    }
  }

  // Set multiple values
  public async mset(keyValuePairs: Record<string, any>, ttl?: number): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const pipeline = this.redis!.pipeline();
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const serializedValue = JSON.stringify(value);
        if (ttl) {
          pipeline.setex(key, ttl, serializedValue);
        } else {
          pipeline.set(key, serializedValue);
        }
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  // Get cache statistics
  public async getStats(): Promise<any> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const info = await this.redis!.info('memory');
      const keyspace = await this.redis!.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: info,
        keyspace: keyspace,
        uptime: await this.redis!.lastsave(),
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }

  // Clear all cache
  public async clear(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.redis!.flushdb();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Close connection
  public async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.isConnected = false;
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Helper functions for common cache operations
export const cache = {
  // User cache helpers
  user: {
    get: (userId: string) => cacheService.get(`${CACHE_KEYS.USER}${userId}`),
    set: (userId: string, userData: any) => cacheService.set(`${CACHE_KEYS.USER}${userId}`, userData, CACHE_TTL.MEDIUM),
    delete: (userId: string) => cacheService.delete(`${CACHE_KEYS.USER}${userId}`),
  },

  // Project cache helpers
  project: {
    get: (projectId: string) => cacheService.get(`${CACHE_KEYS.PROJECT}${projectId}`),
    set: (projectId: string, projectData: any) => cacheService.set(`${CACHE_KEYS.PROJECT}${projectId}`, projectData, CACHE_TTL.LONG),
    delete: (projectId: string) => cacheService.delete(`${CACHE_KEYS.PROJECT}${projectId}`),
    list: (key: string) => cacheService.get(`${CACHE_KEYS.PROJECT}list:${key}`),
    setList: (key: string, projects: any[]) => cacheService.set(`${CACHE_KEYS.PROJECT}list:${key}`, projects, CACHE_TTL.SHORT),
  },

  // Analytics cache helpers
  analytics: {
    get: (key: string) => cacheService.get(`${CACHE_KEYS.ANALYTICS}${key}`),
    set: (key: string, data: any) => cacheService.set(`${CACHE_KEYS.ANALYTICS}${key}`, data, CACHE_TTL.MEDIUM),
    delete: (key: string) => cacheService.delete(`${CACHE_KEYS.ANALYTICS}${key}`),
  },

  // Reviews cache helpers
  reviews: {
    get: (projectId: string) => cacheService.get(`${CACHE_KEYS.REVIEWS}${projectId}`),
    set: (projectId: string, reviewsData: any) => cacheService.set(`${CACHE_KEYS.REVIEWS}${projectId}`, reviewsData, CACHE_TTL.SHORT),
    delete: (projectId: string) => cacheService.delete(`${CACHE_KEYS.REVIEWS}${projectId}`),
    stats: (projectId: string) => cacheService.get(`${CACHE_KEYS.REVIEWS}stats:${projectId}`),
    setStats: (projectId: string, stats: any) => cacheService.set(`${CACHE_KEYS.REVIEWS}stats:${projectId}`, stats, CACHE_TTL.MEDIUM),
  },

  // Search cache helpers
  search: {
    get: (query: string) => cacheService.get(`${CACHE_KEYS.SEARCH}${Buffer.from(query).toString('base64')}`),
    set: (query: string, results: any) => cacheService.set(`${CACHE_KEYS.SEARCH}${Buffer.from(query).toString('base64')}`, results, CACHE_TTL.SHORT),
  },

  // General stats cache
  stats: {
    get: (key: string) => cacheService.get(`${CACHE_KEYS.STATS}${key}`),
    set: (key: string, data: any) => cacheService.set(`${CACHE_KEYS.STATS}${key}`, data, CACHE_TTL.LONG),
  },
};

export default cacheService;
