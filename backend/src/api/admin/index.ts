import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import usersRoutes from './users.routes';
import carriersRoutes from './carriers.routes';
import categoriesRoutes from './categories.routes';
import logsRoutes from './logs.routes';
import statisticsRoutes from './statistics.routes';
import settingsRoutes from './settings.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Apply auth and role middleware to all admin routes
router.use(authMiddleware, roleMiddleware(['admin']));

// Mount admin route groups
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/carriers', carriersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/logs', logsRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/settings', settingsRoutes);

export default router;
