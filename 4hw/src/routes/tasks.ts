import { Router } from 'express';
import Task from '../models/task.js';

const router = Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  const tasks = await Task.getAll();
  res.json(tasks);
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  const task = await Task.getById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  const task = await Task.update(req.params.id, req.body);
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  await Task.delete(req.params.id);
  res.status(204).send();
});

export default router; 