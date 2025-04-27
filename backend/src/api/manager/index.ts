import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import searchRoutes from './search.routes';
import categoriesRoutes from './categories.routes';
import carriersRoutes from './carriers.routes';
import facilitiesRoutes from './facilities.routes';
import favoritesRoutes from './favorites.routes';
import filtersRoutes from './filters.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Apply auth and role middleware to all manager routes
router.use(authMiddleware, roleMiddleware(['manager', 'admin']));

// Mount manager route groups
router.use('/dashboard', dashboardRoutes);
router.use('/search', searchRoutes);
router.use('/categories', categoriesRoutes);
router.use('/carriers', carriersRoutes);
router.use('/facilities', facilitiesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/filters', filtersRoutes);

export default router;
