'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeToggleProps = Readonly<{
  lightLabel: string;
  darkLabel: string;
}>;

export function ThemeToggle({ lightLabel, darkLabel }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? lightLabel : darkLabel;

  return (
    <button
      className="kc-theme-toggle kc-focus-ring"
      type="button"
      aria-label={label}
      title={label}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="kc-theme-toggle-mark" aria-hidden="true" />
      <span className="kc-theme-toggle-label">{label}</span>
    </button>
  );
}
