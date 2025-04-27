import { Router } from 'express';
import {
  getCarriers,
  getAllCarriers,
  getCarrierById,
  createCarrier,
  updateCarrier,
  deleteCarrier
} from '../../controllers/admin/carrier.controller';

const router = Router();

// Carrier routes
router.get('/', getCarriers);
router.get('/all', getAllCarriers);
router.get('/:id', getCarrierById);
router.post('/', createCarrier);
router.put('/:id', updateCarrier);
router.delete('/:id', deleteCarrier);

export default router;
