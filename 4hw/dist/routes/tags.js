import { Router } from 'express';
import Tag from '../models/tag.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// GET /api/tags — все теги
router.get('/', async (req, res) => {
    const tags = await Tag.getAll();
    res.json(tags);
});
// POST /api/tags — создать тег (admin/interviewer)
router.post('/', authenticate, (req, res, next) => {
    if (!['admin', 'interviewer'].includes(req.user.role))
        return res.status(403).json({ message: 'Forbidden' });
    next();
}, async (req, res) => {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name required' });
    const tag = await Tag.create(name);
    res.status(201).json(tag);
});
// DELETE /api/tags/:id — удалить тег (admin/interviewer)
router.delete('/:id', authenticate, (req, res, next) => {
    if (!['admin', 'interviewer'].includes(req.user.role))
        return res.status(403).json({ message: 'Forbidden' });
    next();
}, async (req, res) => {
    await Tag.delete(req.params.id);
    res.status(204).send();
});
// POST /api/tags/:taskId/:tagId — привязать тег к задаче (admin/interviewer)
router.post('/:taskId/:tagId', authenticate, (req, res, next) => {
    if (!['admin', 'interviewer'].includes(req.user.role))
        return res.status(403).json({ message: 'Forbidden' });
    next();
}, async (req, res) => {
    await Tag.addTagToTask(req.params.taskId, req.params.tagId);
    res.status(204).send();
});
// DELETE /api/tags/:taskId/:tagId — отвязать тег от задачи (admin/interviewer)
router.delete('/:taskId/:tagId', authenticate, (req, res, next) => {
    if (!['admin', 'interviewer'].includes(req.user.role))
        return res.status(403).json({ message: 'Forbidden' });
    next();
}, async (req, res) => {
    await Tag.removeTagFromTask(req.params.taskId, req.params.tagId);
    res.status(204).send();
});
export default router;
