import { LevelConfiguration } from '../models/LevelConfiguration.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { ActivityLog } from '../models/ActivityLog.js';

export const calculateLevelProgress = async (currentXp) => {
  const levels = await LevelConfiguration.find({ isActive: true }).sort({ level: 1 });
  if (!levels || levels.length === 0) {
    return {
      currentLevel: 1,
      currentLevelName: 'Reward Starter',
      currentXp: currentXp || 0,
      nextLevel: 2,
      nextLevelXp: 1000,
      xpRemaining: Math.max(0, 1000 - (currentXp || 0)),
      progressPercent: Math.min(100, Math.round(((currentXp || 0) / 1000) * 100)),
      badgeIcon: 'Shield',
      badgeColor: '#3b82f6',
    };
  }

  let currentLevelObj = levels[0];
  let nextLevelObj = levels[1] || null;

  for (let i = 0; i < levels.length; i++) {
    if ((currentXp || 0) >= levels[i].xpThreshold) {
      currentLevelObj = levels[i];
      nextLevelObj = levels[i + 1] || null;
    } else {
      break;
    }
  }

  const nextLevelXp = nextLevelObj ? nextLevelObj.xpThreshold : currentLevelObj.xpThreshold;
  const prevLevelXp = currentLevelObj.xpThreshold;
  const isMaxLevel = !nextLevelObj;

  let progressPercent = 100;
  let xpRemaining = 0;

  if (!isMaxLevel) {
    const range = nextLevelXp - prevLevelXp;
    const gainedInRange = Math.max(0, (currentXp || 0) - prevLevelXp);
    progressPercent = range > 0 ? Math.min(100, Math.round((gainedInRange / range) * 100)) : 100;
    xpRemaining = Math.max(0, nextLevelXp - (currentXp || 0));
  }

  return {
    currentLevel: currentLevelObj.level,
    currentLevelName: currentLevelObj.name,
    currentXp: currentXp || 0,
    nextLevel: nextLevelObj ? nextLevelObj.level : currentLevelObj.level,
    nextLevelName: nextLevelObj ? nextLevelObj.name : 'Max Level Master',
    nextLevelXp,
    xpRemaining,
    progressPercent,
    badgeIcon: currentLevelObj.badgeIcon,
    badgeColor: currentLevelObj.badgeColor,
    isMaxLevel,
  };
};

export const checkAndUnlockAchievements = async (userId, userXp, stats = {}) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId });
    const userAchMap = new Map();
    userAchievements.forEach((ua) => userAchMap.set(ua.achievementCode, ua));

    const newlyUnlocked = [];

    for (const ach of achievements) {
      let ua = userAchMap.get(ach.code);
      let currentValue = 0;

      if (ach.targetMetric === 'xp') {
        currentValue = userXp || 0;
      } else if (stats[ach.targetMetric] !== undefined) {
        currentValue = stats[ach.targetMetric];
      }

      if (!ua) {
        ua = new UserAchievement({
          userId,
          achievementId: ach._id,
          achievementCode: ach.code,
          currentProgress: Math.min(ach.targetValue, currentValue),
          targetProgress: ach.targetValue,
          isUnlocked: currentValue >= ach.targetValue,
          unlockedAt: currentValue >= ach.targetValue ? new Date() : null,
        });
        await ua.save();
        if (ua.isUnlocked) {
          newlyUnlocked.push(ach);
        }
      } else if (!ua.isUnlocked) {
        ua.currentProgress = Math.min(ach.targetValue, currentValue);
        if (currentValue >= ach.targetValue) {
          ua.isUnlocked = true;
          ua.unlockedAt = new Date();
          newlyUnlocked.push(ach);
          
          // Log achievement unlocked activity
          await ActivityLog.create({
            userId,
            actionType: 'achievement_unlocked',
            description: `Unlocked achievement: ${ach.name}!`,
            asset: ach.rewardAsset || 'xp',
            amount: ach.rewardAmount || 100,
            status: 'completed',
            metadata: { achievementCode: ach.code },
          });
        }
        await ua.save();
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error evaluating achievements:', error);
    return [];
  }
};
