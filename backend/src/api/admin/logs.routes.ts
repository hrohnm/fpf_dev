import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all logs' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get log with ID: ${req.params.id}` });
});

export default router;
