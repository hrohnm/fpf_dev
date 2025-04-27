import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all categories for manager' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get category with ID: ${req.params.id} for manager` });
});

export default router;
