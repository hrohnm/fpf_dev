import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get carrier statistics' });
});

router.get('/occupancy', (req, res) => {
  res.json({ message: 'Get carrier occupancy statistics' });
});

export default router;
