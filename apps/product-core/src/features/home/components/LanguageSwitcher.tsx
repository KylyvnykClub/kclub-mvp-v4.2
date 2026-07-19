'use client';

import { Link, usePathname } from '../../../i18n/navigation';

const LOCALES = [
  { locale: 'en', label: 'English' },
  { locale: 'ru', label: 'Русский' },
  { locale: 'uk', label: 'Українська' },
] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <ul className="kc-footer-list">
      {LOCALES.map(({ locale, label }) => (
        <li key={locale}>
          <Link className="kc-footer-link kc-focus-ring" href={pathname} locale={locale}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
