import { Router } from 'express';
import { list, create, update, remove } from '../controllers/news.controller';
import { requireAdminAuth } from '../middlewares/requireAdminAuth';

const router = Router();

router.get('/', list);
router.post('/', requireAdminAuth, create);
router.put('/:id', requireAdminAuth, update);
router.delete('/:id', requireAdminAuth, remove);

export default router;
