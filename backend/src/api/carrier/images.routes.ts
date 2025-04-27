import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all images' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get image with ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Upload image', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update image with ID: ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete image with ID: ${req.params.id}` });
});

export default router;
