import bcrypt from 'bcryptjs';

// Get bcrypt rounds from environment
const BCRYPT_ROUNDS = parseInt(process.env['BCRYPT_ROUNDS'] || '12');

// Hash password
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Failed to compare password');
  }
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  // Must contain lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Must contain uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Must contain number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Must contain special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Common password patterns to avoid
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and is not secure');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate random password
export function generateRandomPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Check if password has been compromised (basic check)
export function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    '123456',
    'password',
    '123456789',
    '12345678',
    '12345',
    '1234567',
    '1234567890',
    'qwerty',
    'abc123',
    'million2',
    '000000',
    '1234',
    'iloveyou',
    'aaron431',
    'password1',
    'qqww1122',
    '123',
    'omgpop',
    '123321',
    '654321',
  ];

  return commonPasswords.includes(password.toLowerCase());
}
