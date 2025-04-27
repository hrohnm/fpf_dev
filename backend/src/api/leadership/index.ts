import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import dashboardRoutes from './dashboard.routes';
import statisticsRoutes from './statistics.routes';
import reportsRoutes from './reports.routes';

const router = Router();

// Apply auth and role middleware to all leadership routes
router.use(authMiddleware, roleMiddleware(['leadership', 'admin']));

// Mount leadership route groups
router.use('/dashboard', dashboardRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/reports', reportsRoutes);

export default router;
