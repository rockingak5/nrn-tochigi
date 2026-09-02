import { Router } from 'express';
import userRoutes from './user.routes';
import adminAuthRoutes from './adminAuth.routes';
import uploadsRoutes from './uploads.routes';
import newsRoutes from './news.routes';
import eventsRoutes from './events.routes';
import servicesRoutes from './services.routes';
import teamMembersRoutes from './teamMembers.routes';
import pagesRoutes from './pages.routes';
import homeSettingsRoutes from './homeSettings.routes';
import activitiesRoutes from './activities.routes';
import contactRoutes from './contact.routes';
import contactMessagesRoutes from './contactMessages.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/admin', adminAuthRoutes);
router.use('/admin/uploads', uploadsRoutes);
router.use('/admin/contact-messages', contactMessagesRoutes);
router.use('/news', newsRoutes);
router.use('/events', eventsRoutes);
router.use('/services', servicesRoutes);
router.use('/team', teamMembersRoutes);
router.use('/pages', pagesRoutes);
router.use('/home-settings', homeSettingsRoutes);
router.use('/activities', activitiesRoutes);
router.use('/contact', contactRoutes);

export default router;
