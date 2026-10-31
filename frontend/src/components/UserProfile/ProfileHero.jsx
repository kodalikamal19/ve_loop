import React from 'react';
import { Copy, Edit3, Shield, Award, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './ProfileHero.module.css';

export const ProfileHero = ({ profile, levelProgress, onEditProfile }) => {
  const { showToast } = useToast();

  const handleCopyUserId = () => {
    if (profile?.userId) {
      navigator.clipboard.writeText(profile.userId);
      showToast(`User ID copied: ${profile.userId}`);
    }
  };

  const initials = (profile?.displayName || profile?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const currentXp = levelProgress?.currentXp || 0;
  const nextLevelXp = levelProgress?.nextLevelXp || 1000;
  const xpRemaining = levelProgress?.xpRemaining || 0;
  const progressPercent = levelProgress?.progressPercent || 0;
  const currentLevel = levelProgress?.currentLevel || 1;
  const currentLevelName = levelProgress?.currentLevelName || 'Reward Starter';

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        {/* Left: Identity & Badges */}
        <div className={styles.identityGroup}>
          <div className={styles.avatarWrapper}>
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.displayName}
                className={styles.avatarImg}
              />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            <div
              className={styles.statusIndicator}
              title={`Account Status: ${profile?.accountStatus || 'ACTIVE'}`}
            />
          </div>

          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h1 className={styles.displayName}>{profile?.displayName || profile?.name}</h1>
              {profile?.accountStatus && (
                <span className={styles.statusBadge}>
                  {profile.accountStatus}
                </span>
              )}
              {profile?.isEmailVerified && (
                <span
                  title="Verified Account"
                  style={{ display: 'inline-flex', alignItems: 'center', color: '#10b981' }}
                >
                  <CheckCircle2 size={18} />
                </span>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className={styles.userIdBadge}>
                ID: {profile?.userId}
                <button
                  onClick={handleCopyUserId}
                  className={styles.copyMiniBtn}
                  title="Copy User ID"
                  aria-label="Copy User ID"
                >
                  <Copy size={13} />
                </button>
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {profile?.email}
              </span>
            </div>

            <div className="mt-2">
              <button onClick={onEditProfile} className={styles.editProfileBtn}>
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Gamified Level Progression Widget */}
        <div className={styles.xpProgressionCard}>
          <div className={styles.levelTitleRow}>
            <span className={styles.levelTag}>Current Tier</span>
            <span className={styles.levelName}>
              <Award size={18} color="#8b5cf6" />
              Level {String(currentLevel).padStart(2, '0')} — {currentLevelName}
            </span>
          </div>

          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div className={styles.xpDetailsRow}>
            <span>
              <strong>{currentXp.toLocaleString()}</strong> / {nextLevelXp.toLocaleString()} XP ({progressPercent}%)
            </span>
            <span>
              {levelProgress?.isMaxLevel ? (
                'Highest Rank Achieved!'
              ) : (
                `${xpRemaining.toLocaleString()} XP to Level ${String(currentLevel + 1).padStart(2, '0')}`
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
