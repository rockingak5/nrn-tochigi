import type { Request, Response, NextFunction } from 'express';
import { User } from '../database/models';

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
