import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Token response interface
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Get JWT secrets from environment
const getJWTSecrets = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not configured. Please set JWT_SECRET and JWT_REFRESH_SECRET in environment variables.');
  }

  return { JWT_SECRET, JWT_REFRESH_SECRET };
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Generate access token
export function generateAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const { JWT_SECRET } = getJWTSecrets();
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'vibecoder-api',
    audience: 'vibecoder-app',
  });
}

// Generate refresh token
export function generateRefreshToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const { JWT_REFRESH_SECRET } = getJWTSecrets();
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'vibecoder-api',
    audience: 'vibecoder-app',
  });
}

// Generate both tokens
export function generateTokens(user: Pick<User, 'id' | 'email' | 'role'>): TokenResponse {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Calculate expiration time in seconds
  const decoded = jwt.decode(accessToken) as any;
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload {
  const { JWT_SECRET } = getJWTSecrets();
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'vibecoder-api',
      audience: 'vibecoder-app',
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): JWTPayload {
  const { JWT_REFRESH_SECRET } = getJWTSecrets();
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'vibecoder-api',
      audience: 'vibecoder-app',
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return true;
  }
  return expiration < new Date();
}
