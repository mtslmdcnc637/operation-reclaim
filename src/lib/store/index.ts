import { create } from 'zustand';
import { GameState, Addiction, DailyMission, Notification, AddictionType, PlanTier } from '@/types';
import { ADDICTIONS } from '@/lib/data';
import {
  generateDailyMissions,
  calculateStreak,
  addXp,
  checkAchievements,
  calculateDailyCheckinDamage,
  calculateAttackDamage,
  getLevelFromXp,
} from '@/lib/game-engine';

interface AppStore {
  // Auth
  isAuthenticated: boolean;
  user: { email: string; codeName: string; plan: PlanTier } | null;

  // Game State
  gameState: GameState;
  addictions: Addiction[];
  dailyMissions: DailyMission[];

  // UI
  notifications: Notification[];
  showLevelUp: boolean;
  levelUpData: { level: number; rank: string } | null;
  currentScreen: string;

  // Actions
  login: (email: string, codeName: string, plan?: PlanTier) => void;
  logout: () => void;
  checkin: () => { xpGained: number; leveledUp: boolean };
  completeMission: (missionId: string) => { xpGained: number; leveledUp: boolean; allDone: boolean };
  attackEnemy: (addictionId: string) => { xpGained: number; leveledUp: boolean };
  useEmergency: () => void;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  dismissLevelUp: () => void;
  setScreen: (screen: string) => void;
  regenerateMissions: () => void;
  updatePlan: (plan: PlanTier) => void;
}

const INITIAL_GAME_STATE: GameState = {
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  lastCheckin: null,
  totalDays: 0,
  totalMissions: 0,
  primaryAddiction: 'socialMedia',
  achievements: [],
  completedMissionIds: [],
  dailyMissionIds: [],
  lastMissionDate: null,
  attackCooldowns: {},
  emergencyUsedToday: false,
};

function loadState(): { gameState: GameState; user: AppStore['user'] } {
  if (typeof window === 'undefined') return { gameState: INITIAL_GAME_STATE, user: null };

  try {
    const current = localStorage.getItem('or_current');
    if (!current) return { gameState: INITIAL_GAME_STATE, user: null };

    const userData = localStorage.getItem(`or_user_${current}`);
    if (!userData) return { gameState: INITIAL_GAME_STATE, user: null };

    const parsed = JSON.parse(userData);
    return {
      gameState: { ...INITIAL_GAME_STATE, ...parsed.gameState },
      user: { email: parsed.email, codeName: parsed.codeName, plan: parsed.plan || 'recruta' },
    };
  } catch {
    return { gameState: INITIAL_GAME_STATE, user: null };
  }
}

function saveState(user: AppStore['user'], gameState: GameState) {
  if (typeof window === 'undefined' || !user) return;
  localStorage.setItem(`or_user_${user.email}`, JSON.stringify({
    email: user.email,
    codeName: user.codeName,
    plan: user.plan,
    gameState,
  }));
  localStorage.setItem('or_current', user.email);
}

export const useStore = create<AppStore>((set, get) => {
  const loaded = loadState();

  return {
    isAuthenticated: !!loaded.user,
    user: loaded.user,
    gameState: loaded.gameState,
    addictions: ADDICTIONS.map(a => ({ ...a, power: 100 })),
    dailyMissions: [],
    notifications: [],
    showLevelUp: false,
    levelUpData: null,
    currentScreen: 'home',

    login: (email, codeName, plan = 'recruta') => {
      const existing = localStorage.getItem(`or_user_${email}`);
      let gameState = INITIAL_GAME_STATE;

      if (existing) {
        const parsed = JSON.parse(existing);
        gameState = { ...INITIAL_GAME_STATE, ...parsed.gameState };
      }

      const user = { email, codeName, plan };
      localStorage.setItem('or_current', email);
      if (!existing) {
        saveState(user, gameState);
      }

      const missions = generateDailyMissions(gameState.primaryAddiction, plan);

      set({
        isAuthenticated: true,
        user,
        gameState,
        dailyMissions: missions.map(m => ({ ...m, completed: gameState.completedMissionIds.includes(m.id) })),
        addictions: ADDICTIONS.map(a => ({ ...a, power: 100 })),
      });
    },

    logout: () => {
      localStorage.removeItem('or_current');
      set({
        isAuthenticated: false,
        user: null,
        gameState: INITIAL_GAME_STATE,
        dailyMissions: [],
        addictions: ADDICTIONS.map(a => ({ ...a, power: 100 })),
      });
    },

    checkin: () => {
      const { gameState, user, addictions } = get();
      const today = new Date().toISOString().split('T')[0];

      if (gameState.lastCheckin?.startsWith(today)) {
        get().addNotification('error', 'Check-in já realizado hoje.');
        return { xpGained: 0, leveledUp: false };
      }

      const newStreak = calculateStreak(gameState.lastCheckin, gameState.streak);
      const result = addXp(gameState, 50);

      // Damage all addictions
      const damage = calculateDailyCheckinDamage();
      const newAddictions = addictions.map(a => ({
        ...a,
        power: Math.max(0, a.power - damage),
      }));

      const newState: GameState = {
        ...gameState,
        level: result.levelAfter,
        xp: result.totalXp - (result.totalXp - result.xpGained),
        totalXp: result.totalXp,
        streak: newStreak,
        lastCheckin: new Date().toISOString(),
        totalDays: gameState.totalDays + 1,
      };

      // Check achievements
      const newAchievements = checkAchievements(newState);
      newState.achievements = [...newState.achievements, ...newAchievements];

      saveState(user, newState);
      set({ gameState: newState, addictions: newAddictions });

      get().addNotification('xp', `+${result.xpGained} XP — Check-in diário`);

      if (result.leveledUp) {
        set({
          showLevelUp: true,
          levelUpData: { level: result.levelAfter, rank: result.rankAfter },
        });
      }

      return { xpGained: result.xpGained, leveledUp: result.leveledUp };
    },

    completeMission: (missionId) => {
      const { gameState, user, dailyMissions, addictions } = get();
      const mission = dailyMissions.find(m => m.id === missionId);
      if (!mission || mission.completed) return { xpGained: 0, leveledUp: false, allDone: false };

      const result = addXp(gameState, mission.xp);

      // Damage the linked addiction
      const newAddictions = addictions.map(a =>
        a.id === mission.addiction
          ? { ...a, power: Math.max(0, a.power - mission.damage) }
          : a
      );

      const newCompletedIds = [...gameState.completedMissionIds, missionId];
      const allDone = newCompletedIds.length >= dailyMissions.length;

      let bonusXp = 0;
      if (allDone) {
        const bonusResult = addXp({ ...gameState, totalXp: result.totalXp }, 150);
        bonusXp = bonusResult.xpGained;
        result.totalXp = bonusResult.totalXp;
        result.levelAfter = bonusResult.levelAfter;
        result.leveledUp = result.leveledUp || bonusResult.leveledUp;
        result.rankAfter = bonusResult.rankAfter;
      }

      const newState: GameState = {
        ...gameState,
        level: result.levelAfter,
        totalXp: result.totalXp,
        totalMissions: gameState.totalMissions + 1,
        completedMissionIds: newCompletedIds,
        lastMissionDate: new Date().toISOString().split('T')[0],
      };

      const newAchievements = checkAchievements(newState);
      newState.achievements = [...newState.achievements, ...newAchievements];

      const newMissions = dailyMissions.map(m =>
        m.id === missionId ? { ...m, completed: true } : m
      );

      saveState(user, newState);
      set({ gameState: newState, dailyMissions: newMissions, addictions: newAddictions });

      get().addNotification('xp', `+${result.xpGained} XP — ${mission.title}`);
      if (allDone) {
        get().addNotification('xp', `+${bonusXp} XP — Bônus: todas as missões completas!`);
      }

      if (result.leveledUp) {
        set({
          showLevelUp: true,
          levelUpData: { level: result.levelAfter, rank: result.rankAfter },
        });
      }

      return { xpGained: result.xpGained, leveledUp: result.leveledUp, allDone };
    },

    attackEnemy: (addictionId) => {
      const { gameState, user, addictions } = get();
      const today = new Date().toISOString().split('T')[0];

      if (gameState.attackCooldowns[addictionId]?.startsWith(today)) {
        get().addNotification('error', 'Ataque já realizado hoje neste inimigo.');
        return { xpGained: 0, leveledUp: false };
      }

      const damage = calculateAttackDamage();
      const result = addXp(gameState, 30);

      const newAddictions = addictions.map(a =>
        a.id === addictionId
          ? { ...a, power: Math.max(0, a.power - damage) }
          : a
      );

      const newState: GameState = {
        ...gameState,
        level: result.levelAfter,
        totalXp: result.totalXp,
        attackCooldowns: {
          ...gameState.attackCooldowns,
          [addictionId]: new Date().toISOString(),
        },
      };

      const newAchievements = checkAchievements(newState);
      newState.achievements = [...newState.achievements, ...newAchievements];

      saveState(user, newState);
      set({ gameState: newState, addictions: newAddictions });

      get().addNotification('xp', `+${result.xpGained} XP — Ataque direto`);

      if (result.leveledUp) {
        set({
          showLevelUp: true,
          levelUpData: { level: result.levelAfter, rank: result.rankAfter },
        });
      }

      return { xpGained: result.xpGained, leveledUp: result.leveledUp };
    },

    useEmergency: () => {
      const { gameState, user } = get();
      const today = new Date().toISOString().split('T')[0];

      if (gameState.emergencyUsedToday) {
        get().addNotification('error', 'Modo emergência já usado hoje.');
        return;
      }

      const result = addXp(gameState, 100);
      const newState: GameState = {
        ...gameState,
        level: result.levelAfter,
        totalXp: result.totalXp,
        emergencyUsedToday: true,
      };

      saveState(user, newState);
      set({ gameState: newState });
      get().addNotification('xp', `+${result.xpGained} XP — Modo Emergência completado`);
    },

    addNotification: (type, message) => {
      const id = Date.now().toString();
      set(state => ({
        notifications: [...state.notifications, { id, type, message }],
      }));
      setTimeout(() => get().removeNotification(id), 4000);
    },

    removeNotification: (id) => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }));
    },

    dismissLevelUp: () => set({ showLevelUp: false, levelUpData: null }),

    setScreen: (screen) => set({ currentScreen: screen }),

    regenerateMissions: () => {
      const { gameState, user } = get();
      const missions = generateDailyMissions(gameState.primaryAddiction, user?.plan || 'recruta', gameState.completedMissionIds);
      set({ dailyMissions: missions.map(m => ({ ...m, completed: false })) });
    },

    updatePlan: (plan) => {
      const { user, gameState } = get();
      if (!user) return;
      const newUser = { ...user, plan };
      saveState(newUser, gameState);
      set({ user: newUser });
    },
  };
});
