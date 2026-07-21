'use client';

import { useLocale } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';

import { Link, usePathname } from '../../../i18n/navigation';
import { getCountryFlagUrl } from '../../partners/data';

const LOCALES = [
  { locale: 'en', label: 'English', flagCode: 'us' },
  { locale: 'ru', label: 'Русский', flagCode: 'ru' },
  { locale: 'uk', label: 'Українська', flagCode: 'ua' },
] as const;

function ChevronIcon() {
  return (
    <svg
      className="kc-language-trigger-icon"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.25 4.5 6 8.25 9.75 4.5" />
    </svg>
  );
}

type LanguageSwitcherProps = Readonly<{
  title: string;
}>;

export function LanguageSwitcher({ title }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const currentLocale = LOCALES.find((entry) => entry.locale === locale) ?? LOCALES[0];

  return (
    <div ref={rootRef} className="kc-language-switcher" data-state={isOpen ? 'open' : 'closed'}>
      <button
        className="kc-language-trigger kc-focus-ring"
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-label={`${title}: ${currentLocale.label}`}
        onClick={() => setIsOpen((value) => !value)}
      >
        <img
          src={getCountryFlagUrl(currentLocale.flagCode)}
          alt=""
          className="kc-language-flag"
          aria-hidden="true"
          width={18}
          height={18}
        />
        <ChevronIcon />
      </button>
      <div className="kc-language-menu" id={menuId} hidden={!isOpen}>
        <ul className="kc-language-options" aria-label={title}>
          {LOCALES.map((entry) => {
            const isCurrent = entry.locale === locale;

            return (
              <li key={entry.locale}>
                {isCurrent ? (
                  <span className="kc-language-option" data-current="true" aria-label={entry.label}>
                    <img
                      src={getCountryFlagUrl(entry.flagCode)}
                      alt=""
                      className="kc-language-flag"
                      aria-hidden="true"
                      width={20}
                      height={20}
                    />
                  </span>
                ) : (
                  <Link
                    className="kc-language-option kc-focus-ring"
                    href={pathname}
                    locale={entry.locale}
                    aria-label={entry.label}
                  >
                    <img
                      src={getCountryFlagUrl(entry.flagCode)}
                      alt=""
                      className="kc-language-flag"
                      aria-hidden="true"
                      width={20}
                      height={20}
                    />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
