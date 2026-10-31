import crypto from 'crypto';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { creditBalance, debitBalance, reserveBalance } from '../services/walletService.js';
import { checkAndUnlockAchievements } from '../services/gamificationService.js';

export const claimDailyBonus = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if daily bonus was already claimed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingClaim = await ActivityLog.findOne({
      userId,
      actionType: 'daily_bonus',
      createdAt: { $gte: startOfDay },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'Daily bonus already claimed for today! Please return tomorrow.',
      });
    }

    const rewardVes = 75;
    const rewardGems = 15;
    const rewardXp = 150;

    // Credit VEs, Gems, XP
    await creditBalance({ userId, asset: 'ves', amount: rewardVes, reason: 'Daily Login Reward' });
    await creditBalance({ userId, asset: 'gems', amount: rewardGems, reason: 'Daily Login Gem Drop' });
    const { wallet: updatedWallet } = await creditBalance({
      userId,
      asset: 'xp',
      amount: rewardXp,
      reason: 'Daily Login Experience',
    });

    // Record activity log
    await ActivityLog.create({
      userId,
      actionType: 'daily_bonus',
      description: `Claimed daily reward: +${rewardVes} VEs, +${rewardGems} Gems, +${rewardXp} XP!`,
      asset: 'ves',
      amount: rewardVes,
      status: 'completed',
    });

    // Check achievements
    const newlyUnlocked = await checkAndUnlockAchievements(userId, updatedWallet.balances.xp, {
      daily_logins: 5,
    });

    res.json({
      success: true,
      message: 'Daily bonus claimed successfully!',
      rewardsAwarded: { ves: rewardVes, gems: rewardGems, xp: rewardXp },
      balances: updatedWallet.balances,
      newlyUnlocked,
    });
  } catch (error) {
    next(error);
  }
};

export const watchAdReward = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const rewardVes = 30;
    const rewardGems = 5;
    const rewardXp = 60;

    await creditBalance({ userId, asset: 'ves', amount: rewardVes, reason: 'Sponsored Ad View Completed' });
    await creditBalance({ userId, asset: 'gems', amount: rewardGems, reason: 'Ad Bonus Gem' });
    const { wallet: updatedWallet } = await creditBalance({
      userId,
      asset: 'xp',
      amount: rewardXp,
      reason: 'Ad View Experience',
    });

    await ActivityLog.create({
      userId,
      actionType: 'watch_ads',
      description: `Watched sponsored message: +${rewardVes} VEs, +${rewardGems} Gems, +${rewardXp} XP`,
      asset: 'ves',
      amount: rewardVes,
      status: 'completed',
    });

    const newlyUnlocked = await checkAndUnlockAchievements(userId, updatedWallet.balances.xp);

    res.json({
      success: true,
      message: 'Ad reward credited to your wallet!',
      rewardsAwarded: { ves: rewardVes, gems: rewardGems, xp: rewardXp },
      balances: updatedWallet.balances,
      newlyUnlocked,
    });
  } catch (error) {
    next(error);
  }
};

export const convertSves = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { svesAmount } = req.body;

    const amount = Number(svesAmount);
    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum conversion amount is 10 SVEs.',
      });
    }

    // Debit SVEs
    await debitBalance({
      userId,
      asset: 'sves',
      amount,
      reason: `Converted ${amount} SVEs to VEs`,
    });

    // 1 SVE = 1.2 VEs bonus exchange rate
    const convertedVes = Math.floor(amount * 1.2);
    const xpBonus = Math.floor(amount * 0.5);

    await creditBalance({
      userId,
      asset: 'ves',
      amount: convertedVes,
      reason: `Exchange from ${amount} SVEs (1.2x multiplier)`,
    });

    const { wallet: updatedWallet } = await creditBalance({
      userId,
      asset: 'xp',
      amount: xpBonus,
      reason: 'SVE conversion bonus experience',
    });

    await ActivityLog.create({
      userId,
      actionType: 'sve_conversion',
      description: `Converted ${amount} SVEs into ${convertedVes} VEs (+${xpBonus} XP)`,
      asset: 'ves',
      amount: convertedVes,
      status: 'completed',
    });

    res.json({
      success: true,
      message: `Successfully converted ${amount} SVEs into ${convertedVes} VEs!`,
      convertedVes,
      xpBonus,
      balances: updatedWallet.balances,
    });
  } catch (error) {
    next(error);
  }
};

export const submitWithdrawal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { amount, payoutMethod, upiId, accountNumber, ifscCode, accountHolderName, giftCardEmail } = req.body;

    const vesAmount = Number(amount);
    if (!vesAmount || vesAmount < 200) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is 200 VEs.',
      });
    }

    if (!payoutMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a payout method.',
      });
    }

    // Check available balance and reserve it
    const withdrawalId = `WDR-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const fiatEquivalent = Math.round(vesAmount * 0.5); // 200 VEs = ₹100

    // Reserve balance in wallet ledger
    const { wallet: updatedWallet } = await reserveBalance({
      userId,
      asset: 'ves',
      amount: vesAmount,
      reason: `Pending payout request #${withdrawalId}`,
      referenceId: withdrawalId,
    });

    const withdrawal = await Withdrawal.create({
      userId,
      withdrawalId,
      asset: 'ves',
      amount: vesAmount,
      fiatEquivalent,
      payoutMethod,
      payoutDetails: {
        upiId: upiId || '',
        accountNumber: accountNumber || '',
        ifscCode: ifscCode || '',
        accountHolderName: accountHolderName || '',
        giftCardEmail: giftCardEmail || '',
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: 'Withdrawal requested by user.',
          changedBy: userId,
          timestamp: new Date(),
        },
      ],
      transactionReference: withdrawalId,
    });

    await ActivityLog.create({
      userId,
      actionType: 'redemption_request',
      description: `Requested withdrawal of ${vesAmount} VEs (₹${fiatEquivalent}) via ${payoutMethod}`,
      asset: 'ves',
      amount: vesAmount,
      status: 'pending',
      metadata: { withdrawalId },
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully! Your balance has been reserved.',
      withdrawal,
      balances: updatedWallet.balances,
      reservedBalances: updatedWallet.reservedBalances,
    });
  } catch (error) {
    next(error);
  }
};
