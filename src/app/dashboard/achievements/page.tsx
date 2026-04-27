'use client';

import { useStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/data';
import { Trophy, Lock } from 'lucide-react';

export default function AchievementsPage() {
  const { gameState } = useStore();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return { border: 'border-gray-500/30', text: 'text-gray-400', bg: 'bg-gray-500/10' };
      case 'uncommon': return { border: 'border-green-500/30', text: 'text-green-400', bg: 'bg-green-500/10' };
      case 'rare': return { border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'epic': return { border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/10' };
      default: return { border: 'border-gray-500/30', text: 'text-gray-400', bg: 'bg-gray-500/10' };
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'uncommon': return 'Incomum';
      case 'rare': return 'Rara';
      case 'epic': return 'Épica';
      default: return rarity;
    }
  };

  const unlockedCount = ACHIEVEMENTS.filter(a => gameState.achievements.includes(a.id)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[var(--gold)]" />
            Conquistas
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Marcos da sua jornada. Cada conquista é uma prova de evolução.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[var(--gold)]">{unlockedCount}/{ACHIEVEMENTS.length}</div>
          <div className="text-xs text-[var(--text-dim)]">desbloqueadas</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map(achievement => {
          const unlocked = gameState.achievements.includes(achievement.id);
          const rarityStyle = getRarityColor(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`glass rounded-lg p-5 transition-all ${
                unlocked
                  ? `border ${rarityStyle.border}`
                  : 'opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${unlocked ? '' : 'opacity-30'}`}>
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{achievement.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border}`}>
                      {getRarityLabel(achievement.rarity)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{achievement.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-mono text-[var(--gold)]">+{achievement.xp} XP</span>
                    {!unlocked && (
                      <span className="text-xs text-[var(--text-dim)]">{achievement.condition}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
