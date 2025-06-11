import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/vibecoder_test';

// Mock external services
jest.mock('../services/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  initializeEmailService: jest.fn().mockResolvedValue(true),
}));

jest.mock('../services/paymentService', () => ({
  createPaymentIntent: jest.fn().mockResolvedValue({
    id: 'pi_test_123',
    client_secret: 'pi_test_123_secret',
    status: 'requires_payment_method',
  }),
  confirmPayment: jest.fn().mockResolvedValue({
    id: 'pi_test_123',
    status: 'succeeded',
  }),
  createCustomer: jest.fn().mockResolvedValue({
    id: 'cus_test_123',
  }),
}));

jest.mock('../services/fileStorageService', () => ({
  uploadFile: jest.fn().mockResolvedValue({
    url: 'https://test-bucket.s3.amazonaws.com/test-file.jpg',
    key: 'test-file.jpg',
  }),
  deleteFile: jest.fn().mockResolvedValue(true),
  getSignedUrl: jest.fn().mockResolvedValue('https://test-signed-url.com'),
}));

// Mock Redis cache service
jest.mock('../services/cacheService', () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
  clear: jest.fn().mockResolvedValue(true),
  isAvailable: jest.fn().mockReturnValue(false),
}));

// Global test utilities
(global as any).testUtils = {
  // Mock user data
  mockUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'BUYER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Mock seller data
  mockSeller: {
    id: 'test-seller-id',
    email: 'seller@example.com',
    firstName: 'Test',
    lastName: 'Seller',
    role: 'SELLER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Mock project data
  mockProject: {
    id: 'test-project-id',
    title: 'Test Project',
    shortDescription: 'A test project',
    fullDescription: 'A detailed test project description',
    price: 2999,
    category: 'WEB_DEVELOPMENT',
    tags: ['react', 'typescript'],
    status: 'APPROVED',
    sellerId: 'test-seller-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Mock JWT tokens
  mockTokens: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  },
  
  // Helper to create mock request
  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ip: '127.0.0.1',
    get: jest.fn(),
    ...overrides,
  }),
  
  // Helper to create mock response
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
    return res;
  },
  
  // Helper to create mock next function
  createMockNext: () => jest.fn(),
};

// Increase timeout for async operations
jest.setTimeout(10000);

// Console suppression for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

export {};
