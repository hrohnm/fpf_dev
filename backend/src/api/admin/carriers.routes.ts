import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all carriers' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get carrier with ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create carrier', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update carrier with ID: ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete carrier with ID: ${req.params.id}` });
});

export default router;
