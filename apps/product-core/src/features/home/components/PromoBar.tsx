'use client';

import { useEffect, useState } from 'react';

type PromoBarProps = Readonly<{
  label: string;
  message: string;
  dismissLabel: string;
}>;

const STORAGE_KEY = 'kc-promo-dismissed';

export function PromoBar({ label, message, dismissLabel }: PromoBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(STORAGE_KEY) !== '1') {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="kc-promo" role="region" aria-label={label}>
      <span>
        <strong>{label}</strong>
        <span aria-hidden="true"> — </span>
        {message}
      </span>
      <button
        type="button"
        className="kc-promo-close kc-focus-ring"
        aria-label={dismissLabel}
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, '1');
          setVisible(false);
        }}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
