import { create } from 'zustand';
import { GameState, Addiction, DailyMission, Notification, AddictionType, PlanTier } from '@/types';
import { ADDICTIONS } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import {
  generateDailyMissions,
  getLevelFromXp,
  getRankForLevel,
  getStreakMultiplier,
  checkAchievements,
} from '@/lib/game-engine';

interface AppStore {
  isAuthenticated: boolean;
  user: { id: string; email: string; codeName: string; plan: PlanTier } | null;
  gameState: GameState;
  addictions: Addiction[];
  dailyMissions: DailyMission[];
  notifications: Notification[];
  showLevelUp: boolean;
  levelUpData: { level: number; rank: string } | null;
  currentScreen: string;

  login: (id: string, email: string, codeName: string, plan?: PlanTier, gs?: Partial<GameState>, adds?: Addiction[]) => void;
  logout: () => void;
  checkin: () => Promise<{ xpGained: number; leveledUp: boolean }>;
  completeMission: (missionId: string) => Promise<{ xpGained: number; leveledUp: boolean; allDone: boolean }>;
  attackEnemy: (addictionId: string) => Promise<{ xpGained: number; leveledUp: boolean }>;
  useEmergency: () => Promise<void>;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  dismissLevelUp: () => void;
  setScreen: (screen: string) => void;
  loadState: () => Promise<void>;
}

const INITIAL_GAME_STATE: GameState = {
  level: 1, xp: 0, totalXp: 0, streak: 0, lastCheckin: null,
  totalDays: 0, totalMissions: 0, primaryAddiction: 'socialMedia',
  achievements: [], completedMissionIds: [], dailyMissionIds: [],
  lastMissionDate: null, attackCooldowns: {}, emergencyUsedToday: false,
};

export const useStore = create<AppStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  gameState: INITIAL_GAME_STATE,
  addictions: ADDICTIONS.map(a => ({ ...a, power: 100 })),
  dailyMissions: [],
  notifications: [],
  showLevelUp: false,
  levelUpData: null,
  currentScreen: 'home',

  login: (id, email, codeName, plan = 'recruta', gs, adds) => {
    const gameState = { ...INITIAL_GAME_STATE, ...gs };
    const addictions = adds && adds.length > 0
      ? adds
      : ADDICTIONS.map(a => ({ ...a, power: 100 }));
    const missions = generateDailyMissions(gameState.primaryAddiction, plan);

    set({
      isAuthenticated: true,
      user: { id, email, codeName, plan },
      gameState,
      addictions,
      dailyMissions: missions.map(m => ({ ...m, completed: gameState.completedMissionIds.includes(m.id) })),
    });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      user: null,
      gameState: INITIAL_GAME_STATE,
      dailyMissions: [],
      addictions: ADDICTIONS.map(a => ({ ...a, power: 100 })),
    });
  },

  loadState: async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch('/api/game/state');
      if (!res.ok) {
        // User exists in auth but not in profiles table — might be first login
        // Try to create profile via the register endpoint or just use auth data
        const codeName = user.user_metadata?.code_name || user.email?.split('@')[0] || 'Agente';
        get().login(user.id, user.email || '', codeName);
        return;
      }

      const data = await res.json();
      const gs: GameState = {
        level: data.gameState?.level || 1,
        xp: data.gameState?.xp || 0,
        totalXp: data.gameState?.total_xp || 0,
        streak: data.gameState?.streak || 0,
        lastCheckin: data.gameState?.last_checkin || null,
        totalDays: data.gameState?.total_days || 0,
        totalMissions: data.gameState?.total_missions || 0,
        primaryAddiction: data.gameState?.primary_addiction || 'socialMedia',
        achievements: data.gameState?.achievements || [],
        completedMissionIds: data.gameState?.completed_mission_ids || [],
        dailyMissionIds: data.gameState?.daily_mission_ids || [],
        lastMissionDate: data.gameState?.last_mission_date || null,
        attackCooldowns: data.gameState?.attack_cooldowns || {},
        emergencyUsedToday: data.gameState?.emergency_used_today || false,
      };

      const adds: Addiction[] = (data.addictions || []).map((a: any) => ({
        id: a.addiction_type,
        name: ADDICTIONS.find(ad => ad.id === a.addiction_type)?.name || a.addiction_type,
        icon: ADDICTIONS.find(ad => ad.id === a.addiction_type)?.icon || '❓',
        description: ADDICTIONS.find(ad => ad.id === a.addiction_type)?.description || '',
        power: a.power,
        color: ADDICTIONS.find(ad => ad.id === a.addiction_type)?.color || '#fff',
      }));

      const codeName = data.profile?.code_name || user.user_metadata?.code_name || user.email?.split('@')[0] || 'Agente';
      const plan = data.profile?.plan || 'recruta';

      get().login(user.id, user.email || '', codeName, plan, gs, adds);
    } catch (err) {
      console.error('loadState error:', err);
    }
  },

  checkin: async () => {
    try {
      const res = await fetch('/api/game/checkin', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        get().addNotification('error', data.error || 'Erro no check-in');
        return { xpGained: 0, leveledUp: false };
      }

      const { gameState } = get();
      const newGs: GameState = {
        ...gameState,
        level: data.level,
        totalXp: data.totalXp,
        streak: data.streak,
        lastCheckin: new Date().toISOString(),
        totalDays: gameState.totalDays + 1,
      };
      newGs.achievements = [...gameState.achievements, ...checkAchievements(newGs)];

      set({ gameState: newGs });
      get().addNotification('xp', `+${data.xpGained} XP — Check-in diário`);

      const rank = getRankForLevel(data.level);
      if (data.level > gameState.level) {
        set({ showLevelUp: true, levelUpData: { level: data.level, rank } });
      }

      return { xpGained: data.xpGained, leveledUp: data.level > gameState.level };
    } catch (err) {
      get().addNotification('error', 'Erro de conexão');
      return { xpGained: 0, leveledUp: false };
    }
  },

  completeMission: async (missionId) => {
    try {
      const { dailyMissions } = get();
      const mission = dailyMissions.find(m => m.id === missionId);
      if (!mission || mission.completed) return { xpGained: 0, leveledUp: false, allDone: false };

      const res = await fetch('/api/game/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId,
          missionXp: mission.xp,
          missionDamage: mission.damage,
          addictionType: mission.addiction,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        get().addNotification('error', data.error || 'Erro na missão');
        return { xpGained: 0, leveledUp: false, allDone: false };
      }

      const { gameState, addictions } = get();
      const newCompletedIds = [...gameState.completedMissionIds, missionId];
      const newMissions = dailyMissions.map(m => m.id === missionId ? { ...m, completed: true } : m);
      const newAddictions = addictions.map(a =>
        a.id === mission.addiction ? { ...a, power: Math.max(0, a.power - mission.damage) } : a
      );

      const newGs: GameState = {
        ...gameState,
        level: data.level,
        totalXp: data.totalXp,
        totalMissions: gameState.totalMissions + 1,
        completedMissionIds: newCompletedIds,
        lastMissionDate: new Date().toISOString().split('T')[0],
      };
      newGs.achievements = [...gameState.achievements, ...checkAchievements(newGs)];

      set({ gameState: newGs, dailyMissions: newMissions, addictions: newAddictions });
      get().addNotification('xp', `+${data.xpGained} XP — ${mission.title}`);

      if (data.allDone) {
        get().addNotification('xp', `+${data.bonusXp || 150} XP — Bônus: todas as missões!`);
      }

      const rank = getRankForLevel(data.level);
      if (data.level > gameState.level) {
        set({ showLevelUp: true, levelUpData: { level: data.level, rank } });
      }

      return { xpGained: data.xpGained, leveledUp: data.level > gameState.level, allDone: data.allDone };
    } catch (err) {
      get().addNotification('error', 'Erro de conexão');
      return { xpGained: 0, leveledUp: false, allDone: false };
    }
  },

  attackEnemy: async (addictionId) => {
    try {
      const res = await fetch('/api/game/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addictionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        get().addNotification('error', data.error || 'Erro no ataque');
        return { xpGained: 0, leveledUp: false };
      }

      const { gameState, addictions } = get();
      const newGs: GameState = {
        ...gameState,
        level: data.level,
        totalXp: data.totalXp,
        attackCooldowns: { ...gameState.attackCooldowns, [addictionId]: new Date().toISOString() },
      };
      newGs.achievements = [...gameState.achievements, ...checkAchievements(newGs)];

      const newAddictions = addictions.map(a =>
        a.id === addictionId ? { ...a, power: Math.max(0, a.power - 2) } : a
      );

      set({ gameState: newGs, addictions: newAddictions });
      get().addNotification('xp', `+${data.xpGained} XP — Ataque direto`);

      const rank = getRankForLevel(data.level);
      if (data.level > gameState.level) {
        set({ showLevelUp: true, levelUpData: { level: data.level, rank } });
      }

      return { xpGained: data.xpGained, leveledUp: data.level > gameState.level };
    } catch (err) {
      get().addNotification('error', 'Erro de conexão');
      return { xpGained: 0, leveledUp: false };
    }
  },

  useEmergency: async () => {
    try {
      const { gameState } = get();
      if (gameState.emergencyUsedToday) {
        get().addNotification('error', 'Modo emergência já usado hoje.');
        return;
      }

      const res = await fetch('/api/game/checkin', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        get().addNotification('error', data.error || 'Erro');
        return;
      }

      const newGs = { ...gameState, emergencyUsedToday: true };
      set({ gameState: newGs });
      get().addNotification('xp', `+100 XP — Modo Emergência completado`);
    } catch (err) {
      get().addNotification('error', 'Erro de conexão');
    }
  },

  addNotification: (type, message) => {
    const id = Date.now().toString();
    set(state => ({ notifications: [...state.notifications, { id, type, message }] }));
    setTimeout(() => get().removeNotification(id), 4000);
  },

  removeNotification: (id) => {
    set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
  },

  dismissLevelUp: () => set({ showLevelUp: false, levelUpData: null }),

  setScreen: (screen) => set({ currentScreen: screen }),
}));
