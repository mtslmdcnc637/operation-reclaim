'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';
import { PRICING_PLANS } from '@/lib/data';
import {
  Shield, Swords, Target, Brain, Flame, Lock, ChevronDown,
  ArrowRight, Zap, Crown, Star, Check, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useStore();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[var(--accent)]" />
              <span className="font-bold text-lg tracking-tight">
                OPERATION <span className="text-[var(--accent)]">RECLAIM</span>
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#truth" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">A Verdade</a>
              <a href="#enemies" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Inimigos</a>
              <a href="#protocol" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Protocolo</a>
              <a href="#pricing" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Planos</a>
              <button
                onClick={() => openAuth('login')}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded hover:bg-[var(--accent-light)] transition-colors"
              >
                ACEITAR A MISSÃO
              </button>
            </div>

            {/* Mobile */}
            <button
              className="md:hidden text-[var(--text-muted)]"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden glass border-t border-[var(--border)] p-4 flex flex-col gap-3">
            <a href="#truth" className="text-sm text-[var(--text-muted)] py-2">A Verdade</a>
            <a href="#enemies" className="text-sm text-[var(--text-muted)] py-2">Inimigos</a>
            <a href="#protocol" className="text-sm text-[var(--text-muted)] py-2">Protocolo</a>
            <a href="#pricing" className="text-sm text-[var(--text-muted)] py-2">Planos</a>
            <button onClick={() => openAuth('login')} className="text-sm text-[var(--text-muted)] py-2 text-left">Entrar</button>
            <button onClick={() => openAuth('register')} className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded">ACEITAR A MISSÃO</button>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent-glow)_0%,_transparent_70%)] opacity-20" />

        <div className="relative z-10 text-center max-w-4xl stagger-children">
          <div className="inline-block px-4 py-1.5 border border-[var(--accent)] text-[var(--accent)] text-xs font-mono tracking-[0.3em] uppercase mb-8">
            Sistema Classificado — Acesso Restrito
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
            OPERATION<br />
            <span className="text-[var(--accent)]">RECLAIM</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-muted)] italic max-w-2xl mx-auto mb-8 font-light">
            &quot;Toda pessoa que encontrei tem um vício. A diferença está em quem decide lutar.&quot;
          </p>

          <TypewriterText />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={() => openAuth('register')}
              className="px-8 py-4 bg-[var(--accent)] text-white font-bold text-lg tracking-wide hover:bg-[var(--accent-light)] transition-all animate-pulse-glow rounded"
            >
              ACEITAR A MISSÃO
            </button>
            <a
              href="#truth"
              className="px-8 py-4 border border-[var(--border)] text-[var(--text-muted)] font-medium hover:border-[var(--accent)] hover:text-[var(--text)] transition-all rounded"
            >
              SAIBA MAIS
            </a>
          </div>
        </div>

        <a href="#truth" className="absolute bottom-8 animate-float">
          <ChevronDown className="w-6 h-6 text-[var(--text-dim)]" />
        </a>
      </section>

      {/* ===== A VERDADE ===== */}
      <section id="truth" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--accent)] mb-4">A Verdade</div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-8">
            Você não está no controle.<br />
            <span className="text-[var(--accent)]">Eles estão.</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] mb-8 max-w-3xl">
            A economia da atenção transformou seu comportamento em produto. Bilhões de dólares
            são investidos anualmente em engenharia de vício — variable rewards, infinite scroll,
            FOMO design, dopamina loops. O resultado:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { stat: '2h 31min/dia', label: 'Tempo médio em redes sociais' },
              { stat: '64%', label: 'Homens 18-35 com dificuldade de parar' },
              { stat: '41%', label: 'Gamers com comportamento compulsivo' },
              { stat: '73%', label: 'Recaem em menos de 30 dias sozinhos' },
            ].map((item, i) => (
              <div key={i} className="glass p-4 rounded">
                <div className="text-2xl font-bold text-[var(--accent)]">{item.stat}</div>
                <div className="text-sm text-[var(--text-muted)]">{item.label}</div>
              </div>
            ))}
          </div>

          <blockquote className="border-l-4 border-[var(--accent)] pl-6 py-4 bg-[rgba(196,30,58,0.05)] rounded-r">
            <p className="text-lg italic text-[var(--text-muted)]">
              &quot;Não é sobre força de vontade. É sobre sistema. Willpower sozinho falha.
              Precisa de identidade, ambiente, substituição e recompensa.&quot;
            </p>
            <footer className="text-sm text-[var(--text-dim)] mt-2">— Operation Reclaim</footer>
          </blockquote>
        </div>
      </section>

      {/* ===== OS TRÊS INIMIGOS ===== */}
      <section id="enemies" className="py-24 px-4 bg-[rgba(0,0,0,0.3)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Identifique o Inimigo</div>
            <h2 className="text-3xl sm:text-5xl font-bold">Os Três Inimigos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📱',
                title: 'Redes Sociais',
                stats: '2h 31min/dia roubados',
                desc: 'Infinite scroll, FOMO, dopamina barata. O ladrão invisível do tempo e da atenção.',
                color: '#3b82f6',
              },
              {
                icon: '🔞',
                title: 'Pornografia',
                stats: '64% não conseguem parar',
                desc: 'Destrói dopamina real, conexões genuínas e autoestima. O inimigo silencioso.',
                color: '#ef4444',
              },
              {
                icon: '🎮',
                title: 'Jogos',
                stats: '41% reconhecem compulsão',
                desc: 'Conquistas virtuais que substituem as reais. O escapismo perfeito da vida real.',
                color: '#8b5cf6',
              },
            ].map((enemy, i) => (
              <div
                key={i}
                className="glass p-6 rounded-lg hover:border-t-2 hover:-translate-y-1 transition-all duration-300 group"
                style={{ '--hover-color': enemy.color } as React.CSSProperties}
              >
                <div className="text-4xl mb-4">{enemy.icon}</div>
                <h3 className="text-xl font-bold mb-2">{enemy.title}</h3>
                <p className="text-sm text-[var(--accent)] font-mono mb-3">{enemy.stats}</p>
                <p className="text-sm text-[var(--text-muted)]">{enemy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== O PROTOCOLO ===== */}
      <section id="protocol" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--gold)] mb-4">
              Baseado em Hábitos Atômicos — James Clear
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold">O Protocolo</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { step: '01', title: 'Identidade', desc: 'Não perguntamos "o que parar?" mas "quem você quer ser?"', icon: Brain },
              { step: '02', title: 'Ambiente', desc: 'Remova gatilhos. Redesenhe seu espaço. Controle o que te controla.', icon: Target },
              { step: '03', title: 'Substituição', desc: 'Troque o vício por algo melhor. 2 minutos de ação real.', icon: ArrowRight },
              { step: '04', title: 'Gamificação', desc: 'XP, ranks, conquistas. Cada vitória conta. Cada dia importa.', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="glass p-6 rounded-lg text-center">
                <div className="text-xs font-mono text-[var(--accent)] mb-3">{item.step}</div>
                <item.icon className="w-8 h-8 mx-auto mb-4 text-[var(--gold)]" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Level badges */}
          <div className="text-center">
            <p className="text-sm text-[var(--text-muted)] mb-6">Evolução de Nível 1 a 50</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Recruta', 'Operativo', 'Agente', 'Especialista', 'Comandante', 'Diretor', 'Fantasma', 'Lenda', 'Mito'].map((rank, i) => (
                <span
                  key={rank}
                  className="px-3 py-1 text-xs font-mono border rounded"
                  style={{
                    borderColor: ['#6b7280', '#e5e7eb', '#3b82f6', '#22c55e', '#eab308', '#f59e0b', '#a855f7', '#ef4444', '#dc2626'][i],
                    color: ['#6b7280', '#e5e7eb', '#3b82f6', '#22c55e', '#eab308', '#f59e0b', '#a855f7', '#ef4444', '#dc2626'][i],
                  }}
                >
                  {rank}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-4 bg-[rgba(0,0,0,0.3)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Escolha seu Rank</div>
            <h2 className="text-3xl sm:text-5xl font-bold">Planos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass p-8 rounded-lg relative ${plan.popular ? 'border-[var(--accent)] border-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--accent)] text-white text-xs font-mono tracking-wider rounded">
                    MAIS POPULAR
                  </div>
                )}
                <div className="text-xs font-mono text-[var(--text-dim)] mb-1">{plan.rank}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">Grátis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">R${plan.price}</span>
                      <span className="text-[var(--text-muted)]">/mês</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[var(--green)] mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--text-muted)]">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openAuth('register')}
                  className={`w-full py-3 rounded font-semibold text-sm transition-colors ${
                    plan.popular
                      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)]'
                      : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
                  }`}
                >
                  {plan.price === 0 ? 'COMEÇAR GRÁTIS' : 'ASSINAR'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent-glow)_0%,_transparent_60%)] opacity-10" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black mb-6">
            A hora é <span className="text-[var(--accent)]">agora</span>.
          </h2>
          <p className="text-lg text-[var(--text-muted)] mb-10">
            Cada dia que passa sem ação é um dia a mais de rendição. O inimigo não espera.
            Você deveria?
          </p>
          <button
            onClick={() => openAuth('register')}
            className="px-10 py-5 bg-[var(--accent)] text-white font-bold text-xl tracking-wide hover:bg-[var(--accent-light)] transition-all animate-pulse-glow rounded"
          >
            ACEITAR A MISSÃO
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-mono">OPERATION RECLAIM</span>
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            © 2026 Operation Reclaim. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  );
}

// ==================== TYPEWRITER ====================

function TypewriterText() {
  const text = "Eles projetaram cada pixel, cada notificação, cada scroll infinito para manter você preso. Mas existe uma saída. Não é força de vontade — é um sistema. Identidade. Ambiente. Substituição. Gamificação. Cada dia de resistência é uma batalha ganha. Cada hábito construído é uma arma desbloqueada. Cada vício é um boss a ser derrotado. A guerra é real. E você pode vencê-la.";
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <p className="text-sm sm:text-base text-[var(--text-muted)] font-mono leading-relaxed text-left min-h-[120px]">
        {displayed}
        {!done && <span className="inline-block w-0.5 h-4 bg-[var(--accent)] ml-0.5 animate-pulse" />}
      </p>
    </div>
  );
}
