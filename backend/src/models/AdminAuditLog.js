import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'ADMIN_LOGIN',
        'PROFILE_UPDATE',
        'ACCOUNT_RESTRICTION',
        'WALLET_ADJUSTMENT',
        'LEVEL_CONFIG_UPDATE',
        'ACHIEVEMENT_CONFIG_UPDATE',
        'WITHDRAWAL_STATUS_CHANGE',
        'REFERRAL_STATUS_CHANGE',
        'SYSTEM_RESET',
      ],
      required: true,
      index: true,
    },
    targetModel: {
      type: String,
      enum: ['User', 'Wallet', 'LevelConfiguration', 'Achievement', 'Withdrawal', 'Referral', 'System'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    targetIdentifier: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    changes: {
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    reason: {
      type: String,
      default: 'Administrative operation',
      trim: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminAuditLog = mongoose.model('AdminAuditLog', adminAuditLogSchema);
export default AdminAuditLog;
