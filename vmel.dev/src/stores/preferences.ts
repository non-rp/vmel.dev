'use client';

import { create } from 'zustand';

type Preferences = {
  motion: boolean;
  hydrated: boolean;
  hydrate: () => void;
  setMotion: (motion: boolean) => void;
};

export const usePreferences = create<Preferences>((set) => ({
  motion: false,
  hydrated: false,
  hydrate: () => {
    let motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const saved = localStorage.getItem('vmel-motion');
      if (saved) motion = saved === 'on';
    } catch { /* The preference still works without storage. */ }
    set({ motion, hydrated: true });
  },
  setMotion: (motion) => {
    set({ motion });
    try { localStorage.setItem('vmel-motion', motion ? 'on' : 'off'); } catch { /* Optional persistence. */ }
  },
}));
