import type { Request, Response, NextFunction } from 'express';
import { HomeSettings } from '../database/models';
import { deleteFileFromS3 } from '../utils/s3';

export async function get(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await HomeSettings.findOne();
    res.json(settings ?? { heroImageUrl: null, activitiesImageUrl: null, siteLogoUrl: null });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { heroImageUrl, activitiesImageUrl, siteLogoUrl } = req.body;
    const [settings, wasCreated] = await HomeSettings.findOrCreate({
      where: {},
      defaults: { heroImageUrl, activitiesImageUrl, siteLogoUrl },
    });

    const oldUrls = wasCreated
      ? []
      : [settings.heroImageUrl, settings.activitiesImageUrl, settings.siteLogoUrl];

    await settings.update({ heroImageUrl, activitiesImageUrl, siteLogoUrl });

    // Built from the instance's post-update values, not the raw request
    // body: Sequelize's `update()` drops any key whose value is `undefined`
    // (a field omitted from the request), so a field left out of the body
    // keeps its old value on `settings` even though the destructured local
    // above is `undefined` — comparing against the body would wrongly treat
    // "not sent" as "cleared" and delete a file this record still uses.
    const newUrls = new Set([settings.heroImageUrl, settings.activitiesImageUrl, settings.siteLogoUrl]);
    for (const oldUrl of oldUrls) {
      if (oldUrl && !newUrls.has(oldUrl)) void deleteFileFromS3(oldUrl);
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
}
