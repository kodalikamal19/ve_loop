import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Referral } from '../models/Referral.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { calculateLevelProgress } from '../services/gamificationService.js';

export const getProfileMe = async (req, res, next) => {
  try {
    const user = req.user;

    // Fetch user wallet
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        userIdentifier: user.userId,
        balances: { ves: 0, sves: 0, gems: 0, tokens: 0, xp: 0 },
        reservedBalances: { ves: 0, sves: 0, gems: 0, tokens: 0 },
      });
    }

    // Calculate level progression based on XP
    const levelProgress = await calculateLevelProgress(wallet.balances.xp);

    // Fetch withdrawal statistics
    const withdrawalStats = await Withdrawal.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          pendingRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          approvedRequests: {
            $sum: {
              $cond: [{ $in: ['$status', ['approved', 'completed']] }, 1, 0],
            },
          },
          rejectedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
          totalWithdrawn: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$fiatEquivalent',
                0,
              ],
            },
          },
        },
      },
    ]);

    const withdrawals = withdrawalStats[0] || {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      totalWithdrawn: 0,
    };

    // Fetch referral statistics
    const referralStats = await Referral.aggregate([
      { $match: { referrerId: user._id } },
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: 1 },
          successfulReferrals: {
            $sum: {
              $cond: [{ $in: ['$status', ['successful', 'rewarded']] }, 1, 0],
            },
          },
          pendingReferrals: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          rewardsEarned: {
            $sum: {
              $cond: [{ $eq: ['$isRewarded', true] }, '$rewardVes', 0],
            },
          },
          referralXp: {
            $sum: {
              $cond: [{ $eq: ['$isRewarded', true] }, '$rewardXp', 0],
            },
          },
        },
      },
    ]);

    const referrals = referralStats[0] || {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      rewardsEarned: 0,
      referralXp: 0,
    };

    // Fetch unlocked achievements count
    const totalAchievementsCount = await Achievement.countDocuments({ isActive: true });
    const unlockedAchievementsCount = await UserAchievement.countDocuments({
      userId: user._id,
      isUnlocked: true,
    });

    res.json({
      success: true,
      profile: {
        userId: user.userId,
        name: user.name,
        displayName: user.displayName || user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        isEmailVerified: user.isEmailVerified,
        memberSince: user.createdAt,
      },
      rewards: {
        ves: wallet.balances.ves,
        sves: wallet.balances.sves,
        gems: wallet.balances.gems,
        tokens: wallet.balances.tokens,
        xp: wallet.balances.xp,
        reservedVes: wallet.reservedBalances.ves || 0,
      },
      levelProgress: {
        currentLevel: levelProgress.currentLevel,
        currentLevelName: levelProgress.currentLevelName,
        nextLevel: levelProgress.nextLevel,
        nextLevelName: levelProgress.nextLevelName,
        currentXp: levelProgress.currentXp,
        nextLevelXp: levelProgress.nextLevelXp,
        xpRemaining: levelProgress.xpRemaining,
        progressPercent: levelProgress.progressPercent,
        badgeIcon: levelProgress.badgeIcon,
        badgeColor: levelProgress.badgeColor,
        isMaxLevel: levelProgress.isMaxLevel,
      },
      achievementsSummary: {
        unlockedCount: unlockedAchievementsCount,
        totalCount: totalAchievementsCount,
      },
      withdrawalsSummary: {
        totalRequests: withdrawals.totalRequests,
        pending: withdrawals.pendingRequests,
        approved: withdrawals.approvedRequests,
        rejected: withdrawals.rejectedRequests,
        totalWithdrawn: withdrawals.totalWithdrawn,
      },
      referralsSummary: {
        referralCode: user.referralCode,
        total: referrals.totalReferrals,
        successful: referrals.successfulReferrals,
        pending: referrals.pendingReferrals,
        rewardsEarned: referrals.rewardsEarned,
        referralXp: referrals.referralXp,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileMe = async (req, res, next) => {
  try {
    const user = req.user;
    const { displayName, bio, profileImage } = req.body;

    // Backend strictly enforces which fields can be updated by user
    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Display name must be at least 2 characters long.',
        });
      }
      user.displayName = displayName.trim();
    }

    if (bio !== undefined) {
      user.bio = typeof bio === 'string' ? bio.slice(0, 300).trim() : user.bio;
    }

    if (profileImage !== undefined) {
      user.profileImage = typeof profileImage === 'string' ? profileImage.trim() : '';
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        userId: user.userId,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRewards = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    res.json({
      success: true,
      rewards: {
        ves: wallet.balances.ves,
        sves: wallet.balances.sves,
        gems: wallet.balances.gems,
        tokens: wallet.balances.tokens,
        xp: wallet.balances.xp,
        reservedVes: wallet.reservedBalances.ves || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLevelProgress = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const currentXp = wallet ? wallet.balances.xp : 0;
    const levelInfo = await calculateLevelProgress(currentXp);

    res.json({
      success: true,
      levelProgress: levelInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req, res, next) => {
  try {
    const allAchievements = await Achievement.find({ isActive: true }).sort({ category: 1, targetValue: 1 });
    const userAchievements = await UserAchievement.find({ userId: req.user._id });
    const userAchMap = new Map();
    userAchievements.forEach((ua) => userAchMap.set(ua.achievementCode, ua));

    const achievementsList = allAchievements.map((ach) => {
      const ua = userAchMap.get(ach.code);
      return {
        id: ach._id,
        code: ach.code,
        name: ach.name,
        description: ach.description,
        category: ach.category,
        badgeIcon: ach.badgeIcon,
        badgeColor: ach.badgeColor,
        targetMetric: ach.targetMetric,
        targetValue: ach.targetValue,
        rewardAsset: ach.rewardAsset,
        rewardAmount: ach.rewardAmount,
        isUnlocked: ua ? ua.isUnlocked : false,
        currentProgress: ua ? ua.currentProgress : 0,
        unlockedAt: ua ? ua.unlockedAt : null,
      };
    });

    res.json({
      success: true,
      achievements: achievementsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawalSummary = async (req, res, next) => {
  try {
    const stats = await Withdrawal.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $in: ['$status', ['approved', 'completed']] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          totalWithdrawn: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$fiatEquivalent', 0] },
          },
        },
      },
    ]);

    const summary = stats[0] || {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalWithdrawn: 0,
    };

    // Also fetch recent 10 withdrawals
    const recentWithdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      summary,
      recent: recentWithdrawals,
    });
  } catch (error) {
    next(error);
  }
};

export const getReferrals = async (req, res, next) => {
  try {
    const stats = await Referral.aggregate([
      { $match: { referrerId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $in: ['$status', ['successful', 'rewarded']] }, 1, 0] },
          },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          rewardsEarned: {
            $sum: { $cond: [{ $eq: ['$isRewarded', true] }, '$rewardVes', 0] },
          },
          referralXp: {
            $sum: { $cond: [{ $eq: ['$isRewarded', true] }, '$rewardXp', 0] },
          },
        },
      },
    ]);

    const referralsData = stats[0] || {
      total: 0,
      successful: 0,
      pending: 0,
      rewardsEarned: 0,
      referralXp: 0,
    };

    const referralsList = await Referral.find({ referrerId: req.user._id })
      .populate('referredUserId', 'displayName name email profileImage createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      referralCode: req.user.referralCode,
      summary: referralsData,
      referrals: referralsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const activities = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      activity: activities,
    });
  } catch (error) {
    next(error);
  }
};
