import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit', 'reward', 'conversion', 'redemption', 'admin_adjustment', 'refund'],
      required: true,
      index: true,
    },
    asset: {
      type: String,
      enum: ['ves', 'sves', 'gems', 'tokens', 'xp'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    referenceId: {
      type: String, // withdrawalId or activityId or custom
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'reversed', 'failed'],
      default: 'completed',
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Admin user if adjustment
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

export const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
export default WalletTransaction;
