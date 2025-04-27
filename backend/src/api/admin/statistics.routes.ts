import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get statistics' });
});

router.get('/occupancy', (req, res) => {
  res.json({ message: 'Get occupancy statistics' });
});

router.get('/categories', (req, res) => {
  res.json({ message: 'Get category statistics' });
});

export default router;
