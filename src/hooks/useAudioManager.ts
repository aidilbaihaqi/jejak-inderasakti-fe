"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useAudioManager(initialMuted = false) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ji_audio_muted");
      if (saved !== null) return saved === "true";
    }
    return initialMuted;
  });

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize BGM audio element for /audio/musik.mp3
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/audio/musik.mp3");
    audio.loop = true;
    audio.volume = 0.35; // optimal background volume
    bgmRef.current = audio;

    // Browser Autoplay Policy: Audio starts on first user interaction if not muted
    const startBgmOnInteraction = () => {
      const savedMuted = localStorage.getItem("ji_audio_muted") === "true";
      if (!savedMuted && audio.paused) {
        audio.play().catch(() => {});
      }
      window.removeEventListener("click", startBgmOnInteraction);
      window.removeEventListener("touchstart", startBgmOnInteraction);
      window.removeEventListener("keydown", startBgmOnInteraction);
    };

    window.addEventListener("click", startBgmOnInteraction);
    window.addEventListener("touchstart", startBgmOnInteraction);
    window.addEventListener("keydown", startBgmOnInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", startBgmOnInteraction);
      window.removeEventListener("touchstart", startBgmOnInteraction);
      window.removeEventListener("keydown", startBgmOnInteraction);
    };
  }, []);

  // Sync mute state changes with audio element & persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ji_audio_muted", String(isMuted));
      } catch (e) {}
    }

    if (bgmRef.current) {
      if (isMuted) {
        bgmRef.current.pause();
      } else {
        bgmRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (!next && bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.play().catch(() => {});
      }
      return next;
    });
  }, []);

  // Web Audio Context for crisp, instant SFX without network latency
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Cheerful correct answer chime
  const playSfxCorrect = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Bright harmonic notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch (e) {
      // AudioContext safe fail
    }
  }, [isMuted, getAudioContext]);

  // Gentle friendly wrong answer sound
  const playSfxWrong = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Gentle double buzz note
      [196, 174.61].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.15, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
    } catch (e) {
      // AudioContext safe fail
    }
  }, [isMuted, getAudioContext]);

  return {
    isMuted,
    setIsMuted,
    toggleMute,
    playSfxCorrect,
    playSfxWrong,
  };
}
