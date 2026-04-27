'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: () => void;
}

export function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [codeName, setCodeName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (mode === 'register' && !codeName.trim()) errs.codeName = 'Nome de código é obrigatório';
    else if (mode === 'register' && (codeName.length < 2 || codeName.length > 30)) errs.codeName = 'Entre 2 e 30 caracteres';
    if (!email.trim()) errs.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido';
    if (!password) errs.password = 'Senha é obrigatória';
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { code_name: codeName } },
        });
        if (error) {
          setErrors({ email: error.message });
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrors({ email: error.message });
          setLoading(false);
          return;
        }
      }

      onClose();
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrors({ email: err.message || 'Erro inesperado' });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center" style={{ padding: '1rem' }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass w-full max-w-md animate-scale-in" style={{ padding: '2rem' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text)]">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <Shield className="w-10 h-10 mx-auto text-[var(--accent)]" style={{ marginBottom: '1rem' }} />
          <h2 className="text-2xl font-bold">
            {mode === 'register' ? 'Aceitar a Missão' : 'Entrar no Sistema'}
          </h2>
          <p className="text-sm text-[var(--text-muted)]" style={{ marginTop: '0.5rem' }}>
            {mode === 'register' ? 'Crie seu perfil e comece a luta.' : 'Acesse sua conta para continuar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider" style={{ marginBottom: '0.5rem' }}>
                Nome de Código
              </label>
              <input
                type="text"
                value={codeName}
                onChange={e => setCodeName(e.target.value)}
                placeholder="Ex: Fantasma7"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
              />
              {errors.codeName && <p className="text-xs text-[var(--accent)]" style={{ marginTop: '0.25rem' }}>{errors.codeName}</p>}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider" style={{ marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
            />
            {errors.email && <p className="text-xs text-[var(--accent)]" style={{ marginTop: '0.25rem' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider" style={{ marginBottom: '0.5rem' }}>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                style={{ transform: 'translateY(-50%)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[var(--accent)]" style={{ marginTop: '0.25rem' }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSANDO...' : mode === 'register' ? 'CRIAR CONTA' : 'ENTRAR'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem' }}>
          <button onClick={onSwitchMode} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
            {mode === 'register' ? 'Já tem conta? Faça login' : 'Não tem conta? Aceite a missão'}
          </button>
        </div>
      </div>
    </div>
  );
}
