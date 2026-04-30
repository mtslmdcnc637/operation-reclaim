'use client';

import { useState, useEffect } from 'react';
import { Shield, Volume2 } from 'lucide-react';

export default function HomePage() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const supabase = (await import('@/lib/supabase/client')).createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.href = '/dashboard';
        }
      } catch {}
    };
    checkAuth();
  }, []);

  const startMission = () => {
    setEntered(true);
    setTimeout(() => {
      window.location.href = '/funil/validacao';
    }, 400);
  };

  return (
    <div className={`home-screen ${entered ? 'home-exit' : ''}`}>
      {/* Ambient glow */}
      <div className="home-glow" />

      {/* Logo */}
      <div className="home-logo">
        <Shield className="home-logo-icon" />
      </div>

      {/* Title */}
      <h1 className="home-title">
        OPERATION<br />
        <span className="home-title-accent">RECLAIM</span>
      </h1>

      {/* Subtitle */}
      <p className="home-subtitle">
        Sistema de Combate a Vícios Digitais
      </p>

      {/* CTA */}
      <button className="home-cta" onClick={startMission}>
        ACEITAR A MISSÃO
      </button>

      {/* Volume note */}
      <div className="home-volume-note">
        <Volume2 className="home-volume-icon" />
        <span>Para uma melhor experiência, aumente o volume</span>
      </div>

      {/* Version */}
      <div className="home-version">v1.0.0</div>

      {/* Login link */}
      <a href="/sobre" className="home-about">
        Saiba mais
      </a>
    </div>
  );
}
