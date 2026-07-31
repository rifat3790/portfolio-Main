import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-luxury-jwt-secret-key-10398';

export interface DecodedToken {
  isAdmin: boolean;
  exp: number;
}

export function signToken(): string {
  // Signs token valid for 7 days
  return jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export function isAuthenticated(req: NextRequest): boolean {
  // Check cookie
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken && verifyToken(cookieToken)?.isAdmin) {
    return true;
  }

  // Check Bearer authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    if (bearerToken && verifyToken(bearerToken)?.isAdmin) {
      return true;
    }
  }

  // Check x-admin-token header
  const customHeaderToken = req.headers.get('x-admin-token');
  if (customHeaderToken && verifyToken(customHeaderToken)?.isAdmin) {
    return true;
  }

  // Check direct x-admin-password header for mobile quick auth
  const customAdminPassword = req.headers.get('x-admin-password');
  const envPassword = process.env.ADMIN_PASSWORD || 'admin';
  if (customAdminPassword && customAdminPassword === envPassword) {
    return true;
  }

  return false;
}
