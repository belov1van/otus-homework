import { Router } from 'express';
import User from '../models/user.js';
import { authenticate, requireRole } from '../middleware/auth.js';
const router = Router();
// GET /api/users (admin only)
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});
// GET /api/users/:id (admin or self)
router.get('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role, rating: user.rating });
});
// PATCH /api/users/:id (admin or self)
router.patch('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.update(req.params.id, req.body);
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role, rating: user.rating });
});
// DELETE /api/users/:id (admin or self)
router.delete('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    await User.delete(req.params.id);
    res.status(204).send();
});
export default router;
