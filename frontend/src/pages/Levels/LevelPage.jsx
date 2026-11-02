import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Zap,
  Sparkles,
  Shield,
  Crown,
  Flame,
  ArrowRight,
  CheckCircle,
  Lock,
  ChevronRight,
  Sliders,
  Table,
  Compass,
  Gift,
  Share2,
  Tv,
  Coins,
  TrendingUp,
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import LevelBadge from '../../components/Badges/LevelBadge';
import BadgeInspectModal from '../../components/Badges/BadgeInspectModal';

import WatchAdModal from '../../components/UserProfile/WatchAdModal';
import ConvertSvesModal from '../../components/UserProfile/ConvertSvesModal';

import styles from './LevelPage.module.css';

// Default Master Tiers Configuration
const DEFAULT_LEVELS = [
  {
    level: 1,
    name: 'Reward Starter',
    xpThreshold: 0,
    badgeIcon: 'Award',
    badgeColor: '#10b981',
    benefits: [
      'Basic rewards access & token wallet',
      'Standard ad multiplier (1.0x)',
      'Community discussion hub entry',
    ],
    bonusMultiplier: 1.0,
    withdrawalFee: 'Standard (3.5%)',
    dailyBonus: '50 XP',
    mysteryCrate: 'None',
    support: 'Standard Community',
  },
  {
    level: 2,
    name: 'Silver Seeker',
    xpThreshold: 1500,
    badgeIcon: 'Zap',
    badgeColor: '#38bdf8',
    benefits: [
      '5% bonus on SVE to VES conversion',
      'Early access to flash tasks & limited drops',
      'Silver badge frame on leaderboard',
    ],
    bonusMultiplier: 1.1,
    withdrawalFee: '5% Reduced Fee',
    dailyBonus: '75 XP',
    mysteryCrate: 'Rare Monthly Box',
    support: 'Fast Email Support',
  },
  {
    level: 3,
    name: 'Gold Adventurer',
    xpThreshold: 3500,
    badgeIcon: 'Sparkles',
    badgeColor: '#f59e0b',
    benefits: [
      '10% bonus on daily check-ins & streaks',
      'Priority withdrawal queue processing',
      'Exclusive Gold tournaments access',
    ],
    bonusMultiplier: 1.25,
    withdrawalFee: '15% Reduced Fee',
    dailyBonus: '120 XP',
    mysteryCrate: 'Epic Gold Vault',
    support: 'Priority Help Desk',
  },
  {
    level: 4,
    name: 'Reward Explorer',
    xpThreshold: 6000,
    badgeIcon: 'Crown',
    badgeColor: '#a855f7',
    benefits: [
      'Exclusive monthly mystery crates with rare gems',
      '15% boost on all referral rewards',
      'Crown cosmetic flair & VIP chat lounge',
    ],
    bonusMultiplier: 1.4,
    withdrawalFee: '50% Reduced Fee',
    dailyBonus: '200 XP',
    mysteryCrate: 'Legendary Crate',
    support: 'Dedicated VIP Support',
  },
  {
    level: 5,
    name: 'Diamond Master',
    xpThreshold: 10000,
    badgeIcon: 'Flame',
    badgeColor: '#ec4899',
    benefits: [
      'Instant 0-fee crypto & fiat withdrawals',
      'VIP concierge support channel with 1-on-1 manager',
      '2.0x permanent multiplier on all events & tasks',
      'Physical holographic VELoop Master Card',
    ],
    bonusMultiplier: 2.0,
    withdrawalFee: 'Instant 0% Fee',
    dailyBonus: '500 XP',
    mysteryCrate: 'Mythic Diamond Cache',
    support: '24/7 VIP Concierge',
  },
];

export const LevelPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ROADMAP'); // 'ROADMAP' | 'COMPARISON' | 'SIMULATOR'

  // User Gamification State
  const [profileData, setProfileData] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);
  const [allLevels, setAllLevels] = useState(DEFAULT_LEVELS);

  // Modal states
  const [selectedInspectLevel, setSelectedInspectLevel] = useState(null);
  const [isWatchAdOpen, setIsWatchAdOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  // Interactive Simulator State
  const [simulatedXp, setSimulatedXp] = useState(6420);

  // Synthesize pleasant celebratory chime using Web Audio API (Zero external dependencies)
  const playRewardChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.36);
      });
    } catch (e) {
      // AudioContext muted/unsupported, fail silently
    }
  };

  // Load level progress from backend
  const loadLevelData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.profile.getMe();
      if (res.success) {
        setProfileData(res);
        if (res.levelProgress) {
          setLevelProgress(res.levelProgress);
          setSimulatedXp(res.levelProgress.currentXp || 6420);
          if (res.levelProgress.allLevels && res.levelProgress.allLevels.length > 0) {
            // Merge backend levels with display metadata
            const merged = res.levelProgress.allLevels.map((lvl) => {
              const def = DEFAULT_LEVELS.find((d) => d.level === lvl.level) || {};
              return { ...def, ...lvl };
            });
            setAllLevels(merged);
          }
        }
      }
    } catch (err) {
      console.warn('Backend connection note:', err.message);
      // Fallback to seeded demo state
      setLevelProgress({
        currentLevel: 4,
        currentLevelName: 'Reward Explorer',
        currentXp: 6420,
        nextLevel: 5,
        nextLevelName: 'Diamond Master',
        nextLevelXp: 10000,
        xpRemaining: 3580,
        progressPercent: 64,
        isMaxLevel: false,
      });
      setSimulatedXp(6420);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLevelData();
  }, [loadLevelData]);

  // Derived progress variables
  const currentLevel = levelProgress?.currentLevel || 4;
  const currentLevelName = levelProgress?.currentLevelName || 'Reward Explorer';
  const currentXp = levelProgress?.currentXp || 6420;
  const nextLevel = levelProgress?.nextLevel || 5;
  const nextLevelName = levelProgress?.nextLevelName || 'Diamond Master';
  const nextLevelXp = levelProgress?.nextLevelXp || 10000;
  const xpRemaining = levelProgress?.xpRemaining || 3580;
  const progressPercent = levelProgress?.progressPercent || 64;
  const isMaxLevel = levelProgress?.isMaxLevel || false;

  // Actions
  const handleClaimDailyBonus = async () => {
    try {
      setIsClaimingBonus(true);
      const res = await api.actions.claimDailyBonus();
      if (res.success) {
        playRewardChime();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(res.message || 'Daily check-in claimed! +50 XP added.');
        loadLevelData();
      }
    } catch (err) {
      showToast(err.message || 'Daily bonus already claimed for today.', 'info');
    } finally {
      setIsClaimingBonus(false);
    }
  };

  const handleWatchAdReward = async () => {
    const res = await api.actions.watchAd();
    if (res.success) {
      playRewardChime();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(res.message || 'Video ad completed! +100 XP credited.');
      loadLevelData();
    }
  };

  const handleCopyReferral = () => {
    const code = profileData?.profile?.referralCode || 'VELOOP123';
    navigator.clipboard.writeText(`https://veloop.io/register?ref=${code}`);
    playRewardChime();
    showToast(`Referral link copied! (Code: ${code})`);
  };

  // Multiplier helper
  const getMultiplier = (lvl) => {
    const num = Number(lvl.level);
    if (num === 1) return '1.0x';
    if (num === 2) return '1.1x';
    if (num === 3) return '1.25x';
    if (num === 4) return '1.4x';
    if (num === 5) return '2.0x';
    return `${(lvl.bonusMultiplier || 1 + num * 0.1).toFixed(1)}x`;
  };

  // Compute simulated level based on slider
  const getSimulatedTier = (xp) => {
    let tier = allLevels[0];
    for (let i = 0; i < allLevels.length; i++) {
      if (xp >= allLevels[i].xpThreshold) {
        tier = allLevels[i];
      } else {
        break;
      }
    }
    return tier;
  };

  const currentSimTier = getSimulatedTier(simulatedXp);

  return (
    <div className={styles.pageWrapper}>
      <div className="container" style={{ maxWidth: 1240 }}>
        {/* ================================================================
            1. Cinematic Hero Section
            ================================================================ */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackdrop} />
          <div className={styles.heroGradientOverlay} />

          <div className={styles.heroContent}>
            <div className={styles.heroRow}>
              {/* Left Column: 3D Animated Hero Badge */}
              <div className={styles.heroBadgeCol}>
                <LevelBadge
                  level={currentLevel}
                  status="active"
                  size="hero"
                  interactive={true}
                  showStatusRibbon={true}
                  onClick={() => {
                    const lData = allLevels.find((l) => l.level === currentLevel);
                    setSelectedInspectLevel(lData);
                  }}
                />
                <button
                  className="btn btn-sm btn-outline-light rounded-pill mt-3 px-3 fw-bold"
                  style={{
                    fontSize: '0.74rem',
                    borderColor: 'rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                  onClick={() => {
                    const lData = allLevels.find((l) => l.level === currentLevel);
                    setSelectedInspectLevel(lData);
                  }}
                >
                  <Sparkles size={12} className="me-1 text-warning" />
                  Inspect 3D Crest
                </button>
              </div>

              {/* Right Column: User Prestige Status & Main Progress Gauge */}
              <div className={styles.heroInfoCol}>
                <div className={styles.prestigeTag}>
                  <Crown size={14} /> Prestige Tier Status
                </div>

                <h1 className={styles.heroTitle}>
                  Level {String(currentLevel).padStart(2, '0')} —{' '}
                  <span className={styles.heroTitleGradient}>{currentLevelName}</span>
                </h1>

                <p className={styles.heroSubtitle}>
                  Earn XP across the VELoop platform through daily check-ins, sponsored tasks, and
                  community activity to elevate your prestige tier and unlock permanent multiplier
                  boosts.
                </p>

                {/* Main Multi-Stage Progress Bar */}
                <div className={styles.heroProgressBlock}>
                  <div className={styles.progressHeader}>
                    <div>
                      <span className="text-muted small">Progression to Next Tier:</span>{' '}
                      <strong className="text-white">
                        {isMaxLevel ? 'Prestige Master Reached' : `Level ${nextLevel} — ${nextLevelName}`}
                      </strong>
                    </div>
                    <span className="badge bg-primary px-3 py-1 rounded-pill fw-bold">
                      {progressPercent}% Complete
                    </span>
                  </div>

                  <div className={styles.progressTrackMaster}>
                    <div
                      className={styles.progressFillMaster}
                      style={{ width: `${progressPercent}%` }}
                      role="progressbar"
                      aria-valuenow={progressPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div className={styles.progressShimmer} />
                    </div>
                  </div>

                  <div className={styles.progressMilestoneMarks}>
                    <span>Current: {currentXp.toLocaleString()} XP</span>
                    <span>
                      {isMaxLevel
                        ? 'Max Cap: 10,000+ XP'
                        : `${xpRemaining.toLocaleString()} XP to Level 0${nextLevel}`}
                    </span>
                    <span>Target: {nextLevelXp.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* 4-Column Hero Stats Grid */}
                <div className={styles.heroStatsGrid}>
                  <div className={styles.heroStatCard}>
                    <div className={styles.statCardLabel}>Active Multiplier</div>
                    <div className={styles.statCardValue} style={{ color: '#10b981' }}>
                      {(1 + currentLevel * 0.1).toFixed(1)}x Boost
                    </div>
                  </div>
                  <div className={styles.heroStatCard}>
                    <div className={styles.statCardLabel}>Total XP Earned</div>
                    <div className={styles.statCardValue} style={{ color: '#38bdf8' }}>
                      {currentXp.toLocaleString()} XP
                    </div>
                  </div>
                  <div className={styles.heroStatCard}>
                    <div className={styles.statCardLabel}>Next Milestone</div>
                    <div className={styles.statCardValue} style={{ color: '#fbbf24' }}>
                      {isMaxLevel ? 'MAX' : `${xpRemaining.toLocaleString()} XP`}
                    </div>
                  </div>
                  <div className={styles.heroStatCard}>
                    <div className={styles.statCardLabel}>Prestige Standing</div>
                    <div className={styles.statCardValue} style={{ color: '#ec4899' }}>
                      Top 5% Elite
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. View Switcher Tabs
            ================================================================ */}
        <nav className={styles.viewTabsNav} aria-label="Level View Selection">
          <button
            className={`${styles.viewTabBtn} ${
              activeTab === 'ROADMAP' ? styles.viewTabBtnActive : ''
            }`}
            onClick={() => setActiveTab('ROADMAP')}
          >
            <Compass size={18} />
            <span>5-Tier Interactive Roadmap</span>
          </button>
          <button
            className={`${styles.viewTabBtn} ${
              activeTab === 'COMPARISON' ? styles.viewTabBtnActive : ''
            }`}
            onClick={() => setActiveTab('COMPARISON')}
          >
            <Table size={18} />
            <span>Tier Comparison Matrix</span>
          </button>
          <button
            className={`${styles.viewTabBtn} ${
              activeTab === 'SIMULATOR' ? styles.viewTabBtnActive : ''
            }`}
            onClick={() => setActiveTab('SIMULATOR')}
          >
            <Sliders size={18} />
            <span>Prestige XP Simulator</span>
          </button>
        </nav>

        {/* ================================================================
            3A. TAB 1: 5-Tier Connected Roadmap
            ================================================================ */}
        {activeTab === 'ROADMAP' && (
          <section className={styles.roadmapSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Prestige Tier Progression Path</h2>
                <p className={styles.sectionDesc}>
                  Click any tier badge to inspect the 3D heraldic crest, unlock criteria, and
                  perks.
                </p>
              </div>
              <span className="badge bg-dark border border-secondary text-light px-3 py-2 rounded-pill small d-none d-sm-inline-block">
                5 Total Tiers Configured
              </span>
            </div>

            <div className={styles.roadmapContainer}>
              {allLevels.map((lvl) => {
                const isCompleted = currentLevel > lvl.level;
                const isActive = currentLevel === lvl.level;
                const isLocked = currentLevel < lvl.level;
                const status = isCompleted ? 'completed' : isActive ? 'active' : 'locked';

                return (
                  <div
                    key={lvl.level}
                    className={`${styles.roadmapCard} ${
                      isActive
                        ? styles.roadmapCardActive
                        : isCompleted
                        ? styles.roadmapCardCompleted
                        : styles.roadmapCardLocked
                    }`}
                    style={{
                      '--tier-color': lvl.badgeColor || '#6366f1',
                      '--tier-glow': `${lvl.badgeColor || '#6366f1'}50`,
                      '--tier-border': `${lvl.badgeColor || '#6366f1'}40`,
                    }}
                    onClick={() => setSelectedInspectLevel(lvl)}
                  >
                    <div className={styles.roadmapTierPill}>Tier 0{lvl.level}</div>

                    <div className={styles.roadmapBadgeWrap}>
                      <LevelBadge
                        level={lvl.level}
                        status={status}
                        size="lg"
                        interactive={false}
                        showStatusRibbon={true}
                      />
                    </div>

                    <h3 className={styles.roadmapTierName}>{lvl.name}</h3>
                    <div className={styles.roadmapXpThreshold}>
                      {lvl.xpThreshold === 0 ? 'Entry Level' : `${lvl.xpThreshold.toLocaleString()} XP Req`}
                    </div>

                    <div className={styles.roadmapMultiplierBadge}>
                      <TrendingUp size={12} />
                      {getMultiplier(lvl)} Multiplier
                    </div>

                    <p className={styles.roadmapPerkSummary}>
                      {lvl.benefits && lvl.benefits[0]
                        ? lvl.benefits[0]
                        : 'Platform rewards access & event drops'}
                    </p>

                    <button
                      className={styles.roadmapInspectBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectLevel(lvl);
                      }}
                    >
                      Inspect Tier Perks
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================
            3B. TAB 2: Side-by-Side Tier Comparison Table
            ================================================================ */}
        {activeTab === 'COMPARISON' && (
          <section className={styles.comparisonSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Full Tier Privileges Matrix</h2>
                <p className={styles.sectionDesc}>
                  Compare features, withdrawal fee waivers, multipliers, and exclusive mystery crates.
                </p>
              </div>
            </div>

            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Privilege / Feature</th>
                  {allLevels.map((lvl) => (
                    <th
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                      style={{
                        color: currentLevel === lvl.level ? '#38bdf8' : '#ffffff',
                      }}
                    >
                      <div className="d-flex align-items-center gap-1 justify-content-center">
                        {currentLevel === lvl.level && <Crown size={14} color="#38bdf8" />}
                        Level 0{lvl.level}
                      </div>
                      <div className="small text-muted fw-normal">{lvl.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>XP Required to Unlock</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      <span className="fw-bold">{lvl.xpThreshold.toLocaleString()} XP</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Platform Multiplier Boost</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        {getMultiplier(lvl)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Withdrawal Fee Waiver</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      {lvl.withdrawalFee || 'Standard'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Daily Check-in Reward</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      {lvl.dailyBonus || `${50 * lvl.level} XP`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Mystery Crates</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      {lvl.mysteryCrate || 'None'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>VIP Support SLA</strong>
                  </td>
                  {allLevels.map((lvl) => (
                    <td
                      key={lvl.level}
                      className={currentLevel === lvl.level ? styles.tableActiveColumn : ''}
                    >
                      {lvl.support || 'Standard'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* ================================================================
            3C. TAB 3: Interactive XP Simulator & Calculator
            ================================================================ */}
        {activeTab === 'SIMULATOR' && (
          <section className={styles.simulatorCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Interactive Prestige Simulator</h2>
                <p className={styles.sectionDesc}>
                  Drag the XP slider to simulate future progression and see what tier perks and
                  boosts you unlock!
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Simulated XP:</span>
              <span className="badge bg-primary fs-6 px-3 py-1 rounded-pill">
                {simulatedXp.toLocaleString()} XP
              </span>
            </div>

            <div className={styles.simulatorSliderTrack}>
              <input
                type="range"
                min="0"
                max="12000"
                step="250"
                value={simulatedXp}
                onChange={(e) => setSimulatedXp(Number(e.target.value))}
                className={styles.sliderInput}
              />
              <div className="d-flex justify-content-between text-muted small mt-2">
                <span>0 XP (Starter)</span>
                <span>3,500 XP (Gold)</span>
                <span>6,000 XP (Explorer)</span>
                <span>10,000+ XP (Diamond Master)</span>
              </div>
            </div>

            <div className={styles.simulatorResultGrid}>
              <div className={styles.simResultBox}>
                <div className="small mb-1" style={{ color: '#94a3b8', fontWeight: 600 }}>Simulated Prestige Tier</div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <LevelBadge
                    level={currentSimTier.level}
                    status={simulatedXp >= currentSimTier.xpThreshold ? 'active' : 'locked'}
                    size="sm"
                    interactive={false}
                  />
                  <div className="text-start">
                    <div className="fw-bold text-white">{currentSimTier.name}</div>
                    <div className="small text-muted">Tier 0{currentSimTier.level}</div>
                  </div>
                </div>
              </div>

              <div className={styles.simResultBox}>
                <div className="small mb-1" style={{ color: '#94a3b8', fontWeight: 600 }}>Active Reward Multiplier</div>
                <div className="fs-4 fw-bold text-success">
                  {getMultiplier(currentSimTier)}
                </div>
                <div className="small text-muted">Applied to all tasks & events</div>
              </div>

              <div className={styles.simResultBox}>
                <div className="small mb-1" style={{ color: '#94a3b8', fontWeight: 600 }}>Simulate Unlock Celebration</div>
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3 mt-1 fw-bold"
                  onClick={() => {
                    playRewardChime();
                    confetti({
                      particleCount: 120,
                      spread: 80,
                      origin: { y: 0.6 },
                    });
                    showToast(`Simulated Tier 0${currentSimTier.level}: ${currentSimTier.name}!`);
                  }}
                >
                  <Sparkles size={14} className="me-1" />
                  Test Unlock FX
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            4. "How to Earn XP Fast" Action Center
            ================================================================ */}
        <section className={styles.earnXpSection}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className={styles.sectionTitle}>Earn XP & Ascend Ranks</h2>
              <p className={styles.sectionDesc}>
                Take instant action right now to accumulate XP towards Level 0{nextLevel}!
              </p>
            </div>
          </div>

          <div className={styles.earnXpGrid}>
            {/* Action 1: Daily Check-in */}
            <div className={styles.earnXpCard}>
              <div className={styles.earnXpIconBox}>
                <Gift size={22} />
              </div>
              <h3 className={styles.earnXpTitle}>Daily Check-in</h3>
              <div className={styles.earnXpRewardBadge}>+50 XP Daily</div>
              <p className={styles.earnXpDesc}>
                Claim your daily loyalty reward every 24 hours to keep your active streak.
              </p>
              <button
                className={styles.earnXpActionBtn}
                onClick={handleClaimDailyBonus}
                disabled={isClaimingBonus}
              >
                {isClaimingBonus ? 'Claiming...' : 'Claim Daily Bonus'}
              </button>
            </div>

            {/* Action 2: Watch Sponsored Stream */}
            <div className={styles.earnXpCard}>
              <div className={styles.earnXpIconBox} style={{ color: '#38bdf8' }}>
                <Tv size={22} />
              </div>
              <h3 className={styles.earnXpTitle}>Watch Video Stream</h3>
              <div
                className={styles.earnXpRewardBadge}
                style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}
              >
                +100 XP + 50 SVEs
              </div>
              <p className={styles.earnXpDesc}>
                Watch a short interactive sponsor clip to earn instant XP and token assets.
              </p>
              <button
                className={styles.earnXpActionBtn}
                onClick={() => setIsWatchAdOpen(true)}
              >
                Watch Sponsored Video
              </button>
            </div>

            {/* Action 3: Convert SVEs */}
            <div className={styles.earnXpCard}>
              <div className={styles.earnXpIconBox} style={{ color: '#f59e0b' }}>
                <Coins size={22} />
              </div>
              <h3 className={styles.earnXpTitle}>Convert SVEs</h3>
              <div
                className={styles.earnXpRewardBadge}
                style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}
              >
                +25 XP per 100 SVEs
              </div>
              <p className={styles.earnXpDesc}>
                Swap your earned Silver Virtual Equivalents into spendable VES balances.
              </p>
              <button
                className={styles.earnXpActionBtn}
                onClick={() => setIsConvertOpen(true)}
              >
                Convert SVE Tokens
              </button>
            </div>

            {/* Action 4: Invite Friends */}
            <div className={styles.earnXpCard}>
              <div className={styles.earnXpIconBox} style={{ color: '#ec4899' }}>
                <Share2 size={22} />
              </div>
              <h3 className={styles.earnXpTitle}>Invite Network</h3>
              <div
                className={styles.earnXpRewardBadge}
                style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)' }}
              >
                +500 XP per Referral
              </div>
              <p className={styles.earnXpDesc}>
                Share your unique VELoop referral invite link with colleagues and teammates.
              </p>
              <button className={styles.earnXpActionBtn} onClick={handleCopyReferral}>
                Copy Referral Link
              </button>
            </div>
          </div>
        </section>

        {/* Modals */}
        <BadgeInspectModal
          levelData={selectedInspectLevel}
          currentLevel={currentLevel}
          isOpen={!!selectedInspectLevel}
          onClose={() => setSelectedInspectLevel(null)}
          onTakeAction={() => {
            setSelectedInspectLevel(null);
            setIsWatchAdOpen(true);
          }}
        />

        <WatchAdModal
          isOpen={isWatchAdOpen}
          onClose={() => setIsWatchAdOpen(false)}
          onRewardClaimed={handleWatchAdReward}
        />

        <ConvertSvesModal
          availableSves={profileData?.rewards?.sves || 1240}
          isOpen={isConvertOpen}
          onClose={() => setIsConvertOpen(false)}
          onConvert={async (amt) => {
            const res = await api.actions.convertSves(amt);
            if (res.success) {
              playRewardChime();
              confetti({ particleCount: 70, spread: 60 });
              showToast('SVEs converted and XP credited!');
              loadLevelData();
            }
          }}
        />
      </div>
    </div>
  );
};

export default LevelPage;
