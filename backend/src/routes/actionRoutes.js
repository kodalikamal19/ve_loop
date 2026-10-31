import express from 'express';
import {
  claimDailyBonus,
  watchAdReward,
  convertSves,
  submitWithdrawal,
} from '../controllers/actionController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/daily-bonus', claimDailyBonus);
router.post('/watch-ad', watchAdReward);
router.post('/convert-sves', convertSves);
router.post('/withdraw', submitWithdrawal);

export default router;
