import { Router } from 'express';
import { login, logout, me } from '../controllers/adminAuth.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
