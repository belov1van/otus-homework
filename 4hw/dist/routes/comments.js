import { Router } from 'express';
import Comment from '../models/comment.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// GET /api/comments/:taskId — все комментарии задачи
router.get('/:taskId', async (req, res) => {
    const comments = await Comment.getByTask(req.params.taskId);
    res.json(comments);
});
// POST /api/comments/:taskId — создать комментарий
router.post('/:taskId', authenticate, async (req, res) => {
    const { text } = req.body;
    if (!text)
        return res.status(400).json({ message: 'Text required' });
    const comment = await Comment.create({
        userId: req.user.id,
        taskId: req.params.taskId,
        text
    });
    res.status(201).json(comment);
});
// DELETE /api/comments/:id — удалить комментарий
router.delete('/:id', authenticate, async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const ok = await Comment.delete(req.params.id, req.user.id, isAdmin);
    if (!ok)
        return res.status(403).json({ message: 'Forbidden' });
    res.status(204).send();
});
export default router;
