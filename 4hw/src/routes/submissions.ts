import { Router } from 'express';
import Submission from '../models/submission.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/submissions/:taskId — отправить решение
router.post('/:taskId', authenticate, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: 'Code required' });
  const submission = await Submission.create({
    userId: req.user.id,
    taskId: req.params.taskId,
    code
  });
  res.status(201).json(submission);
});

// GET /api/submissions/:taskId — все решения задачи (admin/interviewer)
router.get('/:taskId', authenticate, async (req, res) => {
  if (!['admin', 'interviewer'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const submissions = await Submission.getByTask(req.params.taskId);
  res.json(submissions);
});

// GET /api/submissions/user — свои решения
router.get('/user/all', authenticate, async (req, res) => {
  const submissions = await Submission.getByUser(req.user.id);
  res.json(submissions);
});

// PATCH /api/submissions/:id — обновить статус (admin/interviewer)
router.patch('/:id', authenticate, async (req, res) => {
  if (!['admin', 'interviewer'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Status required' });
  const updated = await Submission.updateStatus(req.params.id, status);
  res.json(updated);
});

export default router; 