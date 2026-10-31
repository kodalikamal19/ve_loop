import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
      index: true,
    },
    achievementCode: {
      type: String,
      required: true,
    },
    currentProgress: {
      type: Number,
      default: 0,
    },
    targetProgress: {
      type: Number,
      required: true,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
export default UserAchievement;
