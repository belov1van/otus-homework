import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import taskRoutes from './tasks.js';
import commentRoutes from './comments.js';
import tagRoutes from './tags.js';
import ratingRoutes from './ratings.js';
import submissionRoutes from './submissions.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);
router.use('/ratings', ratingRoutes);
router.use('/submissions', submissionRoutes);

export default router; 