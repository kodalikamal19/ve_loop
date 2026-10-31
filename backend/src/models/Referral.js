import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referralCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'rewarded', 'flagged'],
      default: 'pending',
      index: true,
    },
    rewardVes: {
      type: Number,
      default: 250, // 250 VEs rewarded on qualification
    },
    rewardXp: {
      type: Number,
      default: 500, // 500 XP rewarded
    },
    isRewarded: {
      type: Boolean,
      default: false,
    },
    rewardedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
