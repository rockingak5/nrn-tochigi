import type { Request, Response, NextFunction } from 'express';
import { NewsItem } from '../database/models';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await NewsItem.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, date, summary, imageUrl } = req.body;
    const item = await NewsItem.create({ title, date, summary, imageUrl });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await NewsItem.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const { title, date, summary, imageUrl } = req.body;
    await item.update({ title, date, summary, imageUrl });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await NewsItem.findByPk(req.params.id);
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
