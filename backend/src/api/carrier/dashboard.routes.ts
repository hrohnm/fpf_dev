import { Router } from 'express';
import { getDashboardData } from '../../controllers/carrier/dashboard.controller';

const router = Router();

// Dashboard routes
router.get('/', getDashboardData);

export default router;
