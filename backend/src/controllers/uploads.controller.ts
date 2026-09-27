import crypto from 'node:crypto';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../utils/s3';

export async function upload(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const key = `uploads/${crypto.randomUUID()}${ext}`;
    const url = await uploadFileToS3({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });
    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
}
