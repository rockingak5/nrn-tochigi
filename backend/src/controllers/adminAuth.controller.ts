import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { Admin } from '../database/models';
import { signAdminToken } from '../utils/adminToken';
import { resolveAdminId } from '../middlewares/requireAdminAuth';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'username and password are required' });
      return;
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Set the session cookie too, in case this ever runs somewhere the
    // hosting platform doesn't strip it — but the real, load-bearing
    // credential is the bearer token below (see utils/adminToken.ts).
    req.session.adminId = admin.id;
    const token = signAdminToken(admin.id);
    res.json({ id: admin.id, username: admin.username, token });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  // Bearer tokens are stateless (not stored server-side), so there's nothing
  // to invalidate for them — the client just discards it. Still tear down
  // the session/cookie for completeness.
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.json({ id: admin.id, username: admin.username });
  } catch (err) {
    next(err);
  }
}
