import { Router } from 'express';
import { list, remove } from '../controllers/contactMessages.controller';
import { requireAdminAuth } from '../middlewares/requireAdminAuth';

const router = Router();

router.get('/', requireAdminAuth, list);
router.delete('/:id', requireAdminAuth, remove);

export default router;
