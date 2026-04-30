'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FUNIL_ATTRIBUTES } from '@/lib/data';

export default function AtributosPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>({});
  const [funilData, setFunilData] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('or.funil');
      if (stored) {
        const data = JSON.parse(stored);
        setFunilData(data);
        // Load previously saved attributes if any
        if (data.attributes) setValues(data.attributes);
      }
    } catch {}
  }, []);

  // Initialize default values
  useEffect(() => {
    const defaults: Record<string, number> = {};
    FUNIL_ATTRIBUTES.forEach(attr => {
      defaults[attr.id] = values[attr.id] ?? 5;
    });
    setValues(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSliderChange = (id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const getStatusLabel = (value: number): string => {
    if (value <= 2) return 'Crítico';
    if (value <= 4) return 'Insatisfeito';
    if (value <= 6) return 'Neutro';
    if (value <= 8) return 'Bom';
    return 'Forte';
  };

  const getStatusColor = (value: number): string => {
    if (value <= 2) return '#ef4444';
    if (value <= 4) return '#f97316';
    if (value <= 6) return '#eab308';
    if (value <= 8) return '#22c55e';
    return '#00E38C';
  };

  const handleContinue = () => {
    // Save attributes to localStorage
    const updated = { ...funilData, attributes: values };
    localStorage.setItem('or.funil', JSON.stringify(updated));
    router.push('/funil/resultado');
  };

  return (
    <div className="quiz-container funil-enter">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="quiz-tag">MAPEAMENTO DE ATRIBUTOS</div>
        <h1 className="quiz-question" style={{ fontSize: '1.5rem' }}>
          Como você se avalia, Agente?
        </h1>
        <p className="quiz-hint" style={{ marginBottom: 0 }}>
          Seja honesto. Cada número é uma arma que o sistema vai usar pra te ajudar.
        </p>
      </div>

      {/* Attributes */}
      <div className="attr-grid">
        {FUNIL_ATTRIBUTES.map(attr => {
          const val = values[attr.id] ?? 5;
          const hue = (val / 10) * 140;
          return (
            <div className="attr-item" key={attr.id}>
              <div className="attr-header">
                <span className="attr-icon">{attr.icon}</span>
                <div>
                  <div className="attr-label">{attr.label}</div>
                  <div className="attr-desc">{attr.desc}</div>
                </div>
              </div>
              <div className="attr-slider-wrap">
                <input
                  type="range"
                  className="attr-slider"
                  min={1}
                  max={10}
                  value={val}
                  onChange={e => handleSliderChange(attr.id, parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(90deg, hsl(${hue}, 80%, 58%) ${(val / 10) * 100}%, var(--border) ${(val / 10) * 100}%)`,
                  }}
                />
                <span className="attr-value" style={{ color: `hsl(${hue}, 80%, 58%)` }}>
                  {val}
                </span>
              </div>
              <div className="attr-status" style={{ color: getStatusColor(val) }}>
                {getStatusLabel(val)}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        className="cta-primary visible"
        onClick={handleContinue}
        style={{ maxWidth: 480, margin: '2rem auto 0' }}
      >
        VER RESULTADO →
      </button>
    </div>
  );
}
