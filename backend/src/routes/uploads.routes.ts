import { Router } from 'express';
import multer from 'multer';
import { upload as uploadController } from '../controllers/uploads.controller';
import { requireAdminAuth } from '../middlewares/requireAdminAuth';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

// Buffered in memory (files are capped at 5MB below) rather than written to
// local disk, since the controller streams the buffer straight to S3 —
// there is no local file to clean up either way.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Unsupported file type'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', requireAdminAuth, upload.single('file'), uploadController);

export default router;
