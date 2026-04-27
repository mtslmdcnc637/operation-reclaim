import { GameState, XpResult, AddictionType, DailyMission, Difficulty, Addiction } from '@/types';
import { RANKS, STREAK_MULTIPLIERS, MISSION_POOL, ACHIEVEMENTS, ADDICTIONS } from '@/lib/data';

// ==================== XP & LEVEL ====================

export function getXpForLevel(level: number): number {
  return level * 100;
}

export function getTotalXpForLevel(targetLevel: number): number {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + getXpForLevel(level) <= totalXp) {
    accumulated += getXpForLevel(level);
    level++;
  }
  return level;
}

export function getXpProgress(totalXp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXp(totalXp);
  const xpForPreviousLevels = getTotalXpForLevel(level);
  const current = totalXp - xpForPreviousLevels;
  const needed = getXpForLevel(level);
  return { current, needed, percentage: (current / needed) * 100 };
}

// ==================== RANKS ====================

export function getRankForLevel(level: number): string {
  const rank = RANKS.find(r => level >= r.minLevel && level <= r.maxLevel);
  return rank?.rank || 'Recruta';
}

export function getRankDetails(level: number) {
  return RANKS.find(r => level >= r.minLevel && level <= r.maxLevel) || RANKS[0];
}

// ==================== MULTIPLIER ====================

export function getStreakMultiplier(streak: number): { multiplier: number; label: number } {
  const tier = STREAK_MULTIPLIERS.find(t => streak >= t.minDays && streak <= t.maxDays);
  return { multiplier: tier?.multiplier || 1.0, label: tier?.multiplier || 1.0 };
}

// ==================== DAMAGE ====================

export function calculateDailyCheckinDamage(): number {
  return 1;
}

export function calculateMissionDamage(difficulty: Difficulty): number {
  const map: Record<Difficulty, number> = { easy: 2, medium: 3, hard: 5 };
  return map[difficulty];
}

export function calculateAttackDamage(): number {
  return 2;
}

export function calculateStreakBonus(streak: number): number {
  if (streak >= 30) return 10;
  if (streak >= 7) return 5;
  return 0;
}

// ==================== MISSION GENERATION ====================

export function generateDailyMissions(
  primaryAddiction: AddictionType,
  plan: 'recruta' | 'agente' | 'diretor',
  recentMissionIds: string[] = []
): DailyMission[] {
  const count = plan === 'diretor' ? 5 : plan === 'agente' ? 5 : 3;

  // Filter available missions (not recently used)
  const available = MISSION_POOL.filter(m => !recentMissionIds.includes(m.id));

  // Ensure at least 1 for primary addiction
  const primaryMissions = available.filter(m => m.addiction === primaryAddiction);
  const otherMissions = available.filter(m => m.addiction !== primaryAddiction);

  // Ensure difficulty variety
  const easy = available.filter(m => m.difficulty === 'easy');
  const medium = available.filter(m => m.difficulty === 'medium');
  const hard = available.filter(m => m.difficulty === 'hard');

  const selected: DailyMission[] = [];
  const usedIds = new Set<string>();

  // Pick 1 from each difficulty if possible
  const pickRandom = (pool: DailyMission[] | typeof MISSION_POOL): DailyMission | null => {
    const filtered = pool.filter(m => !usedIds.has(m.id));
    if (filtered.length === 0) return null;
    const picked = filtered[Math.floor(Math.random() * filtered.length)];
    return { ...picked, completed: false };
  };

  // 1 easy
  const e = pickRandom(easy);
  if (e) { selected.push(e); usedIds.add(e.id); }

  // 1 medium
  const m = pickRandom(medium);
  if (m) { selected.push(m); usedIds.add(m.id); }

  // 1 hard
  const h = pickRandom(hard);
  if (h) { selected.push(h); usedIds.add(h.id); }

  // Fill remaining with primary addiction priority
  const remaining = count - selected.length;
  for (let i = 0; i < remaining; i++) {
    const primaryPool = primaryMissions.filter(m => !usedIds.has(m.id));
    if (primaryPool.length > 0) {
      const picked = primaryPool[Math.floor(Math.random() * primaryPool.length)];
      selected.push({ ...picked, completed: false });
      usedIds.add(picked.id);
    } else {
      const any = pickRandom(available);
      if (any && !usedIds.has(any.id)) {
        selected.push(any);
        usedIds.add(any.id);
      }
    }
  }

  return selected.slice(0, count);
}

// ==================== ACHIEVEMENTS CHECK ====================

export function checkAchievements(state: GameState): string[] {
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (state.achievements.includes(achievement.id)) continue;

    let unlocked = false;
    switch (achievement.id) {
      case 'A01': unlocked = state.totalDays >= 1; break;
      case 'A02': unlocked = state.totalMissions >= 1; break;
      case 'A03': unlocked = state.streak >= 7; break;
      case 'A04': unlocked = state.streak >= 30; break;
      case 'A05': unlocked = state.level >= 5; break;
      case 'A06': unlocked = state.level >= 10; break;
      case 'A07': unlocked = state.level >= 20; break;
      case 'A08': unlocked = state.totalMissions >= 10; break;
      case 'A09': unlocked = state.totalMissions >= 50; break;
      case 'A12': unlocked = state.completedMissionIds.length >= 3; break;
    }

    if (unlocked) newAchievements.push(achievement.id);
  }

  return newAchievements;
}

// ==================== ADDICTION POWER STATE ====================

export function getAddictionState(power: number): { state: string; color: string } {
  if (power <= 0) return { state: 'Derrotado', color: '#22c55e' };
  if (power <= 33) return { state: 'Quase derrotado', color: '#22c55e' };
  if (power <= 66) return { state: 'Enfraquecido', color: '#eab308' };
  return { state: 'Ameaçador', color: '#ef4444' };
}

// ==================== STREAK ====================

export function calculateStreak(lastCheckin: string | null, currentStreak: number): number {
  if (!lastCheckin) return 1;

  const last = new Date(lastCheckin);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return currentStreak + 1; // consecutive day
  if (diffDays === 2) return currentStreak + 1; // 48h tolerance
  return 1; // streak broken
}

// ==================== ADD XP ====================

export function addXp(state: GameState, baseXp: number): XpResult {
  const { multiplier } = getStreakMultiplier(state.streak);
  const xpGained = Math.round(baseXp * multiplier);
  const totalXp = state.totalXp + xpGained;
  const levelBefore = state.level;
  const levelAfter = getLevelFromXp(totalXp);
  const rankBefore = getRankForLevel(levelBefore);
  const rankAfter = getRankForLevel(levelAfter);

  return {
    xpGained,
    totalXp,
    levelBefore,
    levelAfter,
    rankBefore,
    rankAfter,
    leveledUp: levelAfter > levelBefore,
  };
}
