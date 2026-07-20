'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { ThemeToggle } from '../../theme/ThemeToggle';
import { changePassword, signOut } from '../../auth/actions';

type SettingsPageProps = {
  locale: string;
  themeLabels: {
    label: string;
    system: string;
    light: string;
    dark: string;
  };
};

export function SettingsPage({ locale, themeLabels }: SettingsPageProps) {
  const t = useTranslations('dashboard.settings');
  const [pwState, pwAction, pwPending] = useActionState(changePassword, null);

  const handleSignOut = async () => {
    await signOut(locale);
  };

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">{t('title')}</h1>
        <p className="kc-dashboard-page-lead">{t('lead')}</p>
      </div>

      <div className="kc-settings-section">
        <h2 className="kc-settings-section-title">{t('password.title')}</h2>
        <p className="kc-settings-section-desc">{t('password.desc')}</p>

        {pwState?.success && (
          <div className="kc-stat-card" data-tone="success">
            <span className="kc-stat-card-value">{t('password.saved')}</span>
          </div>
        )}

        <form action={pwAction} className="kc-form">
          <div className="kc-field">
            <label className="kc-label" htmlFor="currentPassword">{t('password.current')}</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              className="kc-input kc-focus-ring"
            />
          </div>
          <div className="kc-field">
            <label className="kc-label" htmlFor="newPassword">{t('password.new')}</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="kc-input kc-focus-ring"
            />
          </div>
          <div className="kc-field">
            <label className="kc-label" htmlFor="confirmPassword">{t('password.confirm')}</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="kc-input kc-focus-ring"
            />
          </div>
          <button type="submit" className="kc-button kc-focus-ring" disabled={pwPending}>
            {pwPending ? t('password.saving') : t('password.submit')}
          </button>
        </form>
      </div>

      <div className="kc-settings-section">
        <h2 className="kc-settings-section-title">{t('language.title')}</h2>
        <p className="kc-settings-section-desc">{t('language.desc')}</p>
        <div className="kc-cluster" style={{ gap: 'var(--kc-space-2)' }}>
          {(['en', 'ru', 'uk'] as const).map((lang) => (
            <a
              key={lang}
              href={`/${lang}/dashboard/settings`}
              className="kc-button kc-focus-ring"
              data-tone={lang === locale ? undefined : 'neutral'}
            >
              {t(`language.${lang}` as Parameters<typeof t>[0])}
            </a>
          ))}
        </div>
      </div>

      <div className="kc-settings-section">
        <h2 className="kc-settings-section-title">{t('theme.title')}</h2>
        <p className="kc-settings-section-desc">{t('theme.desc')}</p>
        <ThemeToggle
          label={themeLabels.label}
          systemLabel={themeLabels.system}
          lightLabel={themeLabels.light}
          darkLabel={themeLabels.dark}
        />
      </div>

      <div className="kc-settings-section">
        <h2 className="kc-settings-section-title">{t('signOut.title')}</h2>
        <p className="kc-settings-section-desc">{t('signOut.desc')}</p>
        <button className="kc-button kc-focus-ring" data-tone="neutral" onClick={handleSignOut}>
          {t('signOut.button')}
        </button>
      </div>

      <div className="kc-settings-section">
        <h2 className="kc-settings-section-title">{t('danger.title')}</h2>
        <p className="kc-settings-section-desc">{t('danger.desc')}</p>
        <button className="kc-button kc-focus-ring" data-tone="neutral" disabled>
          {t('danger.button')}
        </button>
        <span className="kc-form-hint">{t('danger.comingSoon')}</span>
      </div>
    </div>
  );
}
