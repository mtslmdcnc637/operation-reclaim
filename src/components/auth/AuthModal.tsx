'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: () => void;
}

export function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [codeName, setCodeName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (mode === 'register' && !codeName.trim()) {
      errs.codeName = 'Nome de código é obrigatório';
    } else if (mode === 'register' && (codeName.length < 2 || codeName.length > 30)) {
      errs.codeName = 'Entre 2 e 30 caracteres';
    }

    if (!email.trim()) {
      errs.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Email inválido';
    }

    if (!password) {
      errs.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errs.password = 'Mínimo 6 caracteres';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Simulate auth delay
    await new Promise(r => setTimeout(r, 800));

    if (mode === 'register') {
      // Check if user exists
      const existing = localStorage.getItem(`or_user_${email}`);
      if (existing) {
        setErrors({ email: 'Este email já está registrado' });
        setLoading(false);
        return;
      }

      // Create user
      const userData = {
        email,
        codeName,
        plan: 'recruta' as const,
        gameState: {
          level: 1, xp: 0, totalXp: 0, streak: 0, lastCheckin: null,
          totalDays: 0, totalMissions: 0, primaryAddiction: 'socialMedia' as const,
          achievements: [], completedMissionIds: [], dailyMissionIds: [],
          lastMissionDate: null, attackCooldowns: {}, emergencyUsedToday: false,
        },
      };
      localStorage.setItem(`or_user_${email}`, JSON.stringify(userData));
    } else {
      // Login check
      const existing = localStorage.getItem(`or_user_${email}`);
      if (!existing) {
        setErrors({ email: 'Conta não encontrada' });
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(existing);
      // In a real app, we'd verify password with Supabase
    }

    login(email, codeName || email.split('@')[0]);
    setLoading(false);
    onClose();
    window.location.href = '/dashboard';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass rounded-lg w-full max-w-md p-8 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <Shield className="w-10 h-10 mx-auto mb-4 text-[var(--accent)]" />
          <h2 className="text-2xl font-bold">
            {mode === 'register' ? 'Aceitar a Missão' : 'Entrar no Sistema'}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            {mode === 'register'
              ? 'Crie seu perfil e comece a luta.'
              : 'Acesse sua conta para continuar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                Nome de Código
              </label>
              <input
                type="text"
                value={codeName}
                onChange={e => setCodeName(e.target.value)}
                placeholder="Ex: Fantasma7"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              {errors.codeName && <p className="text-xs text-[var(--accent)] mt-1">{errors.codeName}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            {errors.email && <p className="text-xs text-[var(--accent)] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[var(--accent)] mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSANDO...' : mode === 'register' ? 'CRIAR CONTA' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchMode}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            {mode === 'register'
              ? 'Já tem conta? Faça login'
              : 'Não tem conta? Aceite a missão'}
          </button>
        </div>
      </div>
    </div>
  );
}
