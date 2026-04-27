'use client';

import { useStore } from '@/lib/store';
import { getRankDetails, getXpProgress, getStreakMultiplier } from '@/lib/game-engine';
import { ACHIEVEMENTS } from '@/lib/data';
import { User, Shield, Zap, Flame, Swords, Trophy, Crown, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, gameState } = useStore();
  const rank = getRankDetails(gameState.level);
  const xpProgress = getXpProgress(gameState.totalXp);
  const { multiplier } = getStreakMultiplier(gameState.streak);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => gameState.achievements.includes(a.id));

  const stats = [
    { icon: Shield, label: 'Nível', value: gameState.level.toString(), color: rank.color },
    { icon: Zap, label: 'XP Total', value: gameState.totalXp.toLocaleString(), color: 'var(--gold)' },
    { icon: Flame, label: 'Streak', value: `${gameState.streak} dias`, color: '#f59e0b' },
    { icon: Swords, label: 'Missões', value: gameState.totalMissions.toString(), color: 'var(--accent)' },
    { icon: Calendar, label: 'Dias Ativos', value: gameState.totalDays.toString(), color: '#3b82f6' },
    { icon: Crown, label: 'Multiplicador', value: `${multiplier}x`, color: 'var(--gold)' },
    { icon: Trophy, label: 'Conquistas', value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, color: 'var(--gold)' },
    { icon: User, label: 'Plano', value: user?.plan === 'recruta' ? 'Recruta' : user?.plan === 'agente' ? 'Agente' : 'Diretor', color: user?.plan === 'diretor' ? 'var(--gold)' : 'var(--text-muted)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="glass rounded-lg p-8 text-center">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${rank.color}33, ${rank.color}11)`,
            border: `2px solid ${rank.color}`,
          }}
        >
          {user?.codeName?.[0]?.toUpperCase() || '?'}
        </div>

        <h2 className="text-2xl font-bold">{user?.codeName}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span
            className="text-sm font-mono font-bold px-3 py-1 rounded"
            style={{ color: rank.color, border: `1px solid ${rank.color}` }}
          >
            {rank.rank}
          </span>
          <span className="text-sm text-[var(--text-dim)]">— {rank.title}</span>
        </div>

        {/* XP Bar */}
        <div className="max-w-md mx-auto mt-6">
          <div className="flex justify-between text-xs text-[var(--text-dim)] mb-1">
            <span>Progresso do Nível {gameState.level}</span>
            <span>{xpProgress.current}/{xpProgress.needed} XP</span>
          </div>
          <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--xp-gradient)] transition-all duration-500"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-lg p-4 text-center">
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[var(--text-dim)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements Preview */}
      <div>
        <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-4">
          Conquistas Desbloqueadas ({unlockedAchievements.length})
        </h3>
        {unlockedAchievements.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {unlockedAchievements.map(a => (
              <div key={a.id} className="glass rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="text-lg">{a.icon}</span>
                <span className="text-sm font-medium">{a.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[var(--text-dim)]" />
            <p className="text-sm text-[var(--text-muted)]">Nenhuma conquista desbloqueada ainda.</p>
            <p className="text-xs text-[var(--text-dim)] mt-1">Complete missões e mantenha seu streak para desbloquear.</p>
          </div>
        )}
      </div>

      {/* Rank Progression */}
      <div>
        <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-4">
          Progressão de Ranks
        </h3>
        <div className="glass rounded-lg p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Recruta', levels: '1-2', color: '#6b7280' },
              { name: 'Operativo', levels: '3-5', color: '#e5e7eb' },
              { name: 'Agente', levels: '6-9', color: '#3b82f6' },
              { name: 'Especialista', levels: '10-14', color: '#22c55e' },
              { name: 'Comandante', levels: '15-19', color: '#eab308' },
              { name: 'Diretor', levels: '20-29', color: '#f59e0b' },
              { name: 'Fantasma', levels: '30-39', color: '#a855f7' },
              { name: 'Lenda', levels: '40-49', color: '#ef4444' },
              { name: 'Mito', levels: '50', color: '#dc2626' },
            ].map(r => {
              const isCurrent = rank.rank === r.name;
              return (
                <div
                  key={r.name}
                  className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                    isCurrent ? 'ring-2 ring-offset-2 ring-offset-[var(--bg)]' : 'opacity-50'
                  }`}
                  style={{
                    color: r.color,
                    border: `1px solid ${r.color}`,
                    ...(isCurrent ? { ringColor: r.color } : {}),
                  }}
                >
                  <div className="font-bold">{r.name}</div>
                  <div className="opacity-60">Nv. {r.levels}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
