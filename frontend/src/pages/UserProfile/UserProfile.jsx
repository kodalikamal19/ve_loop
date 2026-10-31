import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import ProfileHero from '../../components/UserProfile/ProfileHero';
import RewardAssets from '../../components/UserProfile/RewardAssets';
import LevelProgress from '../../components/UserProfile/LevelProgress';
import AchievementCard from '../../components/UserProfile/AchievementCard';
import WithdrawalOverview from '../../components/UserProfile/WithdrawalOverview';
import QuickActions from '../../components/UserProfile/QuickActions';
import ReferralSnapshot from '../../components/UserProfile/ReferralSnapshot';
import RecentActivity from '../../components/UserProfile/RecentActivity';
import AccountInformation from '../../components/UserProfile/AccountInformation';

import ProfileSkeleton from '../../components/UserProfile/ProfileSkeleton';
import ProfileErrorState from '../../components/UserProfile/ProfileErrorState';

import EditProfileModal from '../../components/UserProfile/EditProfileModal';
import WithdrawalModal from '../../components/UserProfile/WithdrawalModal';
import ConvertSvesModal from '../../components/UserProfile/ConvertSvesModal';
import WatchAdModal from '../../components/UserProfile/WatchAdModal';

export const UserProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile data from backend
  const [profileData, setProfileData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activity, setActivity] = useState([]);

  // Modal open states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isConvertSvesOpen, setIsConvertSvesOpen] = useState(false);
  const [isWatchAdOpen, setIsWatchAdOpen] = useState(false);
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  // Load all user profile data from backend
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, achRes, wdrRes, actRes] = await Promise.all([
        api.profile.getMe(),
        api.profile.getAchievements(),
        api.profile.getWithdrawalSummary(),
        api.profile.getActivity(12),
      ]);

      if (profileRes.success) {
        setProfileData(profileRes);
      }
      if (achRes.success) {
        setAchievements(achRes.achievements || []);
      }
      if (wdrRes.success) {
        setWithdrawals(wdrRes.recent || []);
      }
      if (actRes.success) {
        setActivity(actRes.activity || []);
      }
    } catch (err) {
      console.error('Failed to load profile from backend:', err);
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Handle Edit Profile Save
  const handleSaveProfile = async (formData) => {
    const res = await api.profile.updateMe(formData);
    if (res.success) {
      showToast('Profile details updated successfully!');
      loadProfile();
    }
  };

  // Handle Daily Bonus Claim
  const handleClaimDailyBonus = async () => {
    try {
      setIsClaimingBonus(true);
      const res = await api.actions.claimDailyBonus();
      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(res.message || 'Daily check-in bonus claimed!');
        loadProfile();
      }
    } catch (err) {
      showToast(err.message || 'Could not claim daily bonus today.', 'error');
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Handle Watch Ad Completion
  const handleWatchAdReward = async () => {
    const res = await api.actions.watchAd();
    if (res.success) {
      showToast(res.message || 'Ad reward credited!');
      loadProfile();
    }
  };

  // Handle Convert SVEs
  const handleConvertSves = async (svesAmount) => {
    const res = await api.actions.convertSves(svesAmount);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(res.message || 'SVEs converted successfully!');
      loadProfile();
    }
  };

  // Handle Withdrawal Request
  const handleSubmitWithdrawal = async (withdrawalData) => {
    const res = await api.actions.submitWithdrawal(withdrawalData);
    if (res.success) {
      showToast('Withdrawal request submitted! Amount reserved.');
      loadProfile();
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profileData) {
    return <ProfileErrorState message={error} onRetry={loadProfile} />;
  }

  const { profile, rewards, levelProgress, withdrawalsSummary, referralsSummary } = profileData;

  return (
    <main className="container py-4 animate-fade-in" style={{ maxWidth: 1240 }}>
      {/* 1. Hero Section */}
      <ProfileHero
        profile={profile}
        levelProgress={levelProgress}
        onEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* 2. Reward Assets — Your Balances */}
      <RewardAssets
        rewards={rewards}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenConvertSves={() => setIsConvertSvesOpen(true)}
        onOpenDailyBonus={handleClaimDailyBonus}
        onOpenWatchAd={() => setIsWatchAdOpen(true)}
      />

      {/* 3. Quick Actions */}
      <QuickActions
        onClaimDailyBonus={handleClaimDailyBonus}
        onWatchAd={() => setIsWatchAdOpen(true)}
        onConvertSves={() => setIsConvertSvesOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        isClaimingBonus={isClaimingBonus}
      />

      {/* 4. Gamified Level Progress */}
      <LevelProgress levelProgress={levelProgress} />

      {/* 5. Achievements & Badges */}
      <AchievementCard achievements={achievements} />

      {/* 6. Withdrawal Overview */}
      <WithdrawalOverview
        withdrawalsSummary={withdrawalsSummary}
        recentWithdrawals={withdrawals}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
      />

      {/* 7. Referral Snapshot */}
      <ReferralSnapshot referralsSummary={referralsSummary} />

      {/* 8. Recent Activity */}
      <RecentActivity activity={activity} />

      {/* 9. Account Information & Security */}
      <AccountInformation profile={profile} />

      {/* Modals */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <WithdrawalModal
        availableVes={rewards?.ves || 0}
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSubmit={handleSubmitWithdrawal}
      />

      <ConvertSvesModal
        availableSves={rewards?.sves || 0}
        isOpen={isConvertSvesOpen}
        onClose={() => setIsConvertSvesOpen(false)}
        onConvert={handleConvertSves}
      />

      <WatchAdModal
        isOpen={isWatchAdOpen}
        onClose={() => setIsWatchAdOpen(false)}
        onRewardClaimed={handleWatchAdReward}
      />
    </main>
  );
};

export default UserProfile;
