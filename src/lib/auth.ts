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
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  
  const decoded = verifyToken(token);
  return decoded !== null && decoded.isAdmin === true;
}
