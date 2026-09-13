import type { Request, Response, NextFunction } from 'express';
import { getBearerToken, verifyAdminToken } from '../utils/adminToken';

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminId?: number;
    }
  }
}

// Resolves the authenticated admin id from either the (mostly non-functional,
// see adminToken.ts) session cookie or the `Authorization: Bearer` token, and
// caches it on `req.adminId` for downstream handlers.
export function resolveAdminId(req: Request): number | null {
  const bearerAdminId = verifyAdminToken(getBearerToken(req.headers.authorization));
  if (bearerAdminId) return bearerAdminId;
  return req.session.adminId ?? null;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminId = resolveAdminId(req);
  if (!adminId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  req.adminId = adminId;
  next();
}
