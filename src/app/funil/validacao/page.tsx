'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { COMANDANTE_SPEECH_INITIAL, COMANDANTE_SPEECH_AFTER_QUIZ } from '@/lib/data';

type SpeechPhase = 'initial' | 'afterQuiz';

export default function ValidacaoPage() {
  return (
    <Suspense fallback={<div className="funil-page"><div className="orb-container"><div className="orb-core" /></div></div>}>
      <ValidacaoContent />
    </Suspense>
  );
}

function ValidacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase: SpeechPhase = (searchParams.get('phase') as SpeechPhase) || 'initial';
  const speech = phase === 'afterQuiz' ? COMANDANTE_SPEECH_AFTER_QUIZ : COMANDANTE_SPEECH_INITIAL;

  const [isSpeaking, setIsSpeaking] = useState(true);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [paragraphStates, setParagraphStates] = useState<string[]>(
    speech.map((_, i) => (i === 0 ? 'typing' : 'pending'))
  );
  const [showCta, setShowCta] = useState(false);
  const [funilData, setFunilData] = useState<Record<string, string>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef(0);

  // Load funil data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('or.funil');
      if (stored) setFunilData(JSON.parse(stored));
    } catch {}
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (currentParagraph >= speech.length) {
      setIsSpeaking(false);
      setShowCta(true);
      return;
    }

    const text = speech[currentParagraph];
    charIndexRef.current = 0;
    setDisplayedText('');

    intervalRef.current = setInterval(() => {
      charIndexRef.current++;
      setDisplayedText(text.slice(0, charIndexRef.current));

      if (charIndexRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Mark current as done, next as typing
        setParagraphStates(prev => {
          const next = [...prev];
          next[currentParagraph] = 'done';
          if (currentParagraph + 1 < speech.length) {
            next[currentParagraph + 1] = 'typing';
          }
          return next;
        });
        // Move to next paragraph after a pause
        setTimeout(() => {
          setCurrentParagraph(prev => prev + 1);
        }, 600);
      }
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentParagraph, speech]);

  const skipSpeech = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setParagraphStates(speech.map(() => 'done'));
    setCurrentParagraph(speech.length);
    setIsSpeaking(false);
    setShowCta(true);
  }, [speech]);

  const handleCta = () => {
    if (phase === 'initial') {
      router.push('/funil/quiz');
    } else {
      router.push('/funil/atributos');
    }
  };

  // HUD data
  const agentName = funilData.name || '—';
  const addictionLabel = funilData.primaryAddiction === 'socialMedia'
    ? 'Redes Sociais' : funilData.primaryAddiction === 'pornography'
    ? 'Pornografia' : funilData.primaryAddiction === 'games'
    ? 'Jogos' : '—';
  const hoursPerDay = funilData.hoursPerDay || '—';

  const agePhase = (age: string) => {
    const a = parseInt(age);
    if (isNaN(a)) return '—';
    if (a < 18) return 'ADOLESCENTE';
    if (a < 25) return 'JOVEM';
    if (a < 35) return 'ADULTO';
    if (a < 50) return 'VETERANO';
    return 'EXPERIENTE';
  };

  return (
    <div className="funil-page funil-enter">
      {/* Chrome buttons */}
      <div className="funil-chrome">
        <button onClick={skipSpeech}>PULAR FALA</button>
      </div>

      {/* Orb */}
      <div className={`orb-container ${isSpeaking ? 'speaking' : ''}`}>
        <div className="orb-halo" />
        <div className="orb-ring-2" />
        <div className="orb-ring" />
        <div className="orb-core" />
        {/* Particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="orb-particle"
            style={{
              '--angle': `${(i / 14) * 360}deg`,
              '--distance': `${50 + Math.random() * 30}px`,
              '--duration': `${6 + Math.random() * 3}s`,
              '--delay': `${(i * 0.55)}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* HUD */}
      <div className="funil-hud">
        <div className="hud-cell">
          <div className="hud-label">Agente</div>
          <div className="hud-value accent">{agentName}</div>
        </div>
        <div className="hud-cell">
          <div className="hud-label">Inimigo</div>
          <div className="hud-value cyan">{phase === 'afterQuiz' ? addictionLabel : '—'}</div>
        </div>
        <div className="hud-cell">
          <div className="hud-label">Fase</div>
          <div className="hud-value success">
            {phase === 'afterQuiz' && funilData.age ? agePhase(funilData.age) : '—'}
          </div>
        </div>
      </div>

      {/* Transcript Card */}
      <div className="transcript-card">
        <div className="transcript-header">
          <div className="transcript-logo">🛡️</div>
          <div>
            <div className="transcript-name">Comandante</div>
            <div className="transcript-status">
              {isSpeaking ? (
                <>
                  <span className="status-dot" />
                  Falando
                </>
              ) : (
                'Concluído'
              )}
            </div>
          </div>
        </div>

        <div className="transcript-body">
          {speech.map((paragraph, i) => (
            <p
              key={i}
              className={`transcript-paragraph ${paragraphStates[i] || 'pending'}`}
            >
              {i === currentParagraph && paragraphStates[i] === 'typing'
                ? displayedText
                : paragraph}
              {i === currentParagraph && paragraphStates[i] === 'typing' && (
                <span className="typing-cursor" />
              )}
            </p>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
        <button
          className={`cta-primary ${showCta ? 'visible' : 'hidden'}`}
          onClick={handleCta}
        >
          {phase === 'initial' ? 'INICIAR INVESTIGAÇÃO' : 'MAPEAR ATRIBUTOS'} →
        </button>
      </div>
    </div>
  );
}
