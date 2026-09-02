import type { Request, Response, NextFunction } from 'express';
import { TeamMember } from '../database/models';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await TeamMember.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, role, photoUrl, order } = req.body;
    const item = await TeamMember.create({ name, role, photoUrl, order });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await TeamMember.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const { name, role, photoUrl, order } = req.body;
    await item.update({ name, role, photoUrl, order });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await TeamMember.findByPk(req.params.id);
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
