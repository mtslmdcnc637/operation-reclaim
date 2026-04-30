'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FUNIL_PROFILE_RESULTS, PACT_COMMITMENTS, PRICING_PLANS } from '@/lib/data';
import { Check, ArrowRight, Shield } from 'lucide-react';

export default function ResultadoPage() {
  const router = useRouter();
  const [funilData, setFunilData] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Record<string, number>>({});
  const [acceptedPacts, setAcceptedPacts] = useState<Set<number>>(new Set());
  const [showPricing, setShowPricing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('or.funil');
      if (stored) {
        const data = JSON.parse(stored);
        setFunilData(data);
        if (data.attributes) setAttributes(data.attributes);
      }
    } catch {}
  }, []);

  const primaryAddiction = funilData.primaryAddiction || 'socialMedia';
  const hoursPerDay = funilData.hoursPerDay || '1-2';
  const profileKey = `${primaryAddiction}-${hoursPerDay}`;
  const profile = FUNIL_PROFILE_RESULTS[profileKey] || FUNIL_PROFILE_RESULTS['socialMedia-1-2'];

  const addictionLabels: Record<string, string> = {
    socialMedia: 'Redes Sociais',
    pornography: 'Pornografia',
    games: 'Jogos',
  };

  const addictionIcons: Record<string, string> = {
    socialMedia: '📱',
    pornography: '🔞',
    games: '🎮',
  };

  const hoursMap: Record<string, number> = { '1-2': 1.5, '3-4': 3.5, '5+': 6 };
  const weeklyHours = (hoursMap[hoursPerDay] || 1.5) * 7;
  const monthlyHours = weeklyHours * 4;

  const avgAttribute = attributes
    ? Object.values(attributes).reduce((a, b) => a + b, 0) / Math.max(Object.values(attributes).length, 1)
    : 5;

  const togglePact = (index: number) => {
    setAcceptedPacts(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allPactsAccepted = acceptedPacts.size === PACT_COMMITMENTS.length;

  const handlePlanSelect = (planId: string) => {
    // Store selected plan
    const updated = { ...funilData, selectedPlan: planId };
    localStorage.setItem('or.funil', JSON.stringify(updated));
    // Show auth modal or redirect to register
    setShowAuth(true);
  };

  return (
    <div className="result-screen funil-enter">
      {/* Badge */}
      <div className="result-badge">PERFIL DE AMEAÇA CALCULADO</div>

      {/* Profile icon */}
      <div className="result-profile-icon">{addictionIcons[primaryAddiction]}</div>

      {/* Profile title */}
      <h1 className="result-title">{profile?.title || 'Operador'}</h1>

      {/* Severity badge */}
      <div className={`result-severity ${profile?.severity || 'low'}`}>
        {profile?.severity === 'critical' ? 'AMEAÇA CRÍTICA' :
         profile?.severity === 'high' ? 'AMEAÇA ALTA' :
         profile?.severity === 'medium' ? 'AMEAÇA MÉDIA' : 'AMEAÇA BAIXA'}
      </div>

      {/* Description */}
      <p className="result-desc">{profile?.desc}</p>

      {/* Stats */}
      <div className="result-stats">
        <div className="result-stat">
          <div className="result-stat-value">{addictionLabels[primaryAddiction]}</div>
          <div className="result-stat-label">Inimigo Principal</div>
        </div>
        <div className="result-stat">
          <div className="result-stat-value">{weeklyHours.toFixed(0)}h</div>
          <div className="result-stat-label">Horas/semana perdidas</div>
        </div>
        <div className="result-stat">
          <div className="result-stat-value">{monthlyHours.toFixed(0)}h</div>
          <div className="result-stat-label">Horas/mês perdidas</div>
        </div>
        <div className="result-stat">
          <div className="result-stat-value">{avgAttribute.toFixed(1)}/10</div>
          <div className="result-stat-label">Índice de Força</div>
        </div>
      </div>

      {/* PACTO */}
      <div className="pact-screen">
        <h2 className="pact-title">O Pacto do Agente</h2>
        {PACT_COMMITMENTS.map((commitment, i) => (
          <div
            key={i}
            className={`pact-item ${acceptedPacts.has(i) ? 'accepted' : ''}`}
            onClick={() => togglePact(i)}
          >
            <div className="pact-checkbox">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: acceptedPacts.has(i) ? 'var(--bg)' : 'transparent' }} />
            </div>
            <div className="pact-text">{commitment}</div>
          </div>
        ))}
      </div>

      {/* Show pricing after pact */}
      {allPactsAccepted && !showPricing && (
        <button
          className="cta-primary visible"
          onClick={() => setShowPricing(true)}
          style={{ marginBottom: '2rem' }}
        >
          ACEITAR A MISSÃO →
        </button>
      )}

      {/* Pricing */}
      {showPricing && (
        <div style={{ width: '100%', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="quiz-tag">ESCOLHA SEU RANK</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Planos de Batalha</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PRICING_PLANS.map(plan => (
              <div
                key={plan.id}
                style={{
                  padding: '1.25rem',
                  background: plan.popular ? 'rgba(196,30,58,0.08)' : 'rgba(18,18,26,0.6)',
                  border: `1px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '0.875rem',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    padding: '0.25rem 0.75rem', background: 'var(--accent)', color: '#fff',
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                    borderRadius: '0.5rem', textTransform: 'uppercase',
                  }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{plan.rank}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{plan.name}</div>
                  </div>
                  <div>
                    {plan.price === 0 ? (
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Grátis</span>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>R${plan.price}</span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>/mês</span>
                      </>
                    )}
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                  {plan.features.slice(0, 3).map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <Check style={{ width: 14, height: 14, color: 'var(--green)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 600,
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                    background: plan.popular ? 'linear-gradient(180deg, var(--accent-light), var(--accent))' : 'none',
                    color: plan.popular ? '#fff' : 'var(--text-muted)',
                    border: plan.popular ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {plan.price === 0 ? 'COMEÇAR GRÁTIS' : 'ASSINAR'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auth Modal (simplified) */}
      {showAuth && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
               onClick={() => setShowAuth(false)} />
          <div className="glass" style={{ position: 'relative', width: '100%', maxWidth: 400, animation: 'fadeInScale 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Shield style={{ width: 40, height: 40, margin: '0 auto 1rem', color: 'var(--accent)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aceitar a Missão</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                Crie seu perfil e comece a luta.
              </p>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              // Redirect to register with funil data
              window.location.href = '/dashboard';
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Nome de Código
                </label>
                <input
                  className="quiz-input"
                  type="text"
                  defaultValue={funilData.name || ''}
                  style={{ fontSize: '0.95rem' }}
                  placeholder="Seu nome de código..."
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  className="quiz-input"
                  type="email"
                  style={{ fontSize: '0.95rem' }}
                  placeholder="seu@email.com"
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Senha
                </label>
                <input
                  className="quiz-input"
                  type="password"
                  style={{ fontSize: '0.95rem' }}
                  placeholder="••••••"
                />
              </div>
              <button type="submit" className="cta-primary visible">
                CRIAR CONTA E COMEÇAR →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
