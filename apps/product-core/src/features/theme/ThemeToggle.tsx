'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeToggleProps = Readonly<{
  label: string;
  systemLabel: string;
  lightLabel: string;
  darkLabel: string;
}>;

function SystemIcon() {
  return (
    <svg
      className="kc-theme-option-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
      <path d="M5.5 14h5M8 11.5V14" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg
      className="kc-theme-option-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M12.6 3.4l-1.06 1.06M4.46 11.54L3.4 12.6" />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg
      className="kc-theme-option-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" />
    </svg>
  );
}

export function ThemeToggle({ label, systemLabel, lightLabel, darkLabel }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const options = [
    { value: 'system', label: systemLabel, icon: <SystemIcon /> },
    { value: 'light', label: lightLabel, icon: <LightIcon /> },
    { value: 'dark', label: darkLabel, icon: <DarkIcon /> },
  ];
  const current = mounted ? (theme ?? 'system') : null;

  return (
    <div className="kc-theme-toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className="kc-theme-option kc-focus-ring"
          type="button"
          key={option.value}
          aria-label={option.label}
          aria-pressed={current === option.value}
          title={option.label}
          disabled={!mounted}
          onClick={() => setTheme(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
