import { Router } from 'express';
import { list, getBySlug, update } from '../controllers/pages.controller';
import { requireAdminAuth } from '../middlewares/requireAdminAuth';

const router = Router();

router.get('/', list);
router.get('/:slug', getBySlug);
router.put('/:slug', requireAdminAuth, update);

export default router;
