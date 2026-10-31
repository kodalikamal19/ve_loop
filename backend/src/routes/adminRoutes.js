import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  adjustUserBalance,
  getWithdrawals,
  updateWithdrawalStatus,
  getLevels,
  saveLevel,
  getAchievements,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Admin login route
router.post('/login', authRateLimiter, adminLogin);

// Protected Admin routes
router.use(authenticateUser);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', updateUserStatus);
router.post('/users/:id/adjust-balance', adjustUserBalance);
router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/status', updateWithdrawalStatus);
router.get('/levels', getLevels);
router.post('/levels', saveLevel);
router.get('/achievements', getAchievements);
router.get('/audit-logs', getAuditLogs);

export default router;
