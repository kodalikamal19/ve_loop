import React from 'react';
import { Award, Zap, ChevronRight, Sparkles, Star } from 'lucide-react';
import styles from './LevelProgress.module.css';

export const LevelProgress = ({ levelProgress }) => {
  const currentLevel = levelProgress?.currentLevel || 1;
  const currentLevelName = levelProgress?.currentLevelName || 'Reward Starter';
  const currentXp = levelProgress?.currentXp || 0;
  const nextLevel = levelProgress?.nextLevel || 2;
  const nextLevelName = levelProgress?.nextLevelName || 'Silver Seeker';
  const nextLevelXp = levelProgress?.nextLevelXp || 1500;
  const xpRemaining = levelProgress?.xpRemaining || 0;
  const progressPercent = levelProgress?.progressPercent || 0;
  const isMaxLevel = levelProgress?.isMaxLevel;

  return (
    <div id="level-section" className={styles.levelCard}>
      <div className={styles.levelHeader}>
        <div className="d-flex align-items-center">
          <div className={styles.levelBadgeLarge}>
            <Award size={30} />
          </div>
          <div className={styles.levelDetails}>
            <div className={styles.levelSubtitle}>Tier Rank Status</div>
            <h2 className={styles.levelTitle}>
              Level {String(currentLevel).padStart(2, '0')} — {currentLevelName}
            </h2>
          </div>
        </div>
        <div className="text-end d-none d-sm-block">
          <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Main animated progress track */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <div className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '0.82rem' }}>
        <span>Current: <strong>{currentXp.toLocaleString()} XP</strong></span>
        <span>Goal: <strong>{nextLevelXp.toLocaleString()} XP</strong></span>
      </div>

      {/* Stats Breakdown Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Current XP</span>
          <span className={styles.statValue}>{currentXp.toLocaleString()} XP</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Target XP</span>
          <span className={styles.statValue}>{nextLevelXp.toLocaleString()} XP</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>XP Remaining</span>
          <span className={styles.statValue}>
            {isMaxLevel ? 'MAX' : `${xpRemaining.toLocaleString()} XP`}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Multiplier</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>
            {1 + currentLevel * 0.1}x Boost
          </span>
        </div>
      </div>

      {/* Next level unlock preview */}
      <div className={styles.nextLevelPreview}>
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={16} color="#8b5cf6" />
          <span>
            {isMaxLevel ? (
              <strong>You have achieved the highest prestige rank in VELoop!</strong>
            ) : (
              <>
                Next Tier: <strong>Level {String(nextLevel).padStart(2, '0')} — {nextLevelName}</strong>
              </>
            )}
          </span>
        </div>
        {!isMaxLevel && (
          <span className="fw-semibold text-primary d-flex align-items-center gap-1">
            Earn {xpRemaining.toLocaleString()} more XP
            <ChevronRight size={14} />
          </span>
        )}
      </div>
    </div>
  );
};

export default LevelProgress;
