import React, { useState } from 'react';
import { Trophy, Award, CheckCircle, Lock, Gem, Calendar, Users, Crown, Flame, Flag } from 'lucide-react';
import styles from './AchievementCard.module.css';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Flag': return <Flag size={20} />;
    case 'Calendar': return <Calendar size={20} />;
    case 'Gem': return <Gem size={20} />;
    case 'Users': return <Users size={20} />;
    case 'Crown': return <Crown size={20} />;
    case 'Flame': return <Flame size={20} />;
    default: return <Trophy size={20} />;
  }
};

export const AchievementCard = ({ achievements = [] }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNLOCKED') return ach.isUnlocked;
    if (filter === 'LOCKED') return !ach.isUnlocked;
    return ach.category === filter.toLowerCase();
  });

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Achievements & Badges</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {unlockedCount} of {achievements.length} Badges Unlocked
          </span>
        </div>

        <div className={styles.filterTabs}>
          {['ALL', 'UNLOCKED', 'LOCKED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`${styles.tabBtn} ${filter === tab ? styles.tabBtnActive : ''}`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.achievementsGrid}>
        {filteredAchievements.map((ach) => {
          const percent = ach.targetValue
            ? Math.min(100, Math.round(((ach.currentProgress || 0) / ach.targetValue) * 100))
            : 0;

          return (
            <div
              key={ach.id || ach.code}
              className={`${styles.achCard} ${!ach.isUnlocked ? styles.achCardLocked : ''}`}
            >
              <div
                className={styles.achBadge}
                style={{
                  backgroundColor: ach.isUnlocked ? `${ach.badgeColor}25` : 'var(--border-subtle)',
                  color: ach.isUnlocked ? ach.badgeColor : 'var(--text-muted)',
                  border: `1px solid ${ach.isUnlocked ? ach.badgeColor : 'transparent'}`,
                }}
              >
                {ach.isUnlocked ? getIcon(ach.badgeIcon) : <Lock size={18} />}
              </div>

              <div className={styles.achContent}>
                <div className={styles.achName}>
                  <span>{ach.name}</span>
                  {ach.isUnlocked ? (
                    <span className={styles.unlockedBadge}>
                      <CheckCircle size={14} /> Unlocked
                    </span>
                  ) : (
                    <span className={styles.lockedText}>Locked</span>
                  )}
                </div>

                <div className={styles.achDesc}>{ach.description}</div>

                {!ach.isUnlocked && (
                  <>
                    <div className={styles.achProgressTrack}>
                      <div
                        className={styles.achProgressFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="d-flex justify-content-between" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Progress: {ach.currentProgress || 0} / {ach.targetValue}</span>
                      <span>{percent}%</span>
                    </div>
                  </>
                )}

                {ach.rewardAmount && (
                  <div className="mt-2" style={{ fontSize: '0.74rem', color: '#6366f1', fontWeight: 600 }}>
                    Reward: +{ach.rewardAmount} {ach.rewardAsset?.toUpperCase() || 'XP'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementCard;
