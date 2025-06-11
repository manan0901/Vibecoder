import { generateTokens, verifyRefreshToken } from '../../utils/jwt';
import { hashPassword, comparePassword } from '../../utils/password';
import SecurityService, { AccountSecurityService } from '../../services/securityService';

describe('Authentication Service', () => {
  describe('JWT Token Generation', () => {
    it('should generate valid access and refresh tokens', () => {
      const user = global.testUtils.mockUser;
      const tokens = generateTokens(user);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different users', () => {
      const user1 = { ...global.testUtils.mockUser, id: 'user1' };
      const user2 = { ...global.testUtils.mockUser, id: 'user2' };
      
      const tokens1 = generateTokens(user1);
      const tokens2 = generateTokens(user2);
      
      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should verify password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('Security Service', () => {
    describe('Password Validation', () => {
      it('should validate strong password', () => {
        const strongPassword = 'StrongPassword123!';
        const result = SecurityService.validatePassword(strongPassword);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject weak passwords', () => {
        const weakPasswords = [
          'weak',
          '123456',
          'password',
          'Password',
          'Password123',
          'password123!',
          'PASSWORD123!'
        ];

        weakPasswords.forEach(password => {
          const result = SecurityService.validatePassword(password);
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        });
      });

      it('should reject passwords that are too short', () => {
        const shortPassword = 'Abc1!';
        const result = SecurityService.validatePassword(shortPassword);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must be at least 8 characters long');
      });

      it('should reject passwords that are too long', () => {
        const longPassword = 'A'.repeat(130) + '1!';
        const result = SecurityService.validatePassword(longPassword);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must be no more than 128 characters long');
      });
    });

    describe('Input Sanitization', () => {
      it('should sanitize malicious input', () => {
        const maliciousInputs = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          '<img src=x onerror=alert("xss")>',
          'onload=alert("xss")',
          '<iframe src="javascript:alert(1)"></iframe>'
        ];

        maliciousInputs.forEach(input => {
          const sanitized = SecurityService.sanitizeInput(input);
          expect(sanitized).not.toContain('<script>');
          expect(sanitized).not.toContain('javascript:');
          expect(sanitized).not.toContain('onload=');
          expect(sanitized).not.toContain('<iframe>');
        });
      });

      it('should preserve safe input', () => {
        const safeInputs = [
          'Hello World',
          'user@example.com',
          'This is a safe description.',
          '123-456-7890'
        ];

        safeInputs.forEach(input => {
          const sanitized = SecurityService.sanitizeInput(input);
          expect(sanitized).toBe(input);
        });
      });
    });

    describe('SQL Injection Detection', () => {
      it('should detect SQL injection attempts', () => {
        const sqlInjectionAttempts = [
          "'; DROP TABLE users; --",
          "1' OR '1'='1",
          "UNION SELECT * FROM users",
          "'; INSERT INTO users VALUES ('hacker', 'password'); --",
          "1; DELETE FROM users; --"
        ];

        sqlInjectionAttempts.forEach(attempt => {
          const isDetected = SecurityService.detectSQLInjection(attempt);
          expect(isDetected).toBe(true);
        });
      });

      it('should not flag safe input as SQL injection', () => {
        const safeInputs = [
          'Hello World',
          'user@example.com',
          'This is a description',
          'Product name with numbers 123'
        ];

        safeInputs.forEach(input => {
          const isDetected = SecurityService.detectSQLInjection(input);
          expect(isDetected).toBe(false);
        });
      });
    });

    describe('Email Validation', () => {
      it('should validate correct email addresses', () => {
        const validEmails = [
          'user@example.com',
          'test.email@domain.co.uk',
          'user+tag@example.org',
          'firstname.lastname@company.com'
        ];

        validEmails.forEach(email => {
          const isValid = SecurityService.validateEmail(email);
          expect(isValid).toBe(true);
        });
      });

      it('should reject invalid email addresses', () => {
        const invalidEmails = [
          'invalid-email',
          '@example.com',
          'user@',
          'user..name@example.com',
          'user@example',
          ''
        ];

        invalidEmails.forEach(email => {
          const isValid = SecurityService.validateEmail(email);
          expect(isValid).toBe(false);
        });
      });
    });

    describe('Token Generation', () => {
      it('should generate secure random tokens', () => {
        const token1 = SecurityService.generateSecureToken();
        const token2 = SecurityService.generateSecureToken();
        
        expect(token1).toBeDefined();
        expect(token2).toBeDefined();
        expect(token1).not.toBe(token2);
        expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
        expect(token2.length).toBe(64);
      });

      it('should generate tokens of specified length', () => {
        const token16 = SecurityService.generateSecureToken(16);
        const token64 = SecurityService.generateSecureToken(64);
        
        expect(token16.length).toBe(32); // 16 bytes = 32 hex chars
        expect(token64.length).toBe(128); // 64 bytes = 128 hex chars
      });

      it('should generate CSRF tokens', () => {
        const csrfToken1 = SecurityService.generateCSRFToken();
        const csrfToken2 = SecurityService.generateCSRFToken();
        
        expect(csrfToken1).toBeDefined();
        expect(csrfToken2).toBeDefined();
        expect(csrfToken1).not.toBe(csrfToken2);
      });
    });
  });

  describe('Account Security Service', () => {
    beforeEach(() => {
      // Reset account lockouts before each test
      AccountSecurityService.resetFailedAttempts('test@example.com');
    });

    describe('Failed Login Tracking', () => {
      it('should track failed login attempts', () => {
        const email = 'test@example.com';
        
        // First few attempts should not lock account
        for (let i = 0; i < 4; i++) {
          const isLocked = AccountSecurityService.trackFailedLogin(email);
          expect(isLocked).toBe(false);
        }
        
        // 5th attempt should lock account
        const isLocked = AccountSecurityService.trackFailedLogin(email);
        expect(isLocked).toBe(true);
      });

      it('should check if account is locked', () => {
        const email = 'test@example.com';
        
        // Account should not be locked initially
        expect(AccountSecurityService.isAccountLocked(email)).toBe(false);
        
        // Lock account by exceeding attempts
        for (let i = 0; i < 5; i++) {
          AccountSecurityService.trackFailedLogin(email);
        }
        
        expect(AccountSecurityService.isAccountLocked(email)).toBe(true);
      });

      it('should reset failed attempts on successful login', () => {
        const email = 'test@example.com';
        
        // Make some failed attempts
        for (let i = 0; i < 3; i++) {
          AccountSecurityService.trackFailedLogin(email);
        }
        
        // Reset attempts
        AccountSecurityService.resetFailedAttempts(email);
        
        // Account should not be locked
        expect(AccountSecurityService.isAccountLocked(email)).toBe(false);
      });

      it('should get remaining lockout time', () => {
        const email = 'test@example.com';
        
        // Lock account
        for (let i = 0; i < 5; i++) {
          AccountSecurityService.trackFailedLogin(email);
        }
        
        const remainingTime = AccountSecurityService.getRemainingLockoutTime(email);
        expect(remainingTime).toBeGreaterThan(0);
        expect(remainingTime).toBeLessThanOrEqual(15 * 60 * 1000); // 15 minutes max
      });
    });
  });
});
