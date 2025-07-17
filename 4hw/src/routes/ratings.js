import { Router } from 'express';
import TaskRating from '../models/taskRating.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/ratings/:taskId — поставить/обновить рейтинг
router.post('/:taskId', authenticate, async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Value must be 1-5' });
  const rating = await TaskRating.setOrUpdate(req.user.id, req.params.taskId, value);
  res.status(201).json(rating);
});

// GET /api/ratings/:taskId — средний рейтинг и количество
router.get('/:taskId', async (req, res) => {
  const avg = await TaskRating.getAvg(req.params.taskId);
  res.json(avg);
});

// GET /api/ratings/:taskId/self — свой рейтинг
router.get('/:taskId/self', authenticate, async (req, res) => {
  const value = await TaskRating.getUserRating(req.user.id, req.params.taskId);
  res.json({ value });
});

export default router; 