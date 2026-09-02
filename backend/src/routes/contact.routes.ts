import { Router } from 'express';
import { create } from '../controllers/contactMessages.controller';

const router = Router();

router.post('/', create);

export default router;
