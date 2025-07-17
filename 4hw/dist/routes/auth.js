import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    // Можно добавить проверку username на уникальность
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});
export default router;
