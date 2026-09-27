import type { Request, Response, NextFunction } from 'express';
import { Service } from '../database/models';
import { cleanupReplacedImage, deleteFileFromS3 } from '../utils/s3';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Service.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, imageUrl, order } = req.body;
    const item = await Service.create({ name, description, imageUrl, order });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await Service.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const oldImageUrl = item.imageUrl;
    const { name, description, imageUrl, order } = req.body;
    await item.update({ name, description, imageUrl, order });
    cleanupReplacedImage(oldImageUrl, item.imageUrl);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await Service.findByPk(req.params.id);
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
