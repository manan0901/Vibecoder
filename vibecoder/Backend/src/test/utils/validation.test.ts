describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
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
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Password Strength Validation', () => {
    const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }

      if (password.length > 128) {
        errors.push('Password must be no more than 128 characters long');
      }

      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }

      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }

      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    };

    it('should validate strong passwords', () => {
      const strongPasswords = [
        'StrongPassword123!',
        'MySecure@Pass1',
        'Complex#Password9',
        'Valid$Password2024'
      ];

      strongPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        { password: 'weak', expectedErrors: 4 },
        { password: '123456', expectedErrors: 3 },
        { password: 'password', expectedErrors: 3 },
        { password: 'Password', expectedErrors: 2 },
        { password: 'Password123', expectedErrors: 1 },
        { password: 'password123!', expectedErrors: 1 }
      ];

      weakPasswords.forEach(({ password, expectedErrors }) => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(expectedErrors);
      });
    });
  });

  describe('Input Sanitization', () => {
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .trim();
    };

    it('should sanitize malicious input', () => {
      const maliciousInputs = [
        {
          input: '<script>alert("xss")</script>',
          expected: ''
        },
        {
          input: 'javascript:alert("xss")',
          expected: 'alert("xss")'
        },
        {
          input: '<img src=x onerror=alert("xss")>',
          expected: '<img src=x>'
        },
        {
          input: '<iframe src="javascript:alert(1)"></iframe>',
          expected: ''
        }
      ];

      maliciousInputs.forEach(({ input, expected }) => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe(expected);
      });
    });

    it('should preserve safe input', () => {
      const safeInputs = [
        'Hello World',
        'user@example.com',
        'This is a safe description.',
        '123-456-7890',
        'Product name with numbers 123'
      ];

      safeInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe(input);
      });
    });
  });

  describe('Price Validation', () => {
    const validatePrice = (price: number): { isValid: boolean; error?: string } => {
      if (price < 0) {
        return { isValid: false, error: 'Price cannot be negative' };
      }

      if (price < 50) {
        return { isValid: false, error: 'Minimum price is ₹0.50' };
      }

      if (price > 500000) {
        return { isValid: false, error: 'Maximum price is ₹5,000' };
      }

      if (!Number.isInteger(price)) {
        return { isValid: false, error: 'Price must be in paise (integer)' };
      }

      return { isValid: true };
    };

    it('should validate correct prices', () => {
      const validPrices = [50, 100, 1000, 5000, 50000, 100000, 500000];

      validPrices.forEach(price => {
        const result = validatePrice(price);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid prices', () => {
      const invalidPrices = [
        { price: -100, expectedError: 'Price cannot be negative' },
        { price: 0, expectedError: 'Minimum price is ₹0.50' },
        { price: 25, expectedError: 'Minimum price is ₹0.50' },
        { price: 600000, expectedError: 'Maximum price is ₹5,000' },
        { price: 99.99, expectedError: 'Price must be in paise (integer)' }
      ];

      invalidPrices.forEach(({ price, expectedError }) => {
        const result = validatePrice(price);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(expectedError);
      });
    });
  });

  describe('File Validation', () => {
    const validateFile = (filename: string, size: number): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.rar'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      // Check file extension
      const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
      if (!allowedExtensions.includes(extension)) {
        errors.push(`File type ${extension} is not allowed`);
      }

      // Check file size
      if (size > maxSize) {
        errors.push('File size exceeds 10MB limit');
      }

      if (size <= 0) {
        errors.push('File size must be greater than 0');
      }

      // Check filename
      if (filename.length > 255) {
        errors.push('Filename is too long');
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(filename.replace(/\.[^.]+$/, ''))) {
        errors.push('Filename contains invalid characters');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    };

    it('should validate correct files', () => {
      const validFiles = [
        { filename: 'document.pdf', size: 1024 * 1024 },
        { filename: 'image.jpg', size: 500 * 1024 },
        { filename: 'project.zip', size: 5 * 1024 * 1024 },
        { filename: 'photo.png', size: 2 * 1024 * 1024 }
      ];

      validFiles.forEach(({ filename, size }) => {
        const result = validateFile(filename, size);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid files', () => {
      const invalidFiles = [
        { filename: 'script.exe', size: 1024, expectedErrorCount: 1 },
        { filename: 'document.pdf', size: 15 * 1024 * 1024, expectedErrorCount: 1 },
        { filename: 'file with spaces.jpg', size: 1024, expectedErrorCount: 1 },
        { filename: 'document.pdf', size: 0, expectedErrorCount: 1 }
      ];

      invalidFiles.forEach(({ filename, size, expectedErrorCount }) => {
        const result = validateFile(filename, size);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(expectedErrorCount);
      });
    });
  });

  describe('URL Validation', () => {
    const validateURL = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('should validate correct URLs', () => {
      const validURLs = [
        'https://example.com',
        'http://localhost:3000',
        'https://subdomain.example.com/path',
        'https://example.com/path?query=value',
        'https://example.com:8080/path'
      ];

      validURLs.forEach(url => {
        expect(validateURL(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidURLs = [
        'not-a-url',
        'ftp://example.com', // We might want to restrict protocols
        'javascript:alert(1)',
        '',
        'http://',
        'https://'
      ];

      invalidURLs.forEach(url => {
        expect(validateURL(url)).toBe(false);
      });
    });
  });
});
