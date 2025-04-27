import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all favorites' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get favorite with ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create favorite', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update favorite with ID: ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete favorite with ID: ${req.params.id}` });
});

export default router;
