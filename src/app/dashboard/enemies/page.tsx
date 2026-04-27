'use client';

import { useStore } from '@/lib/store';
import { getAddictionState } from '@/lib/game-engine';
import { Target, Swords, Flame } from 'lucide-react';

export default function EnemiesPage() {
  const { addictions, attackEnemy, gameState } = useStore();

  const handleAttack = (addictionId: string) => {
    attackEnemy(addictionId);
  };

  const canAttack = (addictionId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return !gameState.attackCooldowns[addictionId]?.startsWith(today);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-[var(--accent)]" />
          Os Inimigos
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Cada vício é um boss. Reduza o poder dele até derrotá-lo.
        </p>
      </div>

      {/* Boss Cards */}
      <div className="space-y-6">
        {addictions.map(addiction => {
          const state = getAddictionState(addiction.power);
          const attackable = canAttack(addiction.id) && addiction.power > 0;

          return (
            <div key={addiction.id} className="glass rounded-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{addiction.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{addiction.name}</h3>
                      <span className="text-xs font-mono" style={{ color: state.color }}>
                        {state.state}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono" style={{ color: state.color }}>
                      {addiction.power}%
                    </div>
                    <div className="text-xs text-[var(--text-dim)]">PODER</div>
                  </div>
                </div>

                {/* HP Bar */}
                <div className="h-4 bg-[var(--border)] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full hp-bar-fill relative"
                    style={{
                      width: `${addiction.power}%`,
                      background: `linear-gradient(90deg, ${state.color}88, ${state.color})`,
                    }}
                  >
                    {addiction.power > 10 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          HP {addiction.power}/100
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--text-muted)]">{addiction.description}</p>
              </div>

              {/* Attack Section */}
              <div className="border-t border-[var(--border)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[var(--text-dim)]">
                  <span className="flex items-center gap-1">
                    <Swords className="w-3 h-3" /> Ataque: -2% poder
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" /> +30 XP
                  </span>
                </div>

                <button
                  onClick={() => handleAttack(addiction.id)}
                  disabled={!attackable}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all ${
                    attackable
                      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)]'
                      : 'bg-[var(--border)] text-[var(--text-dim)] cursor-not-allowed'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  {addiction.power <= 0
                    ? 'DERROTADO'
                    : !canAttack(addiction.id)
                    ? 'ATACADO HOJE'
                    : 'ATACAR'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="glass rounded-lg p-5 border-l-4 border-[var(--gold)]">
        <h4 className="text-sm font-mono text-[var(--gold)] uppercase tracking-wider mb-2">Mecânica de Dano</h4>
        <ul className="text-sm text-[var(--text-muted)] space-y-1">
          <li>• Check-in diário: −1% em cada inimigo</li>
          <li>• Missão concluída: −2% a −6% no inimigo vinculado</li>
          <li>• Ataque manual: −2% (1x/dia por inimigo)</li>
          <li>• Recaída: +10% ao poder do inimigo afetado</li>
        </ul>
      </div>
    </div>
  );
}
