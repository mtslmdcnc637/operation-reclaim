'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { getRankDetails, getXpProgress } from '@/lib/game-engine';
import {
  Shield, Home, Swords, Target, Trophy, User, Flame,
  LogOut, Menu, X, AlertTriangle
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Painel Central', icon: Home, href: '/dashboard' },
  { id: 'missions', label: 'Missões', icon: Swords, href: '/dashboard/missions' },
  { id: 'enemies', label: 'Inimigos', icon: Target, href: '/dashboard/enemies' },
  { id: 'achievements', label: 'Conquistas', icon: Trophy, href: '/dashboard/achievements' },
  { id: 'profile', label: 'Perfil', icon: User, href: '/dashboard/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, gameState, logout, notifications, showLevelUp, levelUpData, dismissLevelUp, currentScreen, setScreen, loadState } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadState();
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      // Give Supabase time to restore session
      const timer = setTimeout(() => {
        if (!isAuthenticated) window.location.href = '/';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-dim)]">Carregando...</div>
      </div>
    );
  }

  const rank = getRankDetails(gameState.level);
  const xpProgress = getXpProgress(gameState.totalXp);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--bg)] h-screen sticky top-0" style={{ padding: 0 }}>
        <div className="border-b border-[var(--border)]" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--accent)]" />
            <span className="font-bold text-sm tracking-tight">
              OPERATION <span className="text-[var(--accent)]">RECLAIM</span>
            </span>
          </div>
          <div className="text-xs font-mono text-[var(--text-dim)] mb-1">
            {user?.codeName}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded"
              style={{ color: rank.color, border: `1px solid ${rank.color}` }}
            >
              {rank.rank}
            </span>
            <span className="text-xs text-[var(--text-dim)]">Nv. {gameState.level}</span>
          </div>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-[var(--text-dim)] mb-1">
              <span>XP</span>
              <span>{xpProgress.current}/{xpProgress.needed}</span>
            </div>
            <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--xp-gradient)] transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="mt-3 flex items-center gap-2">
            <Flame className={`w-4 h-4 ${gameState.streak >= 7 ? 'text-orange-500 animate-fire' : 'text-[var(--text-dim)]'}`} />
            <span className="text-sm font-mono">
              {gameState.streak} {gameState.streak === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1" style={{ padding: '1rem' }}>
          {NAV_ITEMS.map(item => {
            const isActive = currentScreen === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setScreen(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-l-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Emergency Button */}
        <div className="border-t border-[var(--border)]" style={{ padding: '1rem' }}>
          {gameState.level >= 3 && (
            <a
              href="/dashboard?emergency=true"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600/20 border border-red-600/50 text-red-400 rounded text-sm font-semibold hover:bg-red-600/30 transition-colors mb-3 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              MODO EMERGÊNCIA
            </a>
          )}
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg)] border-r border-[var(--border)] p-6 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-[var(--text-dim)]">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
              <span className="font-bold text-sm">OPERATION <span className="text-[var(--accent)]">RECLAIM</span></span>
            </div>

            <div className="mb-6">
              <div className="text-xs font-mono text-[var(--text-dim)] mb-1">{user?.codeName}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ color: rank.color, border: `1px solid ${rank.color}` }}>
                  {rank.rank}
                </span>
                <span className="text-xs text-[var(--text-dim)]">Nv. {gameState.level}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Flame className={`w-4 h-4 ${gameState.streak >= 7 ? 'text-orange-500' : 'text-[var(--text-dim)]'}`} />
                <span className="text-sm font-mono">{gameState.streak} dias</span>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => { setScreen(item.id); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm ${
                    currentScreen === item.id
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <button onClick={() => { logout(); window.location.href = '/'; }} className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-[var(--bg)]/80 backdrop-blur-sm z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[var(--text-muted)]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold">
              {NAV_ITEMS.find(n => n.id === currentScreen)?.label || 'Painel Central'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-dim)] font-mono hidden sm:block">{user?.codeName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '1.5rem' }}>
          {children}
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-[200] space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`animate-slide-in-right glass px-4 py-3 rounded-lg shadow-lg max-w-sm border-l-4 ${
              n.type === 'success' ? 'border-green-500' :
              n.type === 'error' ? 'border-red-500' :
              'border-[var(--gold)]'
            }`}
          >
            <p className="text-sm font-medium">{n.message}</p>
          </div>
        ))}
      </div>

      {/* Level Up Modal */}
      {showLevelUp && levelUpData && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/90" onClick={dismissLevelUp} />
          <div className="relative text-center animate-scale-in">
            <div className="text-6xl sm:text-8xl font-black text-[var(--gold)] mb-4" style={{ textShadow: '0 0 40px rgba(212,168,83,0.5)' }}>
              LEVEL UP
            </div>
            <div className="text-4xl sm:text-6xl font-bold mb-2">Nível {levelUpData.level}</div>
            <div
              className="text-xl sm:text-2xl font-mono uppercase tracking-wider mb-8"
              style={{ color: getRankDetails(levelUpData.level).color }}
            >
              {levelUpData.rank}
            </div>
            <button
              onClick={dismissLevelUp}
              className="px-8 py-3 bg-[var(--gold)] text-black font-bold rounded hover:brightness-110 transition-all"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
