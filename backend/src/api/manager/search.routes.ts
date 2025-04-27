import { Router } from 'express';
import { 
  searchFacilities, 
  searchByCategory 
} from '../../controllers/manager/search.controller';
import { validate } from '../../middlewares/validation.middleware';
import { searchSchema, categorySearchSchema } from '../../validations/search.validation';

const router = Router();

// Search routes
router.post('/', validate(searchSchema), searchFacilities);
router.post('/category/:categoryId', validate(categorySearchSchema, 'params'), searchByCategory);

export default router;
