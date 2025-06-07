import { authenticateToken, requireRole } from '../../middleware/auth';
import { verifyToken } from '../../utils/jwt';

// Mock JWT utility
jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

// Mock database
jest.mock('../../config/database', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

describe('Authentication Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = global.testUtils.createMockRequest();
    mockRes = global.testUtils.createMockResponse();
    mockNext = global.testUtils.createMockNext();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', async () => {
      const mockUser = global.testUtils.mockUser;
      const mockToken = 'valid-jwt-token';

      mockReq.headers.authorization = `Bearer ${mockToken}`;

      (verifyToken as jest.Mock).mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
      });

      const prisma = require('../../config/database');
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          isVerified: true,
          profilePicture: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject request without authorization header', async () => {
      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Access token required',
          statusCode: 401,
        })
      );
    });

    it('should reject request with invalid token format', async () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token format',
          statusCode: 401,
        })
      );
    });

    it('should reject request with invalid token', async () => {
      const invalidToken = 'invalid-jwt-token';
      mockReq.headers.authorization = `Bearer ${invalidToken}`;

      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401,
        })
      );
    });

    it('should reject request if user not found', async () => {
      const mockToken = 'valid-jwt-token';
      mockReq.headers.authorization = `Bearer ${mockToken}`;

      (verifyToken as jest.Mock).mockReturnValue({
        userId: 'non-existent-user-id',
        email: 'test@example.com',
      });

      const prisma = require('../../config/database');
      prisma.user.findUnique.mockResolvedValue(null);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 401,
        })
      );
    });

    it('should reject request if user is inactive', async () => {
      const inactiveUser = {
        ...global.testUtils.mockUser,
        isActive: false,
      };

      const mockToken = 'valid-jwt-token';
      mockReq.headers.authorization = `Bearer ${mockToken}`;

      (verifyToken as jest.Mock).mockReturnValue({
        userId: inactiveUser.id,
        email: inactiveUser.email,
      });

      const prisma = require('../../config/database');
      prisma.user.findUnique.mockResolvedValue(inactiveUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Account is deactivated',
          statusCode: 401,
        })
      );
    });

    it('should handle database errors', async () => {
      const mockToken = 'valid-jwt-token';
      mockReq.headers.authorization = `Bearer ${mockToken}`;

      (verifyToken as jest.Mock).mockReturnValue({
        userId: 'test-user-id',
        email: 'test@example.com',
      });

      const prisma = require('../../config/database');
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication failed',
          statusCode: 500,
        })
      );
    });
  });

  describe('requireRole', () => {
    it('should allow access for correct role', () => {
      const middleware = requireRole(['SELLER']);
      mockReq.user = global.testUtils.mockSeller;

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access for multiple roles', () => {
      const middleware = requireRole(['BUYER', 'SELLER']);
      mockReq.user = global.testUtils.mockUser; // BUYER role

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for incorrect role', () => {
      const middleware = requireRole(['ADMIN']);
      mockReq.user = global.testUtils.mockUser; // BUYER role

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Insufficient permissions',
          statusCode: 403,
        })
      );
    });

    it('should deny access if user not authenticated', () => {
      const middleware = requireRole(['SELLER']);
      mockReq.user = null;

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication required',
          statusCode: 401,
        })
      );
    });

    it('should handle admin role access', () => {
      const middleware = requireRole(['SELLER']);
      const adminUser = {
        ...global.testUtils.mockUser,
        role: 'ADMIN',
      };
      mockReq.user = adminUser;

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(); // Admin should have access to everything
    });

    it('should handle case-insensitive role checking', () => {
      const middleware = requireRole(['seller']); // lowercase
      mockReq.user = global.testUtils.mockSeller; // SELLER role

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('Optional Authentication', () => {
    it('should work with optional authentication middleware', async () => {
      // This would be a middleware that doesn't require authentication
      // but adds user info if token is present
      const optionalAuth = async (req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
          return next(); // Continue without user
        }

        try {
          await authenticateToken(req, res, next);
        } catch (error) {
          // Ignore auth errors for optional auth
          next();
        }
      };

      // Test without token
      await optionalAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeUndefined();

      // Reset mocks
      jest.clearAllMocks();

      // Test with valid token
      const mockUser = global.testUtils.mockUser;
      const mockToken = 'valid-jwt-token';
      mockReq.headers.authorization = `Bearer ${mockToken}`;

      (verifyToken as jest.Mock).mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
      });

      const prisma = require('../../config/database');
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await optionalAuth(mockReq, mockRes, mockNext);
      expect(mockReq.user).toEqual(mockUser);
    });
  });

  describe('Token Extraction', () => {
    it('should extract token from Authorization header', () => {
      const token = 'test-token-123';
      mockReq.headers.authorization = `Bearer ${token}`;

      const extractToken = (req: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        return authHeader.substring(7);
      };

      const extractedToken = extractToken(mockReq);
      expect(extractedToken).toBe(token);
    });

    it('should handle missing Authorization header', () => {
      const extractToken = (req: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        return authHeader.substring(7);
      };

      const extractedToken = extractToken(mockReq);
      expect(extractedToken).toBeNull();
    });

    it('should handle malformed Authorization header', () => {
      mockReq.headers.authorization = 'NotBearer token123';

      const extractToken = (req: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        return authHeader.substring(7);
      };

      const extractedToken = extractToken(mockReq);
      expect(extractedToken).toBeNull();
    });
  });
});
