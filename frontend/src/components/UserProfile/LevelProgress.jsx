import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Crown, Check, Lock, ArrowUpRight } from 'lucide-react';
import LevelBadge from '../Badges/LevelBadge';
import BadgeInspectModal from '../Badges/BadgeInspectModal';
import styles from './LevelProgress.module.css';

const DEFAULT_LEVELS_META = [
  { level: 1, name: 'Reward Starter', xpThreshold: 0, badgeColor: '#10b981' },
  { level: 2, name: 'Silver Seeker', xpThreshold: 1500, badgeColor: '#38bdf8' },
  { level: 3, name: 'Gold Adventurer', xpThreshold: 3500, badgeColor: '#f59e0b' },
  { level: 4, name: 'Reward Explorer', xpThreshold: 6000, badgeColor: '#a855f7' },
  { level: 5, name: 'Diamond Master', xpThreshold: 10000, badgeColor: '#ec4899' },
];

export const LevelProgress = ({ levelProgress }) => {
  const currentLevel = levelProgress?.currentLevel || 4;
  const currentLevelName = levelProgress?.currentLevelName || 'Reward Explorer';
  const currentXp = levelProgress?.currentXp || 6420;
  const nextLevel = levelProgress?.nextLevel || 5;
  const nextLevelName = levelProgress?.nextLevelName || 'Diamond Master';
  const nextLevelXp = levelProgress?.nextLevelXp || 10000;
  const xpRemaining = levelProgress?.xpRemaining || 3580;
  const progressPercent = levelProgress?.progressPercent || 64;
  const isMaxLevel = levelProgress?.isMaxLevel || false;

  const [inspectLevel, setInspectLevel] = useState(null);

  const levelsList =
    levelProgress?.allLevels && levelProgress.allLevels.length > 0
      ? levelProgress.allLevels
      : DEFAULT_LEVELS_META;

  return (
    <div id="level-section" className={styles.levelCard}>
      <div className={styles.cardGlowOrb} />

      {/* Header with 3D Crest & Tier Title */}
      <div className={styles.levelHeader}>
        <div className={styles.levelHeaderLeft}>
          <div className={styles.levelBadgeWrap}>
            <LevelBadge
              level={currentLevel}
              status="active"
              size="md"
              interactive={true}
              showStatusRibbon={false}
              onClick={() => {
                const target = levelsList.find((l) => l.level === currentLevel);
                setInspectLevel(target);
              }}
            />
          </div>

          <div className={styles.levelDetails}>
            <div className={styles.levelSubtitle}>
              <Crown size={14} color="#38bdf8" />
              Prestige Tier Rank Status
            </div>
            <h2 className={styles.levelTitle}>
              Level {String(currentLevel).padStart(2, '0')} —{' '}
              <span className={styles.levelTitleGradient}>{currentLevelName}</span>
            </h2>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/levels" className={styles.viewAllTiersBtn}>
            <span>Explore All 5 Tiers</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      {/* Main animated progress track with shimmer */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className={styles.progressShimmer} />
        </div>
      </div>

      <div
        className="d-flex justify-content-between align-items-center"
        style={{ fontSize: '0.82rem', color: '#94a3b8' }}
      >
        <span>
          Current: <strong className="text-white">{currentXp.toLocaleString()} XP</strong>
        </span>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
          {progressPercent}% Complete
        </span>
        <span>
          Goal: <strong className="text-white">{nextLevelXp.toLocaleString()} XP</strong>
        </span>
      </div>

      {/* 5-Node Interactive Roadmap Strip */}
      <div className={styles.tierRoadmapBar}>
        {levelsList.map((lvl) => {
          const isCompleted = currentLevel > lvl.level;
          const isActive = currentLevel === lvl.level;
          const isLocked = currentLevel < lvl.level;
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'locked';

          return (
            <div
              key={lvl.level}
              className={`${styles.tierNodeItem} ${isActive ? styles.tierNodeActive : ''}`}
              onClick={() => setInspectLevel(lvl)}
              title={`Inspect Level ${lvl.level} - ${lvl.name}`}
            >
              <LevelBadge
                level={lvl.level}
                status={status}
                size="sm"
                interactive={false}
                showStatusRibbon={false}
              />
              <span className={styles.tierNodeLabel}>
                {isActive ? (
                  <span className="badge bg-primary px-2 py-0.5 rounded-pill">Lvl {lvl.level}</span>
                ) : isCompleted ? (
                  <span className="text-success fw-bold">✓ Lvl {lvl.level}</span>
                ) : (
                  <span>Lvl {lvl.level}</span>
                )}
              </span>
            </div>
          );
        })}
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
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>
            {isMaxLevel ? 'MAX CAP' : `${xpRemaining.toLocaleString()} XP`}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Reward Multiplier</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>
            {(1 + currentLevel * 0.1).toFixed(1)}x Boost
          </span>
        </div>
      </div>

      {/* Next level unlock preview bar */}
      <div className={styles.nextLevelPreview}>
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={16} color="#a855f7" />
          <span>
            {isMaxLevel ? (
              <strong className="text-white">
                You have achieved the highest prestige rank in VELoop!
              </strong>
            ) : (
              <>
                Next Tier:{' '}
                <strong className="text-white">
                  Level {String(nextLevel).padStart(2, '0')} — {nextLevelName}
                </strong>
              </>
            )}
          </span>
        </div>
        {!isMaxLevel && (
          <Link
            to="/levels"
            className="fw-semibold text-primary text-decoration-none d-flex align-items-center gap-1"
          >
            Earn {xpRemaining.toLocaleString()} more XP
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Inspect Modal */}
      <BadgeInspectModal
        levelData={inspectLevel}
        currentLevel={currentLevel}
        isOpen={!!inspectLevel}
        onClose={() => setInspectLevel(null)}
      />
    </div>
  );
};

export default LevelProgress;
