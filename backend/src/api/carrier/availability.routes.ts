import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all availabilities' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get availability with ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create availability', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update availability with ID: ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete availability with ID: ${req.params.id}` });
});

export default router;
