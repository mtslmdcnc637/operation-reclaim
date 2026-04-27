'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { getRankDetails, getXpProgress, getAddictionState } from '@/lib/game-engine';
import { DAILY_QUOTES, ADDICTIONS } from '@/lib/data';
import { Flame, Zap, Swords, Trophy, Shield, Clock } from 'lucide-react';

export default function DashboardHome() {
  const { gameState, checkin, addictions, dailyMissions, user } = useStore();
  const [checkedToday, setCheckedToday] = useState(false);
  const [quote, setQuote] = useState(DAILY_QUOTES[0]);

  useEffect(() => {
    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    if (gameState.lastCheckin?.startsWith(today)) {
      setCheckedToday(true);
    }

    // Pick daily quote
    const dayIndex = new Date().getDate() % DAILY_QUOTES.length;
    setQuote(DAILY_QUOTES[dayIndex]);
  }, [gameState.lastCheckin]);

  const handleCheckin = () => {
    if (checkedToday) return;
    const result = checkin();
    if (result.xpGained > 0) {
      setCheckedToday(true);
    }
  };

  const rank = getRankDetails(gameState.level);
  const xpProgress = getXpProgress(gameState.totalXp);
  const completedToday = dailyMissions.filter(m => m.completed).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8" style={{ padding: '0 0.5rem' }}>
      {/* Daily Quote */}
      <div className="glass rounded-lg p-6 border-l-4 border-[var(--accent)]">
        <p className="text-base sm:text-lg italic text-[var(--text-muted)]">&quot;{quote.text}&quot;</p>
        <p className="text-xs text-[var(--text-dim)] mt-2 font-mono">— {quote.author}</p>
      </div>

      {/* Check-in Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCheckin}
          disabled={checkedToday}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all ${
            checkedToday
              ? 'bg-[var(--border)] text-[var(--text-dim)] cursor-not-allowed'
              : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] animate-pulse-glow'
          }`}
        >
          <Clock className="w-5 h-5" />
          {checkedToday ? '✓ Check-in já realizado' : 'CHECK-IN DIÁRIO'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Shield className="w-5 h-5" />}
          label="Nível"
          value={gameState.level.toString()}
          sub={rank.rank}
          color={rank.color}
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="XP Total"
          value={gameState.totalXp.toLocaleString()}
          sub={`${Math.round(xpProgress.percentage)}% para nv. ${gameState.level + 1}`}
          color="var(--gold)"
        />
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          label="Sequência"
          value={`${gameState.streak} dias`}
          sub={gameState.streak >= 7 ? '🔥 Em chamas!' : 'Mantenha o ritmo'}
          color={gameState.streak >= 7 ? '#f59e0b' : 'var(--text-muted)'}
        />
        <StatCard
          icon={<Swords className="w-5 h-5" />}
          label="Missões Hoje"
          value={`${completedToday}/${dailyMissions.length}`}
          sub={completedToday === dailyMissions.length && dailyMissions.length > 0 ? '✨ Todas completas!' : 'Continue lutando'}
          color="var(--accent)"
        />
      </div>

      {/* Boss Status */}
      <div>
        <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-4">Status dos Inimigos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {addictions.map(addiction => {
            const state = getAddictionState(addiction.power);
            return (
              <a
                key={addiction.id}
                href="/dashboard/enemies"
                className="glass rounded-lg p-5 hover:border-[var(--border-hover)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{addiction.icon}</span>
                    <span className="font-semibold text-sm">{addiction.name}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: state.color }}>
                    {state.state}
                  </span>
                </div>
                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full hp-bar-fill"
                    style={{
                      width: `${addiction.power}%`,
                      background: state.color,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[var(--text-dim)]">HP</span>
                  <span className="text-xs font-mono" style={{ color: state.color }}>
                    {addiction.power}%
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Quick Missions Preview */}
      {dailyMissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider">Missões de Hoje</h3>
            <a href="/dashboard/missions" className="text-xs text-[var(--accent)] hover:underline">Ver todas →</a>
          </div>
          <div className="space-y-2">
            {dailyMissions.slice(0, 3).map(mission => (
              <div
                key={mission.id}
                className={`glass rounded-lg p-4 flex items-center gap-4 ${mission.completed ? 'opacity-50' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  mission.completed ? 'border-green-500 bg-green-500/20' : 'border-[var(--border)]'
                }`}>
                  {mission.completed && <span className="text-green-500 text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${mission.completed ? 'line-through text-[var(--text-dim)]' : ''}`}>
                    {mission.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[var(--gold)] font-mono">+{mission.xp} XP</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      mission.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      mission.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {mission.difficulty === 'easy' ? 'Fácil' : mission.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-mono text-[var(--text-dim)] uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-[var(--text-dim)] mt-1">{sub}</div>
    </div>
  );
}
