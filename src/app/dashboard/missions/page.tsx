'use client';

import { useStore } from '@/lib/store';
import { Swords, CheckCircle2, Flame, Zap } from 'lucide-react';

export default function MissionsPage() {
  const { dailyMissions, completeMission, gameState } = useStore();

  const completedCount = dailyMissions.filter(m => m.completed).length;
  const allDone = completedCount === dailyMissions.length && dailyMissions.length > 0;

  const handleComplete = (missionId: string) => {
    completeMission(missionId);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' };
      case 'medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'hard': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return diff;
    }
  };

  const getAddictionLabel = (addiction: string) => {
    switch (addiction) {
      case 'socialMedia': return '📱 Redes Sociais';
      case 'pornography': return '🔞 Pornografia';
      case 'games': return '🎮 Jogos';
      default: return addiction;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="w-6 h-6 text-[var(--accent)]" />
            Missões do Dia
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Complete missões para ganhar XP e causar dano nos inimigos.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[var(--accent)]">{completedCount}/{dailyMissions.length}</div>
          <div className="text-xs text-[var(--text-dim)]">completas</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-lg p-4">
        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
            style={{ width: `${dailyMissions.length > 0 ? (completedCount / dailyMissions.length) * 100 : 0}%` }}
          />
        </div>
        {allDone && (
          <div className="mt-3 text-center">
            <span className="text-sm text-[var(--gold)] font-mono">
              ✨ Todas as missões completas! +150 XP bônus
            </span>
          </div>
        )}
      </div>

      {/* Mission Cards */}
      <div className="space-y-4">
        {dailyMissions.map((mission, i) => {
          const diffStyle = getDifficultyColor(mission.difficulty);
          return (
            <div
              key={mission.id}
              className={`glass rounded-lg p-5 transition-all ${
                mission.completed ? 'opacity-60' : 'hover:border-[var(--border-hover)]'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => !mission.completed && handleComplete(mission.id)}
                  disabled={mission.completed}
                  className={`mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    mission.completed
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-[var(--border)] hover:border-[var(--accent)] cursor-pointer'
                  }`}
                >
                  {mission.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : null}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-semibold ${mission.completed ? 'line-through text-[var(--text-dim)]' : ''}`}>
                        {mission.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{mission.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-xs font-mono text-[var(--gold)] flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{mission.xp} XP
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${diffStyle.bg} ${diffStyle.text} border ${diffStyle.border}`}>
                      {getDifficultyLabel(mission.difficulty)}
                    </span>
                    <span className="text-xs text-[var(--text-dim)]">
                      {getAddictionLabel(mission.addiction)}
                    </span>
                    <span className="text-xs text-[var(--text-dim)] flex items-center gap-1">
                      <Flame className="w-3 h-3" /> -{mission.damage}% poder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dailyMissions.length === 0 && (
        <div className="text-center py-16">
          <Swords className="w-12 h-12 mx-auto mb-4 text-[var(--text-dim)]" />
          <p className="text-[var(--text-muted)]">Nenhuma missão atribuída hoje.</p>
          <p className="text-sm text-[var(--text-dim)] mt-1">Faça check-in para gerar missões.</p>
        </div>
      )}
    </div>
  );
}
