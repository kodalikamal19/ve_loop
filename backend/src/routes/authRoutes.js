import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', authenticateUser, getMe);

export default router;
