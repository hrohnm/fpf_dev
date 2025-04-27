import { Router } from 'express';
import { getAllCategories } from '../../controllers/carrier/category.controller';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';

const router = Router();

// Apply carrier access middleware to all category routes
router.use(carrierAccessMiddleware);

// Category routes
router.get('/all', getAllCategories);

export default router;
