import { Router } from 'express';
import { get, update } from '../controllers/homeSettings.controller';
import { requireAdminAuth } from '../middlewares/requireAdminAuth';

const router = Router();

router.get('/', get);
router.put('/', requireAdminAuth, update);

export default router;
