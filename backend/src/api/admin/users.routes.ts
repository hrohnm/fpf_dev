import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../../controllers/admin/user.controller';
import { validate } from '../../middlewares/validation.middleware';
import { 
  createUserSchema, 
  updateUserSchema, 
  userIdSchema 
} from '../../validations/user.validation';

const router = Router();

// User routes
router.get('/', getUsers);
router.get('/:id', validate(userIdSchema, 'params'), getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', validate(userIdSchema, 'params'), deleteUser);

export default router;
