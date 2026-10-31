import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Referral } from '../models/Referral.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { checkAndUnlockAchievements } from '../services/gamificationService.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'veloop-rewards-super-secret-key-2026';
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Generate unique user ID and referral code
    const count = await User.countDocuments();
    const userId = `VLRUSR${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;
    const userReferralCode = `VL${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const user = new User({
      userId,
      name,
      displayName: name,
      email: email.toLowerCase(),
      password,
      referralCode: userReferralCode,
      referredBy: referralCode ? referralCode.toUpperCase() : null,
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
    });

    await user.save();

    // Create starter wallet with starting bonuses
    const starterBalances = {
      ves: 100, // Starter welcome reward
      sves: 50,
      gems: 10,
      tokens: 250,
      xp: 150,
    };

    const wallet = await Wallet.create({
      userId: user._id,
      userIdentifier: user.userId,
      balances: starterBalances,
      reservedBalances: { ves: 0, sves: 0, gems: 0, tokens: 0 },
    });

    // Check if referred by existing user
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        await Referral.create({
          referrerId: referrer._id,
          referredUserId: user._id,
          referralCode: referralCode.toUpperCase(),
          status: 'pending',
          rewardVes: 250,
          rewardXp: 500,
        });

        await ActivityLog.create({
          userId: referrer._id,
          actionType: 'referral_reward',
          description: `New user ${name} registered with your code!`,
          asset: 'ves',
          amount: 250,
          status: 'pending',
        });
      }
    }

    // Initial activity log
    await ActivityLog.create({
      userId: user._id,
      actionType: 'daily_bonus',
      description: 'Welcome to VELoop Rewards! Starter package credited.',
      asset: 'ves',
      amount: 100,
      status: 'completed',
    });

    // Evaluate initial achievements
    await checkAndUnlockAchievements(user._id, 150, { daily_logins: 1 });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: `Account is suspended: ${user.statusReason || 'Terms violation'}. Contact support.`,
        isSuspended: true,
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        userId: user.userId,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
