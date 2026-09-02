import type { Request, Response, NextFunction } from 'express';
import { ContactMessage } from '../database/models';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ message: 'name, email, and message are required' });
      return;
    }
    const item = await ContactMessage.create({ name, email, message });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    await item.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
