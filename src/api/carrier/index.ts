import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import facilitiesRoutes from './facilities.routes';
import availabilityRoutes from './availability.routes';
import imagesRoutes from './images.routes';
import statisticsRoutes from './statistics.routes';
import dashboardRoutes from './dashboard.routes';
import categoryRoutes from './category.routes';
import placesRoutes from './places.routes';

const router = Router();

// Apply auth and role middleware to all carrier routes
router.use(authMiddleware, roleMiddleware(['carrier', 'admin']));

// Mount carrier route groups
router.use('/dashboard', dashboardRoutes);
router.use('/facilities', facilitiesRoutes);
router.use('/availability', availabilityRoutes);
router.use('/images', imagesRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/categories', categoryRoutes);
router.use('/', placesRoutes);  // Mount places routes at the root level

export default router;
