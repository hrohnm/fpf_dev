import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';
import carrierRoutes from './carrier';
import managerRoutes from './manager';
import leadershipRoutes from './leadership';

const router = Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/carrier', carrierRoutes);
router.use('/manager', managerRoutes);
router.use('/leadership', leadershipRoutes);

export default router;
