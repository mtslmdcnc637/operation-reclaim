'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook to play the Comandante's voice audio during the funil.
 * 
 * HOW IT WORKS:
 * 1. You record the speech as audio files (MP3 recommended)
 * 2. Place them in /public/audio/ with the naming convention:
 *    - comandante-speech-initial.mp3  (first visit speech)
 *    - comandante-speech-after-quiz.mp3  (second visit speech)
 * 3. This hook plays the audio synced with the typewriter effect
 * 
 * The "PULAR FALA" button stops the audio.
 * The volume button toggles mute.
 */

const AUDIO_FILES: Record<string, string> = {
  initial: '/audio/comandante-speech-initial.mp3',
  afterQuiz: '/audio/comandante-speech-after-quiz.mp3',
};

export function useComandanteVoice(phase: 'initial' | 'afterQuiz') {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    const src = AUDIO_FILES[phase];
    if (!src) return;

    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = 1;
    audioRef.current = audio;

    // Check if audio file exists
    audio.addEventListener('canplaythrough', () => {
      setHasAudio(true);
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      setHasAudio(false);
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [phase]);

  const play = useCallback(() => {
    if (!audioRef.current || !hasAudio) return;
    audioRef.current.muted = isMuted;
    audioRef.current.play().catch(() => {
      // Autoplay blocked — user needs to interact first
    });
  }, [hasAudio, isMuted]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  return { play, stop, toggleMute, isPlaying, isMuted, hasAudio };
}
