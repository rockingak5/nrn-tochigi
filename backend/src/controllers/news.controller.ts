import type { Request, Response, NextFunction } from 'express';
import { NewsItem } from '../database/models';
import { cleanupReplacedImage, deleteFileFromS3 } from '../utils/s3';

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
    const oldImageUrl = item.imageUrl;
    const { title, date, summary, imageUrl } = req.body;
    await item.update({ title, date, summary, imageUrl });
    cleanupReplacedImage(oldImageUrl, item.imageUrl);
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
    void deleteFileFromS3(item.imageUrl);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
