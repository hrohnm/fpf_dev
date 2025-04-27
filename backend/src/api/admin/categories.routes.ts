import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all categories' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get category with ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create category', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update category with ID: ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete category with ID: ${req.params.id}` });
});

export default router;
