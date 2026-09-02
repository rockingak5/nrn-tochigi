import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { Admin } from '../database/models';

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

    req.session.adminId = admin.id;
    res.json({ id: admin.id, username: admin.username });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
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
    if (!req.session.adminId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const admin = await Admin.findByPk(req.session.adminId);
    if (!admin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.json({ id: admin.id, username: admin.username });
  } catch (err) {
    next(err);
  }
}
