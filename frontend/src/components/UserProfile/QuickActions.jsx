import React from 'react';
import { Gift, Video, RefreshCw, Send, Users, Trophy } from 'lucide-react';
import styles from './QuickActions.module.css';

export const QuickActions = ({
  onClaimDailyBonus,
  onWatchAd,
  onConvertSves,
  onOpenWithdraw,
  onScrollToReferrals,
  isClaimingBonus,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quick Actions — Earn & Manage</h2>

      <div className={styles.actionsGrid}>
        {/* Action 1: Claim Daily Bonus */}
        <button
          onClick={onClaimDailyBonus}
          className={styles.actionCard}
          disabled={isClaimingBonus}
        >
          <div
            className={styles.actionIcon}
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#d97706' }}
          >
            <Gift size={22} />
          </div>
          <div className={styles.actionText}>
            <div className={styles.actionTitle}>Claim Daily Bonus</div>
            <div className={styles.actionDesc}>
              {isClaimingBonus ? 'Processing claim...' : 'Collect free VEs, Gems & XP check-in'}
            </div>
          </div>
        </button>

        {/* Action 2: Watch Sponsored Ad */}
        <button onClick={onWatchAd} className={styles.actionCard}>
          <div
            className={styles.actionIcon}
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}
          >
            <Video size={22} />
          </div>
          <div className={styles.actionText}>
            <div className={styles.actionTitle}>Watch Ad Rewards</div>
            <div className={styles.actionDesc}>Watch video ads to earn +30 VEs instantly</div>
          </div>
        </button>

        {/* Action 3: Convert SVEs */}
        <button onClick={onConvertSves} className={styles.actionCard}>
          <div
            className={styles.actionIcon}
            style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#475569' }}
          >
            <RefreshCw size={22} />
          </div>
          <div className={styles.actionText}>
            <div className={styles.actionTitle}>Convert SVEs to VEs</div>
            <div className={styles.actionDesc}>Exchange silver balance at a 1.2x boost</div>
          </div>
        </button>

        {/* Action 4: Redeem Payout */}
        <button onClick={onOpenWithdraw} className={styles.actionCard}>
          <div
            className={styles.actionIcon}
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}
          >
            <Send size={22} />
          </div>
          <div className={styles.actionText}>
            <div className={styles.actionTitle}>Redeem Rewards</div>
            <div className={styles.actionDesc}>Cash out VEs to UPI or Bank Transfer</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
