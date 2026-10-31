import React from 'react';
import { Gift, Video, Users, Gem, Flame, Send, CheckCircle2, Clock } from 'lucide-react';
import styles from './RecentActivity.module.css';

const getActivityIcon = (type) => {
  switch (type) {
    case 'watch_ads':
      return { icon: <Video size={18} />, bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' };
    case 'daily_bonus':
      return { icon: <Gift size={18} />, bg: 'rgba(234, 179, 8, 0.15)', color: '#d97706' };
    case 'referral_reward':
      return { icon: <Users size={18} />, bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' };
    case 'gem_reward':
      return { icon: <Gem size={18} />, bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' };
    case 'xp_earned':
      return { icon: <Flame size={18} />, bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
    case 'redemption_request':
    case 'completed_withdrawal':
      return { icon: <Send size={18} />, bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' };
    default:
      return { icon: <CheckCircle2 size={18} />, bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b' };
  }
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const RecentActivity = ({ activity = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Persisted events & transactions
        </span>
      </div>

      {activity && activity.length > 0 ? (
        <div className={styles.activityList}>
          {activity.map((item) => {
            const visual = getActivityIcon(item.actionType);
            const isDeduction = ['redemption_request', 'completed_withdrawal'].includes(item.actionType);

            return (
              <div key={item._id} className={styles.activityItem}>
                <div className={styles.leftGroup}>
                  <div
                    className={styles.iconCircle}
                    style={{ backgroundColor: visual.bg, color: visual.color }}
                  >
                    {visual.icon}
                  </div>
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.timestamp}>{formatTimeAgo(item.createdAt)}</div>
                  </div>
                </div>

                <div className={styles.rightGroup}>
                  <div className={`${styles.amount} ${isDeduction ? styles.amountNegative : styles.amountPositive}`}>
                    {isDeduction ? '-' : '+'}
                    {item.amount.toLocaleString()} {item.asset?.toUpperCase()}
                  </div>
                  <span
                    className={styles.statusText}
                    style={{
                      color:
                        item.status === 'completed'
                          ? '#059669'
                          : item.status === 'pending'
                          ? '#d97706'
                          : '#dc2626',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          No recent activity found. Start earning to see your history!
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
