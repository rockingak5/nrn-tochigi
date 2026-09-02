import type { Request, Response, NextFunction } from 'express';
import { Page } from '../database/models';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const pages = await Page.findAll({ order: [['title', 'ASC']] });
    res.json(pages);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = `/${req.params.slug}`;
    const page = await Page.findOne({ where: { slug } });
    if (!page) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = `/${req.params.slug}`;
    const page = await Page.findOne({ where: { slug } });
    if (!page) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const { title, imageUrl, body } = req.body;
    await page.update({ title, imageUrl, body });
    res.json(page);
  } catch (err) {
    next(err);
  }
}
