import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    userIdentifier: {
      type: String, // String userId e.g. VLRUSR202600123
      required: true,
      index: true,
    },
    balances: {
      ves: {
        type: Number,
        default: 0,
        min: 0,
      },
      sves: {
        type: Number,
        default: 0,
        min: 0,
      },
      gems: {
        type: Number,
        default: 0,
        min: 0,
      },
      tokens: {
        type: Number,
        default: 0,
        min: 0,
      },
      xp: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    reservedBalances: {
      ves: {
        type: Number,
        default: 0,
        min: 0,
      },
      sves: {
        type: Number,
        default: 0,
        min: 0,
      },
      gems: {
        type: Number,
        default: 0,
        min: 0,
      },
      tokens: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
