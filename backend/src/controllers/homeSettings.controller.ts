import type { Request, Response, NextFunction } from 'express';
import { HomeSettings } from '../database/models';

export async function get(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await HomeSettings.findOne();
    res.json(settings ?? { heroImageUrl: null, activitiesImageUrl: null });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { heroImageUrl, activitiesImageUrl } = req.body;
    const [settings] = await HomeSettings.findOrCreate({ where: {}, defaults: { heroImageUrl, activitiesImageUrl } });
    await settings.update({ heroImageUrl, activitiesImageUrl });
    res.json(settings);
  } catch (err) {
    next(err);
  }
}
