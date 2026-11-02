import React, { useEffect } from 'react';
import { X, Check, Lock, Sparkles, Shield, Zap, Gift, ArrowRight } from 'lucide-react';
import LevelBadge from './LevelBadge';
import styles from './BadgeInspectModal.module.css';

export const BadgeInspectModal = ({
  levelData,
  currentLevel = 1,
  isOpen = false,
  onClose,
  onTakeAction,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !levelData) return null;

  const lvl = Number(levelData.level);
  const isCompleted = currentLevel > lvl;
  const isActive = currentLevel === lvl;
  const isLocked = currentLevel < lvl;

  const status = isCompleted ? 'completed' : isActive ? 'active' : 'locked';

  const accentColorMap = {
    1: '#10b981',
    2: '#38bdf8',
    3: '#f59e0b',
    4: '#a855f7',
    5: '#ec4899',
  };

  const accentColor = accentColorMap[lvl] || '#6366f1';

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalCard}
        style={{
          '--modal-accent': accentColor,
          '--modal-border': `${accentColor}50`,
          '--modal-glow': `${accentColor}35`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalGlowOrb} />

        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* 3D Badge Visualizer */}
        <div className={styles.badgeShowcase}>
          <LevelBadge
            level={lvl}
            status={status}
            size="xl"
            interactive={false}
            showStatusRibbon={false}
          />

          <span className={styles.badgeLoreTag}>Prestige Rank Tier 0{lvl}</span>
          <h2 className={styles.badgeTitle}>{levelData.name}</h2>

          <div
            className={`${styles.badgeStatusTag} ${
              isCompleted
                ? styles.statusCompleted
                : isActive
                ? styles.statusActive
                : styles.statusLocked
            }`}
          >
            {isCompleted && (
              <>
                <Check size={14} strokeWidth={3} /> Tier Mastered & Claimed
              </>
            )}
            {isActive && (
              <>
                <Sparkles size={14} /> Currently Active Prestige
              </>
            )}
            {isLocked && (
              <>
                <Lock size={14} /> Locked Tier • Requires {levelData.xpThreshold?.toLocaleString()} XP
              </>
            )}
          </div>
        </div>

        {/* Benefits breakdown */}
        <div className={styles.perksSection}>
          <div className={styles.perksTitle}>
            <Zap size={14} color={accentColor} />
            Exclusive Tier Privileges & Boosts
          </div>
          <div className={styles.perksList}>
            {levelData.benefits && levelData.benefits.length > 0 ? (
              levelData.benefits.map((b, i) => (
                <div key={i} className={styles.perkItem}>
                  <div className={styles.perkIcon}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>{b}</span>
                </div>
              ))
            ) : (
              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Check size={13} strokeWidth={3} />
                </div>
                <span>Multiplier Boost: {(1 + lvl * 0.1).toFixed(1)}x rewards multiplier</span>
              </div>
            )}
            <div className={styles.perkItem}>
              <div className={styles.perkIcon}>
                <Gift size={13} />
              </div>
              <span>
                Earn rate booster: <strong>{(1 + lvl * 0.1).toFixed(1)}x</strong> across all tasks & events
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.modalFooter}>
          <div className="small text-muted">
            Threshold: <strong>{levelData.xpThreshold?.toLocaleString()} XP</strong>
          </div>
          <button
            className={styles.modalActionBtn}
            onClick={() => {
              onClose();
              if (onTakeAction) onTakeAction();
            }}
          >
            {isLocked ? 'Earn XP To Unlock' : 'View Tier Roadmap'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeInspectModal;
