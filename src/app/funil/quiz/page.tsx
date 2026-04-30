'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FUNIL_QUIZ_STEPS } from '@/lib/data';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepperValue, setStepperValue] = useState(25);

  const step = FUNIL_QUIZ_STEPS[currentStep];
  const totalSteps = FUNIL_QUIZ_STEPS.length;

  // Load existing data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('or.funil');
      if (stored) setAnswers(JSON.parse(stored));
    } catch {}
  }, []);

  // Save to localStorage on answer change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('or.funil', JSON.stringify(answers));
    }
  }, [answers]);

  const isNextDisabled = () => {
    const val = answers[step.id];
    if (step.type === 'text') return !val || val.length < (step.minLength || 2);
    if (step.type === 'stepper') return false;
    if (step.type === 'choice') return !val;
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      // Set stepper default for next step if applicable
      const nextStep = FUNIL_QUIZ_STEPS[currentStep + 1];
      if (nextStep?.type === 'stepper' && nextStep.defaultValue) {
        setStepperValue(nextStep.defaultValue);
      }
    } else {
      // Final step — go to validation with afterQuiz phase
      router.push('/funil/validacao?phase=afterQuiz');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChoiceSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: optionId }));
    // Auto-advance after 300ms
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        const nextStep = FUNIL_QUIZ_STEPS[currentStep + 1];
        if (nextStep?.type === 'stepper' && nextStep.defaultValue) {
          setStepperValue(nextStep.defaultValue);
        }
      } else {
        router.push('/funil/validacao?phase=afterQuiz');
      }
    }, 300);
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="quiz-container funil-enter">
      {/* Progress bar */}
      <div className="quiz-progress">
        <span className="quiz-progress-label">Cadastro</span>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="quiz-progress-count">
          {String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </span>
      </div>

      {/* Step content */}
      <div className="quiz-tag">{step.tag}</div>
      <h1 className="quiz-question">{step.question}</h1>
      <p className="quiz-hint">{step.hint}</p>

      {/* Text input */}
      {step.type === 'text' && (
        <input
          className="quiz-input"
          type="text"
          placeholder={step.placeholder || 'Digite aqui...'}
          value={answers[step.id] || ''}
          onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
          maxLength={step.maxLength || 24}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter' && !isNextDisabled()) handleNext(); }}
        />
      )}

      {/* Stepper */}
      {step.type === 'stepper' && (
        <div>
          <div className="quiz-stepper">
            <button
              className="stepper-btn"
              onClick={() => {
                const newVal = Math.max(step.min || 0, stepperValue - 1);
                setStepperValue(newVal);
                setAnswers(prev => ({ ...prev, [step.id]: String(newVal) }));
              }}
            >
              −
            </button>
            <div>
              <span className="stepper-value">{stepperValue}</span>
              <span className="stepper-unit">{step.unit || ''}</span>
            </div>
            <button
              className="stepper-btn"
              onClick={() => {
                const newVal = Math.min(step.max || 100, stepperValue + 1);
                setStepperValue(newVal);
                setAnswers(prev => ({ ...prev, [step.id]: String(newVal) }));
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Choice cards */}
      {step.type === 'choice' && step.options && (
        <div className="choice-cards">
          {step.options.map(opt => (
            <div
              key={opt.id}
              className={`choice-card ${answers[step.id] === opt.id ? 'selected' : ''}`}
              onClick={() => handleChoiceSelect(opt.id)}
            >
              <div className="choice-icon">{opt.icon}</div>
              <div className="choice-info">
                <div className="choice-label">{opt.label}</div>
                <div className="choice-desc">{opt.desc}</div>
              </div>
              <div className="choice-check">
                <div className="choice-check-inner" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="quiz-footer">
        <button
          className="quiz-back"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          ← Voltar
        </button>
        {step.type !== 'choice' && (
          <button
            className={`cta-primary ${isNextDisabled() ? 'hidden' : 'visible'}`}
            onClick={handleNext}
            style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: 0 }}
          >
            {currentStep === totalSteps - 1 ? 'FINALIZAR →' : 'PRÓXIMO →'}
          </button>
        )}
      </div>
    </div>
  );
}
