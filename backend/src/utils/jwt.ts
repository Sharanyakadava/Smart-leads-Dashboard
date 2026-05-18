import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (
  id: string,
  email: string,
  role: UserRole
): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiry = process.env.JWT_EXPIRY || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: JwtPayload = { id, email, role };
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry } as jwt.SignOptions);
};
