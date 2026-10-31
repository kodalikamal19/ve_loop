import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    withdrawalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    asset: {
      type: String,
      default: 'ves',
      enum: ['ves', 'gems', 'tokens'],
    },
    amount: {
      type: Number,
      required: true,
      min: 100, // e.g. min 100 VEs
    },
    fiatEquivalent: {
      type: Number, // In INR (₹)
      required: true,
    },
    payoutMethod: {
      type: String,
      enum: ['UPI', 'Bank Transfer', 'Amazon Gift Card', 'Flipkart Voucher'],
      required: true,
    },
    payoutDetails: {
      upiId: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
      accountHolderName: { type: String, trim: true },
      giftCardEmail: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    transactionReference: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
