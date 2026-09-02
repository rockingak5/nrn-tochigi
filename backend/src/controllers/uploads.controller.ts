import type { Request, Response } from 'express';

export function upload(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}
