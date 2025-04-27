import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all carriers for manager' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get carrier with ID: ${req.params.id} for manager` });
});

export default router;
