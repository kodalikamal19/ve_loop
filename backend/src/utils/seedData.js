import dotenv from 'dotenv';
dotenv.config();

import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { LevelConfiguration } from '../models/LevelConfiguration.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Referral } from '../models/Referral.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed operation...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Wallet.deleteMany({}),
      WalletTransaction.deleteMany({}),
      LevelConfiguration.deleteMany({}),
      Achievement.deleteMany({}),
      UserAchievement.deleteMany({}),
      Withdrawal.deleteMany({}),
      Referral.deleteMany({}),
      ActivityLog.deleteMany({}),
      AdminAuditLog.deleteMany({}),
    ]);

    console.log('🧹 Existing collections cleared.');

    // 1. Seed Level Configurations
    const levels = await LevelConfiguration.create([
      {
        level: 1,
        name: 'Reward Starter',
        xpThreshold: 0,
        badgeIcon: 'Award',
        badgeColor: '#94a3b8',
        benefits: ['Basic rewards access', 'Standard ad multiplier (1.0x)'],
        displayOrder: 1,
      },
      {
        level: 2,
        name: 'Silver Seeker',
        xpThreshold: 1500,
        badgeIcon: 'Zap',
        badgeColor: '#38bdf8',
        benefits: ['5% bonus on SVE conversion', 'Early access to flash tasks'],
        displayOrder: 2,
      },
      {
        level: 3,
        name: 'Gold Adventurer',
        xpThreshold: 3500,
        badgeIcon: 'Sparkles',
        badgeColor: '#eab308',
        benefits: ['10% bonus on daily check-ins', 'Priority withdrawal review'],
        displayOrder: 3,
      },
      {
        level: 4,
        name: 'Reward Explorer',
        xpThreshold: 6000,
        badgeIcon: 'Crown',
        badgeColor: '#8b5cf6',
        benefits: ['Exclusive monthly mystery crates', '15% boost on referral rewards'],
        displayOrder: 4,
      },
      {
        level: 5,
        name: 'Diamond Master',
        xpThreshold: 10000,
        badgeIcon: 'Flame',
        badgeColor: '#ec4899',
        benefits: ['Instant 0-fee withdrawals', 'VIP support channel', '2x multiplier on all events'],
        displayOrder: 5,
      },
    ]);
    console.log(`✅ Seeded ${levels.length} Level Configurations.`);

    // 2. Seed Achievements
    const achievements = await Achievement.create([
      {
        code: 'FIRST_STEP',
        name: 'First Step',
        description: 'Complete registration and enter the VELoop ecosystem.',
        category: 'loyalty',
        badgeIcon: 'Flag',
        badgeColor: '#10b981',
        targetMetric: 'daily_logins',
        targetValue: 1,
        rewardAsset: 'xp',
        rewardAmount: 100,
      },
      {
        code: 'DAILY_STREAKER',
        name: 'Consistent Collector',
        description: 'Claim your daily bonus rewards across active days.',
        category: 'loyalty',
        badgeIcon: 'Calendar',
        badgeColor: '#3b82f6',
        targetMetric: 'daily_logins',
        targetValue: 5,
        rewardAsset: 'ves',
        rewardAmount: 200,
      },
      {
        code: 'CRYSTAL_HOARDER',
        name: 'Crystal Hoarder',
        description: 'Accumulate more than 200 shiny Gems in your wallet.',
        category: 'earnings',
        badgeIcon: 'Gem',
        badgeColor: '#a855f7',
        targetMetric: 'gems_earned',
        targetValue: 200,
        rewardAsset: 'xp',
        rewardAmount: 500,
      },
      {
        code: 'REFERRAL_PIONEER',
        name: 'Community Catalyst',
        description: 'Invite 3 active members to VELoop using your code.',
        category: 'social',
        badgeIcon: 'Users',
        badgeColor: '#f59e0b',
        targetMetric: 'referrals',
        targetValue: 3,
        rewardAsset: 'ves',
        rewardAmount: 500,
      },
      {
        code: 'GOLD_HUNTER',
        name: 'Gold Reward Hunter',
        description: 'Earn 5,000 XP through active rewards and missions.',
        category: 'progression',
        badgeIcon: 'Trophy',
        badgeColor: '#eab308',
        targetMetric: 'xp',
        targetValue: 5000,
        rewardAsset: 'xp',
        rewardAmount: 1000,
      },
      {
        code: 'PLATINUM_TITAN',
        name: 'Platinum Legend',
        description: 'Reach a total milestone of 8,000 XP in your rewards career.',
        category: 'progression',
        badgeIcon: 'Crown',
        badgeColor: '#6366f1',
        targetMetric: 'xp',
        targetValue: 8000,
        rewardAsset: 'tokens',
        rewardAmount: 2500,
      },
    ]);
    console.log(`✅ Seeded ${achievements.length} Achievements.`);

    // 3. Seed Demo Admin
    const demoAdmin = new User({
      userId: 'VLRADM202600001',
      name: 'Super Administrator',
      displayName: 'System Admin',
      email: process.env.ADMIN_SEED_EMAIL || 'demo-admin@veloop.io',
      password: process.env.ADMIN_SEED_PASSWORD || 'AdminDemo@2026',
      role: 'superadmin',
      referralCode: 'ADMINVIP',
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      bio: 'Head of VELoop Rewards Systems and Operations.',
    });
    await demoAdmin.save();

    await Wallet.create({
      userId: demoAdmin._id,
      userIdentifier: demoAdmin.userId,
      balances: { ves: 99999, sves: 50000, gems: 10000, tokens: 100000, xp: 50000 },
      reservedBalances: { ves: 0, sves: 0, gems: 0, tokens: 0 },
    });
    console.log(`✅ Seeded Demo Admin: ${demoAdmin.email}`);

    // 4. Seed Demo User (Alex Mercer / Spec Demo User)
    const demoUser = new User({
      userId: 'VLRUSR202600123',
      name: 'Alex Mercer',
      displayName: 'Alex Mercer',
      email: 'demo-user@veloop.io',
      password: 'UserDemo@2026',
      role: 'user',
      referralCode: 'VELOOP123',
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      bio: 'Earning daily rewards, unlocking achievements, and climbing the VELoop ranks!',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    });
    await demoUser.save();

    const userWallet = await Wallet.create({
      userId: demoUser._id,
      userIdentifier: demoUser.userId,
      balances: {
        ves: 3850,
        sves: 1240,
        gems: 240,
        tokens: 5000,
        xp: 6420,
      },
      reservedBalances: {
        ves: 400, // 400 VEs reserved for pending withdrawal
        sves: 0,
        gems: 0,
        tokens: 0,
      },
    });
    console.log(`✅ Seeded Demo User: ${demoUser.email} (ID: ${demoUser.userId})`);

    // 5. Seed Secondary Users for Referral network
    const refUser1 = new User({
      userId: 'VLRUSR202600124',
      name: 'Sarah Connor',
      displayName: 'Sarah C.',
      email: 'sarah@example.com',
      password: 'UserDemo@2026',
      role: 'user',
      referralCode: 'SARAH99',
      referredBy: 'VELOOP123',
      accountStatus: 'ACTIVE',
    });
    await refUser1.save();
    await Wallet.create({
      userId: refUser1._id,
      userIdentifier: refUser1.userId,
      balances: { ves: 450, sves: 100, gems: 30, tokens: 800, xp: 950 },
      reservedBalances: { ves: 0, sves: 0, gems: 0, tokens: 0 },
    });

    const refUser2 = new User({
      userId: 'VLRUSR202600125',
      name: 'David Miller',
      displayName: 'David M.',
      email: 'david@example.com',
      password: 'UserDemo@2026',
      role: 'user',
      referralCode: 'DAVID77',
      referredBy: 'VELOOP123',
      accountStatus: 'ACTIVE',
    });
    await refUser2.save();
    await Wallet.create({
      userId: refUser2._id,
      userIdentifier: refUser2.userId,
      balances: { ves: 600, sves: 150, gems: 45, tokens: 1200, xp: 1400 },
      reservedBalances: { ves: 0, sves: 0, gems: 0, tokens: 0 },
    });

    // 6. Seed Referrals for Demo User
    await Referral.create([
      {
        referrerId: demoUser._id,
        referredUserId: refUser1._id,
        referralCode: 'VELOOP123',
        status: 'successful',
        rewardVes: 250,
        rewardXp: 500,
        isRewarded: true,
        rewardedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        referrerId: demoUser._id,
        referredUserId: refUser2._id,
        referralCode: 'VELOOP123',
        status: 'successful',
        rewardVes: 250,
        rewardXp: 500,
        isRewarded: true,
        rewardedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]);

    // 7. Seed User Achievements
    await UserAchievement.create([
      {
        userId: demoUser._id,
        achievementId: achievements[0]._id, // First Step
        achievementCode: 'FIRST_STEP',
        currentProgress: 1,
        targetProgress: 1,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        achievementId: achievements[1]._id, // Consistent Collector
        achievementCode: 'DAILY_STREAKER',
        currentProgress: 5,
        targetProgress: 5,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        achievementId: achievements[2]._id, // Crystal Hoarder
        achievementCode: 'CRYSTAL_HOARDER',
        currentProgress: 240,
        targetProgress: 200,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        achievementId: achievements[3]._id, // Referral Pioneer
        achievementCode: 'REFERRAL_PIONEER',
        currentProgress: 2,
        targetProgress: 3,
        isUnlocked: false,
        unlockedAt: null,
      },
      {
        userId: demoUser._id,
        achievementId: achievements[4]._id, // Gold Hunter
        achievementCode: 'GOLD_HUNTER',
        currentProgress: 6420,
        targetProgress: 5000,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        achievementId: achievements[5]._id, // Platinum Titan
        achievementCode: 'PLATINUM_TITAN',
        currentProgress: 6420,
        targetProgress: 8000,
        isUnlocked: false,
        unlockedAt: null,
      },
    ]);

    // 8. Seed Withdrawals
    await Withdrawal.create([
      {
        userId: demoUser._id,
        withdrawalId: 'WDR-2026-901',
        asset: 'ves',
        amount: 2000,
        fiatEquivalent: 1000, // ₹1,000
        payoutMethod: 'UPI',
        payoutDetails: { upiId: 'alex.mercer@oksbi' },
        status: 'completed',
        statusHistory: [
          { status: 'pending', note: 'Withdrawal created by user', timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
          { status: 'approved', note: 'Approved by finance', timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
          { status: 'completed', note: 'IMPS Payout Reference #UPI92837482', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        ],
        transactionReference: 'TXN-WDR-901',
      },
      {
        userId: demoUser._id,
        withdrawalId: 'WDR-2026-902',
        asset: 'ves',
        amount: 2900,
        fiatEquivalent: 1450, // ₹1,450
        payoutMethod: 'Bank Transfer',
        payoutDetails: {
          accountNumber: 'XXXXXX4819',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'Alex Mercer',
        },
        status: 'completed',
        statusHistory: [
          { status: 'pending', note: 'Withdrawal requested', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'completed', note: 'NEFT Transfer processed', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ],
        transactionReference: 'TXN-WDR-902',
      },
      {
        userId: demoUser._id,
        withdrawalId: 'WDR-2026-903',
        asset: 'ves',
        amount: 400,
        fiatEquivalent: 200, // ₹200
        payoutMethod: 'UPI',
        payoutDetails: { upiId: 'alex.mercer@oksbi' },
        status: 'pending',
        statusHistory: [
          { status: 'pending', note: 'Under routine fraud & balance check', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
        ],
        transactionReference: 'TXN-WDR-903',
      },
    ]);

    // 9. Seed Recent Activity Log
    await ActivityLog.create([
      {
        userId: demoUser._id,
        actionType: 'watch_ads',
        description: 'Watched sponsored partner video',
        asset: 'ves',
        amount: 30,
        status: 'completed',
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'daily_bonus',
        description: 'Claimed Daily Consecutive Check-in Bonus',
        asset: 'ves',
        amount: 75,
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'referral_reward',
        description: 'Friend David Miller joined and verified profile',
        asset: 'ves',
        amount: 250,
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'gem_reward',
        description: 'Weekly leaderboard milestone bonus',
        asset: 'gems',
        amount: 50,
        status: 'completed',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'xp_earned',
        description: 'Survey completion bonus',
        asset: 'xp',
        amount: 300,
        status: 'completed',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'redemption_request',
        description: 'Requested ₹200 UPI withdrawal (400 VEs reserved)',
        asset: 'ves',
        amount: 400,
        status: 'pending',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        userId: demoUser._id,
        actionType: 'completed_withdrawal',
        description: 'Bank Transfer completed: ₹1,450 sent to account',
        asset: 'ves',
        amount: 2900,
        status: 'completed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ]);

    // 10. Seed Admin Audit Log
    await AdminAuditLog.create([
      {
        adminId: demoAdmin._id,
        adminEmail: demoAdmin.email,
        action: 'ADMIN_LOGIN',
        targetModel: 'User',
        targetId: demoAdmin._id,
        targetIdentifier: demoAdmin.userId,
        summary: 'Demo administrator logged in from secure terminal.',
        ipAddress: '127.0.0.1',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        adminId: demoAdmin._id,
        adminEmail: demoAdmin.email,
        action: 'WITHDRAWAL_STATUS_CHANGE',
        targetModel: 'Withdrawal',
        targetIdentifier: 'WDR-2026-902',
        summary: 'Approved and finalized bank payout for user Alex Mercer (₹1,450).',
        changes: { before: { status: 'pending' }, after: { status: 'completed' } },
        reason: 'NEFT transfer batch processed successfully.',
        ipAddress: '127.0.0.1',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('🎉 Seeding successfully completed! All models populated with spec-compliant demo data.');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// If run directly via CLI
if (process.argv[1]?.endsWith('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  })();
}
