import express from 'express';
import {
  getProfileMe,
  updateProfileMe,
  getRewards,
  getLevelProgress,
  getAchievements,
  getWithdrawalSummary,
  getReferrals,
  getActivity,
} from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All profile endpoints are strictly protected and derive identity from token
router.use(authenticateUser);

router.get('/me', getProfileMe);
router.patch('/me', updateProfileMe);
router.get('/rewards', getRewards);
router.get('/level-progress', getLevelProgress);
router.get('/achievements', getAchievements);
router.get('/withdrawal-summary', getWithdrawalSummary);
router.get('/referrals', getReferrals);
router.get('/activity', getActivity);

export default router;
