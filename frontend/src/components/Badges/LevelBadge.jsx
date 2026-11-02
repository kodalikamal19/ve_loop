import React from 'react';
import { Lock, Check, Sparkles } from 'lucide-react';
import styles from './LevelBadge.module.css';

/**
 * LevelBadge - Master handcrafted 3D gamification badges for VELoop
 * Level 1: Obsidian Emerald Heraldic Shield (Reward Starter)
 * Level 2: Supersonic Winged Hex-Crystal (Silver Seeker)
 * Level 3: Solar Aureate Octagram Crest (Gold Adventurer)
 * Level 4: Nebula Sovereign Crown & Levitating Shards (Reward Explorer)
 * Level 5: Prismatic Nova Octahedron with Gyro Orbital Rings (Diamond Master)
 */
export const LevelBadge = ({
  level = 1,
  status = 'active', // 'completed' | 'active' | 'locked'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  interactive = true,
  showStatusRibbon = false,
  onClick,
  className = '',
}) => {
  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  // Config mapping for each level
  const levelConfigs = {
    1: {
      name: 'Reward Starter',
      accentColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.55)',
      roman: 'I',
    },
    2: {
      name: 'Silver Seeker',
      accentColor: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.55)',
      roman: 'II',
    },
    3: {
      name: 'Gold Adventurer',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.65)',
      roman: 'III',
    },
    4: {
      name: 'Reward Explorer',
      accentColor: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.65)',
      roman: 'IV',
    },
    5: {
      name: 'Diamond Master',
      accentColor: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.75)',
      roman: 'V',
    },
  };

  const currentConfig = levelConfigs[level] || levelConfigs[1];

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
    hero: styles.sizeHero,
  }[size] || styles.sizeMd;

  // Render unique SVG graphics for each level
  const renderBadgeSvg = () => {
    switch (Number(level)) {
      case 1:
        // LEVEL 1: Obsidian Emerald Heraldic Shield
        return (
          <svg viewBox="0 0 160 160" className={styles.svgElement} fill="none">
            <defs>
              <linearGradient id="l1-shield-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#475569' : '#64748b'} />
                <stop offset="50%" stopColor={isLocked ? '#334155' : '#334155'} />
                <stop offset="100%" stopColor={isLocked ? '#1e293b' : '#0f172a'} />
              </linearGradient>
              <linearGradient id="l1-shield-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#94a3b8' : '#cbd5e1'} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="l1-emerald-core" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#64748b' : '#34d399'} />
                <stop offset="50%" stopColor={isLocked ? '#475569' : '#10b981'} />
                <stop offset="100%" stopColor={isLocked ? '#1e293b' : '#047857'} />
              </linearGradient>
              <filter id="l1-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Base Glow */}
            {!isLocked && (
              <circle cx="80" cy="80" r="62" fill="url(#l1-emerald-core)" opacity="0.18" filter="url(#l1-glow)" />
            )}

            {/* Heavy Heraldic Shield Body */}
            <path
              d="M80 18 L134 38 C134 88 114 126 80 148 C46 126 26 88 26 38 Z"
              fill="url(#l1-shield-outer)"
              stroke="url(#l1-shield-bevel)"
              strokeWidth="4"
            />

            {/* Inner Recessed Plate */}
            <path
              d="M80 28 L124 44 C124 84 108 116 80 134 C52 116 36 84 36 44 Z"
              fill={isLocked ? '#1e293b' : '#111827'}
              stroke={isLocked ? '#334155' : '#10b981'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Diagonal Bevel Creases (3D faceted look) */}
            <path d="M80 28 L80 134" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <path d="M36 44 L80 80 L124 44" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

            {/* Central Emerald Vanguard Gem */}
            <g transform="translate(80, 78)">
              {/* Outer Gem Bevel */}
              <polygon
                points="0,-26 22,0 0,26 -22,0"
                fill="url(#l1-emerald-core)"
                stroke="#6ee7b7"
                strokeWidth="1.5"
                filter={isLocked ? 'none' : 'url(#l1-glow)'}
              />
              {/* Specular Highlight Facet */}
              <polygon points="0,-26 0,26 22,0" fill="rgba(255,255,255,0.22)" />
              <polygon points="0,-26 0,0 -22,0" fill="rgba(255,255,255,0.35)" />
            </g>

            {/* Heraldic Chevrons at bottom */}
            <path
              d="M62 108 L80 120 L98 108"
              stroke={isLocked ? '#475569' : '#10b981'}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M66 116 L80 126 L94 116"
              stroke={isLocked ? '#334155' : '#34d399'}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Tier Marker */}
            <text
              x="80"
              y="45"
              textAnchor="middle"
              fill={isLocked ? '#64748b' : '#a7f3d0'}
              fontSize="12"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              TIER I
            </text>
          </svg>
        );

      case 2:
        // LEVEL 2: Supersonic Winged Hex-Crystal (Silver Seeker)
        return (
          <svg viewBox="0 0 160 160" className={styles.svgElement} fill="none">
            <defs>
              <linearGradient id="l2-wing-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#475569' : '#0284c7'} />
                <stop offset="100%" stopColor={isLocked ? '#1e293b' : '#0369a1'} />
              </linearGradient>
              <linearGradient id="l2-wing-right" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#64748b' : '#38bdf8'} />
                <stop offset="100%" stopColor={isLocked ? '#1e293b' : '#0284c7'} />
              </linearGradient>
              <linearGradient id="l2-cyan-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#94a3b8' : '#e0f2fe'} />
                <stop offset="40%" stopColor={isLocked ? '#64748b' : '#38bdf8'} />
                <stop offset="100%" stopColor={isLocked ? '#334155' : '#0284c7'} />
              </linearGradient>
              <linearGradient id="l2-chrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <filter id="l2-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Cyan Aura */}
            {!isLocked && (
              <circle cx="80" cy="80" r="65" fill="#38bdf8" opacity="0.22" filter="url(#l2-glow)" />
            )}

            {/* Left Supersonic Cyber Wing */}
            <path
              d="M48 60 L14 42 L26 82 L42 98 L50 82 Z"
              fill="url(#l2-wing-left)"
              stroke={isLocked ? '#334155' : '#38bdf8'}
              strokeWidth="2"
            />
            <path d="M16 52 L36 78" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Right Supersonic Cyber Wing */}
            <path
              d="M112 60 L146 42 L134 82 L118 98 L110 82 Z"
              fill="url(#l2-wing-right)"
              stroke={isLocked ? '#334155' : '#7dd3fc'}
              strokeWidth="2"
            />
            <path d="M144 52 L124 78" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Outer Beveled Hexagon Chassis */}
            <polygon
              points="80,20 122,44 122,96 80,120 38,96 38,44"
              fill={isLocked ? '#1e293b' : '#0f172a'}
              stroke="url(#l2-chrome)"
              strokeWidth="4"
            />

            {/* Inner Cyber Conduit Hexagon */}
            <polygon
              points="80,30 114,50 114,90 80,110 46,90 46,50"
              fill={isLocked ? '#0f172a' : '#03172e'}
              stroke={isLocked ? '#334155' : '#38bdf8'}
              strokeWidth="1.5"
            />

            {/* Central Electric Lightning Crystal */}
            <g transform="translate(80, 70)">
              {/* Central Diamond Crystal */}
              <polygon
                points="0,-24 18,-6 0,26 -18,-6"
                fill="url(#l2-cyan-crystal)"
                stroke="#bae6fd"
                strokeWidth="1.5"
                filter={isLocked ? 'none' : 'url(#l2-glow)'}
              />
              {/* Lightning Bolt Core Inset */}
              <path
                d="M2 -14 L-6 0 L0 0 L-2 16 L8 -2 L1 -2 Z"
                fill={isLocked ? '#94a3b8' : '#ffffff'}
              />
            </g>

            {/* Bottom Cyber Thruster Accents */}
            <path
              d="M64 124 L80 138 L96 124"
              stroke={isLocked ? '#334155' : '#38bdf8'}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="80" cy="144" r="3" fill={isLocked ? '#475569' : '#00f0ff'} />

            {/* Tier Marker */}
            <text
              x="80"
              y="44"
              textAnchor="middle"
              fill={isLocked ? '#64748b' : '#bae6fd'}
              fontSize="11"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              TIER II
            </text>
          </svg>
        );

      case 3:
        // LEVEL 3: 24K Solar Aureate Starburst (Gold Adventurer)
        return (
          <svg viewBox="0 0 160 160" className={styles.svgElement} fill="none">
            <defs>
              <linearGradient id="l3-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#78716c' : '#fef08a'} />
                <stop offset="30%" stopColor={isLocked ? '#57534e' : '#f59e0b'} />
                <stop offset="70%" stopColor={isLocked ? '#44403c' : '#d97706'} />
                <stop offset="100%" stopColor={isLocked ? '#292524' : '#78350f'} />
              </linearGradient>
              <linearGradient id="l3-gold-rays" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#78716c' : '#fde047'} />
                <stop offset="100%" stopColor={isLocked ? '#292524' : '#b45309'} />
              </linearGradient>
              <linearGradient id="l3-gold-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="l3-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Solar Corona Ambient Glow */}
            {!isLocked && (
              <circle cx="80" cy="80" r="68" fill="#f59e0b" opacity="0.28" filter="url(#l3-glow)" />
            )}

            {/* Eight-Pointed Outer Starburst Backing */}
            <g transform="translate(80, 80)">
              <polygon
                points="0,-72 18,-24 72,0 18,24 0,72 -18,24 -72,0 -18,-24"
                fill="url(#l3-gold-rays)"
                opacity="0.85"
              />
              <polygon
                points="0,-64 16,-20 64,0 16,20 0,64 -16,20 -64,0 -16,-20"
                transform="rotate(45)"
                fill="url(#l3-gold-primary)"
                opacity="0.75"
              />
            </g>

            {/* Concentric Royal Beveled Ring */}
            <circle
              cx="80"
              cy="80"
              r="48"
              fill={isLocked ? '#1c1917' : '#1c1404'}
              stroke="url(#l3-gold-light)"
              strokeWidth="4"
            />

            <circle
              cx="80"
              cy="80"
              r="40"
              fill="none"
              stroke={isLocked ? '#44403c' : '#fbbf24'}
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />

            {/* Royal Gold Sun Crown / Crest Center */}
            <g transform="translate(80, 78)">
              {/* Center Radiant Sunburst Star */}
              <polygon
                points="0,-22 7,-7 22,0 7,7 0,22 -7,7 -22,0 -7,-7"
                fill="url(#l3-gold-primary)"
                stroke="#fef08a"
                strokeWidth="1.5"
                filter={isLocked ? 'none' : 'url(#l3-glow)'}
              />
              <circle cx="0" cy="0" r="8" fill="#fffbeb" />
              <circle cx="0" cy="0" r="5" fill="#f59e0b" />
            </g>

            {/* Aureate Wreath Leaves at base */}
            <path
              d="M52 114 C62 126 98 126 108 114"
              stroke={isLocked ? '#44403c' : '#f59e0b'}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M58 122 C70 132 90 132 102 122"
              stroke={isLocked ? '#292524' : '#fbbf24'}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tier Marker */}
            <text
              x="80"
              y="48"
              textAnchor="middle"
              fill={isLocked ? '#78716c' : '#fef08a'}
              fontSize="11"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              TIER III
            </text>
          </svg>
        );

      case 4:
        // LEVEL 4: Cosmic Nebula Sovereign Crown (Reward Explorer)
        return (
          <svg viewBox="0 0 160 160" className={styles.svgElement} fill="none">
            <defs>
              <linearGradient id="l4-violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#581c87' : '#c084fc'} />
                <stop offset="40%" stopColor={isLocked ? '#3b0764' : '#9333ea'} />
                <stop offset="80%" stopColor={isLocked ? '#1e1b4b' : '#6b21a8'} />
                <stop offset="100%" stopColor={isLocked ? '#0f172a' : '#3b0764'} />
              </linearGradient>
              <linearGradient id="l4-nebula-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <filter id="l4-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Deep Violet Cosmic Aura */}
            {!isLocked && (
              <circle cx="80" cy="80" r="70" fill="#a855f7" opacity="0.32" filter="url(#l4-glow)" />
            )}

            {/* Levitating Satellite Shards (Left & Right) */}
            <g>
              <polygon
                points="18,65 24,55 28,68 22,78"
                fill="url(#l4-nebula-glow)"
                opacity={isLocked ? 0.4 : 0.85}
              />
              <polygon
                points="142,65 136,55 132,68 138,78"
                fill="url(#l4-nebula-glow)"
                opacity={isLocked ? 0.4 : 0.85}
              />
              <polygon
                points="28,95 34,90 32,102 26,104"
                fill="url(#l4-violet-grad)"
                opacity={isLocked ? 0.3 : 0.7}
              />
              <polygon
                points="132,95 126,90 128,102 134,104"
                fill="url(#l4-violet-grad)"
                opacity={isLocked ? 0.3 : 0.7}
              />
            </g>

            {/* 3D Cosmic Shield Base */}
            <path
              d="M80 18 L128 34 C128 88 108 126 80 148 C52 126 32 88 32 34 Z"
              fill={isLocked ? '#1e1b4b' : '#140c24'}
              stroke="url(#l4-nebula-glow)"
              strokeWidth="3.5"
            />

            {/* Sovereign Regal Crown (5-peak crown) */}
            <g transform="translate(80, 72)">
              <path
                d="M-38 18 L-36 -12 L-20 4 L0 -24 L20 4 L36 -12 L38 18 Z"
                fill="url(#l4-violet-grad)"
                stroke="#e9d5ff"
                strokeWidth="2"
                filter={isLocked ? 'none' : 'url(#l4-glow)'}
              />
              {/* Crown Jewels on spires */}
              <circle cx="0" cy="-24" r="4.5" fill="#ffffff" />
              <circle cx="-36" cy="-12" r="3.5" fill="#f3e8ff" />
              <circle cx="36" cy="-12" r="3.5" fill="#f3e8ff" />
              <circle cx="-20" cy="4" r="2.5" fill="#c084fc" />
              <circle cx="20" cy="4" r="2.5" fill="#c084fc" />

              {/* Central Cosmic Singularity Diamond */}
              <polygon
                points="0,-4 14,14 0,32 -14,14"
                fill="#ffffff"
                stroke="#c084fc"
                strokeWidth="1.5"
              />
              <polygon points="0,-4 0,32 14,14" fill="#a855f7" opacity="0.6" />
            </g>

            {/* Nebula Arc Waves at Base */}
            <path
              d="M50 114 Q80 134 110 114"
              stroke={isLocked ? '#3b0764' : '#c084fc'}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M58 124 Q80 140 102 124"
              stroke={isLocked ? '#1e1b4b' : '#8b5cf6'}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tier Marker */}
            <text
              x="80"
              y="40"
              textAnchor="middle"
              fill={isLocked ? '#6b21a8' : '#e9d5ff'}
              fontSize="11"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              TIER IV
            </text>
          </svg>
        );

      case 5:
        // LEVEL 5: Prismatic Nova Octahedron with Gyro Rings (Diamond Master)
        return (
          <svg viewBox="0 0 160 160" className={styles.svgElement} fill="none">
            <defs>
              <linearGradient id="l5-prismatic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLocked ? '#831843' : '#f472b6'} />
                <stop offset="35%" stopColor={isLocked ? '#500724' : '#ec4899'} />
                <stop offset="70%" stopColor={isLocked ? '#083344' : '#06b6d4'} />
                <stop offset="100%" stopColor={isLocked ? '#164e63' : '#38bdf8'} />
              </linearGradient>
              <linearGradient id="l5-hyper-ring" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
              <linearGradient id="l5-core-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fbcfe8" />
                <stop offset="65%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="l5-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dual Tone Prismatic Nova Aura */}
            {!isLocked && (
              <>
                <circle cx="70" cy="75" r="65" fill="#ec4899" opacity="0.32" filter="url(#l5-glow)" />
                <circle cx="90" cy="85" r="65" fill="#06b6d4" opacity="0.32" filter="url(#l5-glow)" />
              </>
            )}

            {/* Twin Gyroscopic Orbital Rings */}
            <ellipse
              cx="80"
              cy="80"
              rx="68"
              ry="26"
              transform="rotate(-25 80 80)"
              fill="none"
              stroke="url(#l5-hyper-ring)"
              strokeWidth="2.5"
              strokeDasharray="14 4"
              opacity={isLocked ? 0.35 : 0.85}
            />
            <ellipse
              cx="80"
              cy="80"
              rx="68"
              ry="26"
              transform="rotate(35 80 80)"
              fill="none"
              stroke="url(#l5-hyper-ring)"
              strokeWidth="2"
              opacity={isLocked ? 0.25 : 0.75}
            />

            {/* Celestial Phoenix Flame / Apex Corona */}
            <path
              d="M80 12 C72 30 62 36 68 50 C74 42 78 40 80 34 C82 40 86 42 92 50 C98 36 88 30 80 12 Z"
              fill={isLocked ? '#831843' : '#f43f5e'}
              filter={isLocked ? 'none' : 'url(#l5-glow)'}
            />

            {/* Central Hyper-Dimensional Diamond Octahedron */}
            <g transform="translate(80, 80)">
              {/* Outer Facets */}
              <polygon
                points="0,-48 38,-12 0,48 -38,-12"
                fill={isLocked ? '#1c1917' : '#0a091e'}
                stroke="url(#l5-prismatic)"
                strokeWidth="4"
              />

              {/* Top Facets */}
              <polygon points="0,-48 0,0 -38,-12" fill="url(#l5-core-diamond)" opacity="0.9" />
              <polygon points="0,-48 38,-12 0,0" fill="#ffffff" opacity="0.95" />

              {/* Bottom Facets */}
              <polygon points="0,0 38,-12 0,48" fill="url(#l5-prismatic)" opacity="0.85" />
              <polygon points="0,0 0,48 -38,-12" fill="#083344" opacity="0.95" />

              {/* Inner Diamond Light Prism */}
              <polygon
                points="0,-22 16,0 0,22 -16,0"
                fill="#ffffff"
                filter={isLocked ? 'none' : 'url(#l5-glow)'}
              />
              <circle cx="0" cy="0" r="4" fill="#00f0ff" />
            </g>

            {/* Prismatic Shimmer Stars */}
            <g fill="#ffffff">
              <polygon points="40,42 42,47 47,49 42,51 40,56 38,51 33,49 38,47" opacity="0.9" />
              <polygon points="120,112 122,117 127,119 122,121 120,126 118,121 113,119 118,117" opacity="0.9" />
            </g>

            {/* Tier Marker */}
            <text
              x="80"
              y="148"
              textAnchor="middle"
              fill={isLocked ? '#831843' : '#fbcfe8'}
              fontSize="11"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              TIER V • MASTER
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.badgeContainer} ${sizeClass} ${interactive ? styles.badgeInteractive : ''} ${className}`}
      style={{
        '--level-accent': currentConfig.accentColor,
        '--level-glow': currentConfig.glowColor,
      }}
      onClick={onClick}
      role={interactive ? 'button' : 'img'}
      aria-label={`Level ${level} - ${currentConfig.name} (${status})`}
    >
      {/* Active Level Pulsing Aura & Orbital Rings */}
      {isActive && (
        <>
          <div className={styles.activeGlowPulse} />
          <div className={styles.activePulseHalo} />
        </>
      )}

      {/* SVG Graphics Container */}
      <div className={styles.svgWrapper}>
        {renderBadgeSvg()}

        {/* Locked Frosted Glass Overlay with Cyber Padlock */}
        {isLocked && (
          <div className={styles.lockedOverlay}>
            <div className={styles.padlockPill} title="Locked Level">
              <Lock size={size === 'hero' ? 24 : size === 'xl' ? 20 : size === 'sm' ? 12 : 16} />
            </div>
          </div>
        )}
      </div>

      {/* Status Ribbons */}
      {showStatusRibbon && (
        <div className={styles.statusBadgeContainer}>
          {isCompleted && (
            <span className={styles.completedRibbon}>
              <Check size={11} strokeWidth={3} /> Mastered
            </span>
          )}
          {isActive && (
            <span className={styles.currentRibbon}>
              <span className={styles.pulseDot} /> Current
            </span>
          )}
          {isLocked && (
            <span className={styles.lockedRibbon}>
              <Lock size={10} /> Locked
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelBadge;
