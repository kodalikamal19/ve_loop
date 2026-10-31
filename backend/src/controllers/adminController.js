import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Referral } from '../models/Referral.js';
import { LevelConfiguration } from '../models/LevelConfiguration.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { creditBalance, debitBalance, releaseReservedBalance } from '../services/walletService.js';
import { calculateLevelProgress } from '../services/gamificationService.js';

const generateAdminToken = (user) => {
  const secret = process.env.JWT_SECRET || 'veloop-rewards-super-secret-key-2026';
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      email: user.email,
      role: user.role,
      isAdmin: true,
    },
    secret,
    { expiresIn: '1d' }
  );
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required.',
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: { $in: ['admin', 'superadmin'] },
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials or insufficient access.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials or insufficient access.',
      });
    }

    // Log admin login event in audit log
    await AdminAuditLog.create({
      adminId: admin._id,
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN',
      targetModel: 'User',
      targetId: admin._id,
      targetIdentifier: admin.userId,
      summary: `Admin ${admin.name} logged in successfully.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    const token = generateAdminToken(admin);

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        userId: admin.userId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. User metrics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', accountStatus: 'ACTIVE' });
    const suspendedUsers = await User.countDocuments({ role: 'user', accountStatus: 'SUSPENDED' });

    // 2. Total wallet balances by asset
    const walletAgg = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalVes: { $sum: '$balances.ves' },
          totalSves: { $sum: '$balances.sves' },
          totalGems: { $sum: '$balances.gems' },
          totalTokens: { $sum: '$balances.tokens' },
          totalXp: { $sum: '$balances.xp' },
        },
      },
    ]);

    const totalBalances = walletAgg[0] || {
      totalVes: 0,
      totalSves: 0,
      totalGems: 0,
      totalTokens: 0,
      totalXp: 0,
    };

    // 3. Withdrawal metrics
    const withdrawalAgg = await Withdrawal.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          totalAmountWithdrawn: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$fiatEquivalent', 0] },
          },
        },
      },
    ]);

    const withdrawalStats = withdrawalAgg[0] || {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      totalAmountWithdrawn: 0,
    };

    // 4. Referral stats
    const totalReferrals = await Referral.countDocuments();
    const successfulReferrals = await Referral.countDocuments({
      status: { $in: ['successful', 'rewarded'] },
    });

    // 5. Recent system alerts / audits
    const recentAuditLogs = await AdminAuditLog.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        balances: totalBalances,
        withdrawals: withdrawalStats,
        referrals: {
          total: totalReferrals,
          successful: successfulReferrals,
        },
        recentAuditLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status || '';

    const query = { role: 'user' };
    if (status && status !== 'ALL') {
      query.accountStatus = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Fetch wallets for each user
    const userIds = users.map((u) => u._id);
    const wallets = await Wallet.find({ userId: { $in: userIds } });
    const walletMap = new Map();
    wallets.forEach((w) => walletMap.set(String(w.userId), w));

    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const w = walletMap.get(String(u._id));
        const xp = w ? w.balances.xp : 0;
        const levelProg = await calculateLevelProgress(xp);
        return {
          _id: u._id,
          userId: u.userId,
          name: u.name,
          displayName: u.displayName || u.name,
          email: u.email,
          referralCode: u.referralCode,
          accountStatus: u.accountStatus,
          statusReason: u.statusReason,
          isEmailVerified: u.isEmailVerified,
          createdAt: u.createdAt,
          balances: w ? w.balances : { ves: 0, sves: 0, gems: 0, tokens: 0, xp: 0 },
          level: levelProg.currentLevel,
          levelName: levelProg.currentLevelName,
        };
      })
    );

    res.json({
      success: true,
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    const xp = wallet ? wallet.balances.xp : 0;
    const levelProgress = await calculateLevelProgress(xp);

    const transactions = await WalletTransaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const withdrawals = await Withdrawal.find({ userId: user._id })
      .sort({ createdAt: -1 });

    const referrals = await Referral.find({ referrerId: user._id })
      .populate('referredUserId', 'displayName name email')
      .sort({ createdAt: -1 });

    const achievements = await UserAchievement.find({ userId: user._id })
      .populate('achievementId');

    const auditHistory = await AdminAuditLog.find({ targetId: user._id })
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      user,
      wallet: wallet ? wallet.balances : {},
      reservedBalances: wallet ? wallet.reservedBalances : {},
      levelProgress,
      transactions,
      withdrawals,
      referrals,
      achievements,
      auditHistory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['ACTIVE', 'SUSPENDED', 'UNDER_REVIEW'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (!reason || reason.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'A mandatory administrative reason (minimum 3 characters) is required.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const prevStatus = user.accountStatus;
    user.accountStatus = status;
    user.statusReason = reason.trim();
    await user.save();

    // Record auditable log
    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'ACCOUNT_RESTRICTION',
      targetModel: 'User',
      targetId: user._id,
      targetIdentifier: user.userId,
      summary: `Changed user ${user.userId} status from ${prevStatus} to ${status}. Reason: ${reason}`,
      changes: { before: { status: prevStatus }, after: { status } },
      reason: reason.trim(),
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `User status successfully updated to ${status}.`,
      user: {
        _id: user._id,
        userId: user.userId,
        accountStatus: user.accountStatus,
        statusReason: user.statusReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adjustUserBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { asset, type, amount, reason } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0.' });
    }

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be credit or debit.' });
    }

    if (!['ves', 'sves', 'gems', 'tokens', 'xp'].includes(asset)) {
      return res.status(400).json({ success: false, message: 'Invalid asset specified.' });
    }

    if (!reason || reason.trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'A detailed administrative reason (at least 4 characters) is required for audit compliance.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    const prevBalance = wallet.balances[asset] || 0;

    let result;
    if (type === 'credit') {
      result = await creditBalance({
        userId: user._id,
        asset,
        amount: numAmount,
        reason: `Admin adjustment: ${reason}`,
        performedBy: req.user._id,
      });
    } else {
      result = await debitBalance({
        userId: user._id,
        asset,
        amount: numAmount,
        reason: `Admin adjustment: ${reason}`,
        performedBy: req.user._id,
      });
    }

    const newBalance = result.wallet.balances[asset];

    // Record in AdminAuditLog
    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'WALLET_ADJUSTMENT',
      targetModel: 'Wallet',
      targetId: wallet._id,
      targetIdentifier: user.userId,
      summary: `Admin adjusted ${user.userId}'s ${asset.toUpperCase()} by ${type === 'credit' ? '+' : '-'}${numAmount}. Reason: ${reason}`,
      changes: {
        asset,
        previous: prevBalance,
        new: newBalance,
        adjustmentType: type,
        amount: numAmount,
      },
      reason: reason.trim(),
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Successfully applied ${type} of ${numAmount} ${asset.toUpperCase()} to user ${user.userId}.`,
      balances: result.wallet.balances,
      transaction: result.transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = {};
    if (status && status !== 'ALL') {
      filter.status = status;
    }

    const withdrawals = await Withdrawal.find(filter)
      .populate('userId', 'displayName name email userId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWithdrawalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid target status.' });
    }

    const withdrawal = await Withdrawal.findById(id).populate('userId');
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
    }

    if (withdrawal.status === 'completed' || withdrawal.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: `Withdrawal is already in terminal state: ${withdrawal.status}.`,
      });
    }

    const prevStatus = withdrawal.status;

    if (status === 'rejected') {
      if (!rejectionReason || rejectionReason.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'A valid rejection reason must be provided.',
        });
      }
      withdrawal.rejectionReason = rejectionReason.trim();
      // Refund reserved balance
      await releaseReservedBalance({
        userId: withdrawal.userId._id,
        asset: withdrawal.asset,
        amount: withdrawal.amount,
        reason: rejectionReason,
        referenceId: withdrawal.withdrawalId,
        isApproved: false,
      });
    } else if (status === 'completed') {
      // Deduct permanently from reserved balance
      await releaseReservedBalance({
        userId: withdrawal.userId._id,
        asset: withdrawal.asset,
        amount: withdrawal.amount,
        reason: 'Withdrawal payout executed',
        referenceId: withdrawal.withdrawalId,
        isApproved: true,
      });
    }

    withdrawal.status = status;
    withdrawal.statusHistory.push({
      status,
      note: note || `Status updated to ${status} by admin`,
      changedBy: req.user._id,
      timestamp: new Date(),
    });

    await withdrawal.save();

    // Log admin audit
    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'WITHDRAWAL_STATUS_CHANGE',
      targetModel: 'Withdrawal',
      targetId: withdrawal._id,
      targetIdentifier: withdrawal.withdrawalId,
      summary: `Updated withdrawal ${withdrawal.withdrawalId} from ${prevStatus} to ${status}.`,
      changes: { before: { status: prevStatus }, after: { status } },
      reason: note || rejectionReason || 'Status update',
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Withdrawal marked as ${status}.`,
      withdrawal,
    });
  } catch (error) {
    next(error);
  }
};

export const getLevels = async (req, res, next) => {
  try {
    const levels = await LevelConfiguration.find().sort({ level: 1 });
    res.json({ success: true, levels });
  } catch (error) {
    next(error);
  }
};

export const saveLevel = async (req, res, next) => {
  try {
    const { level, name, xpThreshold, badgeColor, benefits } = req.body;
    let lvl = await LevelConfiguration.findOne({ level });
    if (!lvl) {
      lvl = new LevelConfiguration({ level, name, xpThreshold, badgeColor, benefits });
    } else {
      lvl.name = name || lvl.name;
      lvl.xpThreshold = xpThreshold !== undefined ? xpThreshold : lvl.xpThreshold;
      lvl.badgeColor = badgeColor || lvl.badgeColor;
      if (benefits) lvl.benefits = benefits;
    }
    await lvl.save();

    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'LEVEL_CONFIG_UPDATE',
      targetModel: 'LevelConfiguration',
      targetId: lvl._id,
      targetIdentifier: `Level ${lvl.level}`,
      summary: `Updated Level ${lvl.level} (${lvl.name}) configuration.`,
      changes: { after: lvl },
      reason: 'Level definition updated',
    });

    res.json({ success: true, message: 'Level configuration saved.', level: lvl });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ category: 1, targetValue: 1 });
    res.json({ success: true, achievements });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const action = req.query.action;

    const query = {};
    if (action && action !== 'ALL') {
      query.action = action;
    }

    const total = await AdminAuditLog.countDocuments(query);
    const logs = await AdminAuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
