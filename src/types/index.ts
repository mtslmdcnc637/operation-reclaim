// ==================== USER & AUTH ====================

export type PlanTier = 'recruta' | 'agente' | 'diretor';

export interface UserProfile {
  id: string;
  email: string;
  codeName: string;
  plan: PlanTier;
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// ==================== GAME STATE ====================

export interface GameState {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  lastCheckin: string | null;
  totalDays: number;
  totalMissions: number;
  primaryAddiction: AddictionType;
  achievements: string[]; // unlocked achievement IDs
  completedMissionIds: string[]; // today's completed missions
  dailyMissionIds: string[]; // today's assigned missions
  lastMissionDate: string | null;
  attackCooldowns: Record<string, string>; // addictionId -> last attack date
  emergencyUsedToday: boolean;
}

export type AddictionType = 'socialMedia' | 'pornography' | 'games';

// ==================== ADDICTIONS (BOSSES) ====================

export interface Addiction {
  id: AddictionType;
  name: string;
  icon: string;
  description: string;
  power: number; // 0-100, boss HP
  color: string;
}

// ==================== MISSIONS ====================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  addiction: AddictionType;
  damage: number;
}

export interface DailyMission extends Mission {
  completed: boolean;
}

// ==================== ACHIEVEMENTS ====================

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  xp: number;
  rarity: Rarity;
  icon: string;
}

// ==================== RANKS ====================

export interface Rank {
  minLevel: number;
  maxLevel: number;
  rank: string;
  title: string;
  color: string;
}

// ==================== XP & LEVEL ====================

export interface XpResult {
  xpGained: number;
  totalXp: number;
  levelBefore: number;
  levelAfter: number;
  rankBefore: string;
  rankAfter: string;
  leveledUp: boolean;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType = 'success' | 'error' | 'xp';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// ==================== PRICING ====================

export interface PricingPlan {
  id: PlanTier;
  name: string;
  rank: string;
  price: number;
  currency: string;
  interval: 'month';
  features: string[];
  missionsPerDay: number | 'unlimited';
  popular?: boolean;
  stripePriceId?: string;
}
