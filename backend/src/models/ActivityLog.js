import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: [
        'watch_ads',
        'daily_bonus',
        'referral_reward',
        'gem_reward',
        'xp_earned',
        'sve_conversion',
        'redemption_request',
        'completed_withdrawal',
        'level_up',
        'achievement_unlocked',
        'admin_adjustment',
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    asset: {
      type: String,
      enum: ['ves', 'sves', 'gems', 'tokens', 'xp', 'fiat'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'rejected', 'failed'],
      default: 'completed',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
