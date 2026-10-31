import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['earnings', 'progression', 'social', 'loyalty', 'special'],
      default: 'earnings',
    },
    badgeIcon: {
      type: String,
      default: 'Award',
    },
    badgeColor: {
      type: String,
      default: '#f59e0b',
    },
    targetMetric: {
      type: String,
      enum: ['xp', 'ves_earned', 'gems_earned', 'referrals', 'withdrawals', 'daily_logins'],
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardAsset: {
      type: String,
      enum: ['ves', 'sves', 'gems', 'tokens', 'xp'],
      default: 'xp',
    },
    rewardAmount: {
      type: Number,
      default: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
