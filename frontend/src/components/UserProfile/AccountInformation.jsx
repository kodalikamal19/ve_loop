import React from 'react';
import { Copy, ShieldCheck, Mail, Calendar, Key, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './AccountInformation.module.css';

export const AccountInformation = ({ profile }) => {
  const { showToast } = useToast();

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const memberSinceFormatted = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'October 2026';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Account Information & Security</h2>

      <div className={styles.infoGrid}>
        {/* User ID */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>User ID / Identifier</span>
          <div className={styles.itemValue}>
            <span className="font-monospace">{profile?.userId}</span>
            <button
              onClick={() => handleCopy(profile?.userId, 'User ID')}
              className={styles.copyBtn}
              title="Copy User ID"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Email */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>Registered Email</span>
          <div className={styles.itemValue}>
            <span>{profile?.email}</span>
            {profile?.isEmailVerified && (
              <span title="Verified" style={{ color: '#10b981' }}>
                <CheckCircle size={15} />
              </span>
            )}
          </div>
        </div>

        {/* Referral Code */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>Referral Code</span>
          <div className={styles.itemValue}>
            <span className="font-monospace fw-bold text-primary">{profile?.referralCode}</span>
            <button
              onClick={() => handleCopy(profile?.referralCode, 'Referral Code')}
              className={styles.copyBtn}
              title="Copy Referral Code"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Member Since */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>Member Since</span>
          <div className={styles.itemValue}>
            <span>{memberSinceFormatted}</span>
            <Calendar size={15} color="var(--text-muted)" />
          </div>
        </div>

        {/* Account Status */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>Account Health</span>
          <div className={styles.itemValue}>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              {profile?.accountStatus || 'ACTIVE'}
            </span>
            <ShieldCheck size={16} color="#10b981" />
          </div>
        </div>

        {/* Security Tier */}
        <div className={styles.itemCard}>
          <span className={styles.itemLabel}>Security Tier</span>
          <div className={styles.itemValue}>
            <span>JWT Session Verified</span>
            <Key size={15} color="var(--text-muted)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
