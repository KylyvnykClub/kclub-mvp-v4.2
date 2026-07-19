'use client';

import { useEffect } from 'react';

const THRESHOLD = 24;

export function useScrolled() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const shouldMark = window.scrollY > THRESHOLD;
      const current = root.dataset.scrolled === 'true';
      if (shouldMark !== current) {
        if (shouldMark) {
          root.dataset.scrolled = 'true';
        } else {
          delete root.dataset.scrolled;
        }
      }
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    return () => {
      window.removeEventListener('scroll', apply);
      delete root.dataset.scrolled;
    };
  }, []);
}
