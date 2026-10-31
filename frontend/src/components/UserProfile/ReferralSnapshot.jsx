import React from 'react';
import { Copy, Users, Check, Share2, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './ReferralSnapshot.module.css';

export const ReferralSnapshot = ({ referralsSummary }) => {
  const { showToast } = useToast();

  const referralCode = referralsSummary?.referralCode || 'VELOOP123';
  const total = referralsSummary?.total || 0;
  const successful = referralsSummary?.successful || 0;
  const pending = referralsSummary?.pending || 0;
  const rewardsEarned = referralsSummary?.rewardsEarned || 0;
  const referralXp = referralsSummary?.referralXp || 0;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    showToast(`Referral code copied: ${referralCode}`);
  };

  const handleShareLink = () => {
    const inviteLink = `${window.location.origin}/login?ref=${referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    showToast('Shareable referral link copied to clipboard!');
  };

  const nextMilestone = 5;
  const progressPercent = Math.min(100, Math.round((successful / nextMilestone) * 100));

  return (
    <div id="referrals-section" className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Referral Snapshot</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Invite friends and earn 250 VEs + 500 XP per active user
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className={styles.codeShareBox}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your Code:</span>
            <span className={styles.referralCode}>{referralCode}</span>
            <button onClick={handleCopyCode} className={styles.copyBtn} title="Copy code">
              <Copy size={13} /> Copy
            </button>
          </div>
          <button
            onClick={handleShareLink}
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3"
          >
            <Share2 size={14} /> Share Link
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Invites</span>
          <span className={styles.statValue}>{total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Successful</span>
          <span className={styles.statValue} style={{ color: '#059669' }}>{successful}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending</span>
          <span className={styles.statValue} style={{ color: '#d97706' }}>{pending}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Rewards Earned</span>
          <span className={styles.statValue} style={{ color: '#2563eb' }}>
            +{rewardsEarned.toLocaleString()} VEs
          </span>
        </div>
      </div>

      <div className={styles.milestoneBox}>
        <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.82rem' }}>
          <span className="d-flex align-items-center gap-1 fw-semibold">
            <Sparkles size={14} color="#8b5cf6" /> Next Milestone: {nextMilestone} Successful Referrals (+1,000 Bonus XP)
          </span>
          <span className="fw-bold">{successful} / {nextMilestone} ({progressPercent}%)</span>
        </div>
        <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              borderRadius: 10,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralSnapshot;
