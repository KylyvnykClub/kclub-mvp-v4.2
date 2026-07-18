'use client';

import { useState } from 'react';

type MobileNavProps = Readonly<{
  links: ReadonlyArray<{ href: string; label: string }>;
  label: string;
  closeLabel: string;
}>;

export function MobileNav({ links, label, closeLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="kc-mobile-nav">
      <button
        className="kc-button kc-focus-ring"
        data-size="sm"
        data-tone="neutral"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? closeLabel : label}
      </button>
      {open ? (
        <nav className="kc-mobile-panel" id="mobile-navigation" aria-label={label}>
          {links.map((link) => (
            <a
              className="kc-nav-link kc-focus-ring"
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
