import type { Request, Response, NextFunction } from 'express';
import { Event } from '../database/models';
import { cleanupReplacedImage, deleteFileFromS3 } from '../utils/s3';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Event.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, date, description, imageUrl } = req.body;
    const item = await Event.create({ title, date, description, imageUrl });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await Event.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const oldImageUrl = item.imageUrl;
    const { title, date, description, imageUrl } = req.body;
    await item.update({ title, date, description, imageUrl });
    cleanupReplacedImage(oldImageUrl, item.imageUrl);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await Event.findByPk(req.params.id);
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
