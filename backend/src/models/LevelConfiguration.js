import mongoose from 'mongoose';

const levelConfigurationSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    xpThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    badgeIcon: {
      type: String,
      default: 'Shield',
    },
    badgeColor: {
      type: String,
      default: '#3b82f6',
    },
    benefits: [
      {
        type: String,
      },
    ],
    bonusMultiplier: {
      type: Number,
      default: 1.0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const LevelConfiguration = mongoose.model('LevelConfiguration', levelConfigurationSchema);
export default LevelConfiguration;
