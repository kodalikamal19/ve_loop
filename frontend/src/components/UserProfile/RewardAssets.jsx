import React, { useState } from 'react';
import { Coins, CircleDollarSign, Gem, Flame, Zap, HelpCircle, ArrowUpRight, RefreshCw, PlusCircle, ArrowDownCircle } from 'lucide-react';
import styles from './RewardAssets.module.css';

export const RewardAssets = ({
  rewards,
  onOpenWithdraw,
  onOpenConvertSves,
  onOpenDailyBonus,
  onOpenWatchAd,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  const ves = rewards?.ves || 0;
  const sves = rewards?.sves || 0;
  const gems = rewards?.gems || 0;
  const tokens = rewards?.tokens || 0;
  const xp = rewards?.xp || 0;
  const reservedVes = rewards?.reservedVes || 0;

  return (
    <section>
      <div className={styles.sectionTitle}>
        <span>Reward Assets — Your Balances</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Backend-verified live balance
        </span>
      </div>

      <div className={styles.assetsGrid}>
        {/* 1. VEs Card */}
        <div className={`${styles.assetCard} ${styles.cardVes}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Coins size={22} />
              </div>
              <button
                className={styles.infoTooltipBtn}
                onClick={() => toggleTooltip('ves')}
                title="What are VEs?"
                aria-label="Info about VEs"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <div className={styles.assetLabel}>VEs (Rewards)</div>
            <div className={styles.assetValue}>{ves.toLocaleString()}</div>
            <div className={styles.assetSubtext}>
              {reservedVes > 0 ? (
                <span style={{ color: '#d97706' }}>
                  ({reservedVes.toLocaleString()} VEs reserved in withdrawal)
                </span>
              ) : (
                'Redeemable points for real cash & vouchers (2 VEs ≈ ₹1)'
              )}
            </div>
          </div>
          <button onClick={onOpenWithdraw} className={styles.assetActionBtn}>
            <ArrowDownCircle size={14} />
            <span>Redeem Payout</span>
          </button>
        </div>

        {/* 2. SVEs Card (Silver treatment) */}
        <div className={`${styles.assetCard} ${styles.cardSves}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <CircleDollarSign size={22} />
              </div>
              <button
                className={styles.infoTooltipBtn}
                onClick={() => toggleTooltip('sves')}
                title="What are SVEs?"
                aria-label="Info about SVEs"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <div className={styles.assetLabel}>SVEs (Silver)</div>
            <div className={styles.assetValue}>{sves.toLocaleString()}</div>
            <div className={styles.assetSubtext}>
              Pre-conversion silver points. Exchange into VEs at 1.2x boost!
            </div>
          </div>
          <button onClick={onOpenConvertSves} className={styles.assetActionBtn}>
            <RefreshCw size={14} />
            <span>Convert to VEs</span>
          </button>
        </div>

        {/* 3. Gems Card */}
        <div className={`${styles.assetCard} ${styles.cardGems}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Gem size={22} />
              </div>
              <button
                className={styles.infoTooltipBtn}
                onClick={() => toggleTooltip('gems')}
                title="What are Gems?"
                aria-label="Info about Gems"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <div className={styles.assetLabel}>Gems</div>
            <div className={styles.assetValue}>{gems.toLocaleString()}</div>
            <div className={styles.assetSubtext}>
              Prestige crystals earned from milestones & daily check-ins.
            </div>
          </div>
          <button onClick={onOpenDailyBonus} className={styles.assetActionBtn}>
            <PlusCircle size={14} />
            <span>Collect Gems</span>
          </button>
        </div>

        {/* 4. Tokens Card */}
        <div className={`${styles.assetCard} ${styles.cardTokens}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Zap size={22} />
              </div>
              <button
                className={styles.infoTooltipBtn}
                onClick={() => toggleTooltip('tokens')}
                title="What are Tokens?"
                aria-label="Info about Tokens"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <div className={styles.assetLabel}>Tokens</div>
            <div className={styles.assetValue}>{tokens.toLocaleString()}</div>
            <div className={styles.assetSubtext}>
              Activity tokens unlocked through daily ad watches & challenges.
            </div>
          </div>
          <button onClick={onOpenWatchAd} className={styles.assetActionBtn}>
            <ArrowUpRight size={14} />
            <span>Earn Tokens</span>
          </button>
        </div>

        {/* 5. XP Card */}
        <div className={`${styles.assetCard} ${styles.cardXp}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Flame size={22} />
              </div>
              <button
                className={styles.infoTooltipBtn}
                onClick={() => toggleTooltip('xp')}
                title="What is XP?"
                aria-label="Info about XP"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <div className={styles.assetLabel}>XP (Experience)</div>
            <div className={styles.assetValue}>{xp.toLocaleString()}</div>
            <div className={styles.assetSubtext}>
              Non-spendable rank gauge determining your status and perks.
            </div>
          </div>
          <a href="#level-section" className={styles.assetActionBtn}>
            <span>View Perks</span>
          </a>
        </div>
      </div>

      {/* Interactive Explanation Tooltip Modal if toggled */}
      {activeTooltip && (
        <div
          className="alert alert-primary d-flex justify-content-between align-items-center mb-4 py-2 px-3 animate-fade-in"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.88rem' }}>
            {activeTooltip === 'ves' && (
              <>
                <strong>VEs (VELoop Points):</strong> Spendable currency withdrawable to UPI, Bank, or Vouchers. Rate: 2 VEs = ₹1.
              </>
            )}
            {activeTooltip === 'sves' && (
              <>
                <strong>SVEs (Silver Points):</strong> Exclusive bonus rewards convertible into VEs with a 1.2x exchange boost.
              </>
            )}
            {activeTooltip === 'gems' && (
              <>
                <strong>Gems:</strong> Premium crystals obtained through daily streaks and unlocking rare achievements.
              </>
            )}
            {activeTooltip === 'tokens' && (
              <>
                <strong>Tokens:</strong> Community engagement tokens earned from watching partner messages and surveys.
              </>
            )}
            {activeTooltip === 'xp' && (
              <>
                <strong>XP (Experience Points):</strong> Experience measures platform rank and progression. XP is non-redeemable and unlocks permanent tier perks.
              </>
            )}
          </div>
          <button
            onClick={() => setActiveTooltip(null)}
            className="btn-close"
            aria-label="Close explanation"
            style={{ fontSize: '0.75rem', marginLeft: '12px' }}
          />
        </div>
      )}
    </section>
  );
};

export default RewardAssets;
