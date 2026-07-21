'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { ThemeToggle } from '../../theme/ThemeToggle';
import { changePassword, signOut, updateProfile } from '../../auth/actions';

type ProfilePageProps = {
  locale: string;
  themeLabels: {
    label: string;
    system: string;
    light: string;
    dark: string;
  };
  member: {
    firstName: string;
    lastName: string;
    displayName: string | null;
    company: string | null;
    position: string | null;
    bio: string | null;
    city: string | null;
    country: string | null;
    phone: string;
  };
};

export function ProfilePage({ locale, member, themeLabels }: ProfilePageProps) {
  const t = useTranslations('dashboard.profile');
  const settingsT = useTranslations('dashboard.settings');
  const [state, formAction, isPending] = useActionState(updateProfile, null);
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

      {state?.success && (
        <div className="kc-stat-card" data-tone="success">
          <span className="kc-stat-card-value">{t('saved')}</span>
        </div>
      )}

      <form action={formAction} className="kc-form">
        <div className="kc-field">
          <label className="kc-label" htmlFor="phone">
            {t('phone')}
          </label>
          <input id="phone" type="text" value={member.phone} disabled className="kc-input" />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="firstName">
            {t('firstName')}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={member.firstName}
            required
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="lastName">
            {t('lastName')}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={member.lastName}
            required
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="displayName">
            {t('displayName')}
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={member.displayName ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="company">
            {t('company')}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={member.company ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="position">
            {t('position')}
          </label>
          <input
            id="position"
            name="position"
            type="text"
            defaultValue={member.position ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="bio">
            {t('bio')}
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={member.bio ?? ''}
            className="kc-textarea kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="city">
            {t('city')}
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={member.city ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="country">
            {t('country')}
          </label>
          <input
            id="country"
            name="country"
            type="text"
            defaultValue={member.country ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <button type="submit" className="kc-button kc-focus-ring" disabled={isPending}>
          {isPending ? t('saving') : t('save')}
        </button>
      </form>

      <section className="kc-settings-section">
        <h2 className="kc-settings-section-title">{settingsT('password.title')}</h2>
        <p className="kc-settings-section-desc">{settingsT('password.desc')}</p>

        {pwState?.success && (
          <div className="kc-stat-card" data-tone="success">
            <span className="kc-stat-card-value">{settingsT('password.saved')}</span>
          </div>
        )}

        <form action={pwAction} className="kc-form">
          <div className="kc-field">
            <label className="kc-label" htmlFor="currentPassword">
              {settingsT('password.current')}
            </label>
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
            <label className="kc-label" htmlFor="newPassword">
              {settingsT('password.new')}
            </label>
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
            <label className="kc-label" htmlFor="confirmPassword">
              {settingsT('password.confirm')}
            </label>
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
            {pwPending ? settingsT('password.saving') : settingsT('password.submit')}
          </button>
        </form>
      </section>

      <section className="kc-settings-section">
        <h2 className="kc-settings-section-title">{settingsT('language.title')}</h2>
        <p className="kc-settings-section-desc">{settingsT('language.desc')}</p>
        <div className="kc-cluster">
          {(['en', 'ru', 'uk'] as const).map((lang) => (
            <a
              key={lang}
              href={`/${lang}/dashboard/profile`}
              className="kc-button kc-focus-ring"
              data-tone={lang === locale ? undefined : 'neutral'}
            >
              {settingsT(`language.${lang}` as Parameters<typeof settingsT>[0])}
            </a>
          ))}
        </div>
      </section>

      <section className="kc-settings-section">
        <h2 className="kc-settings-section-title">{settingsT('theme.title')}</h2>
        <p className="kc-settings-section-desc">{settingsT('theme.desc')}</p>
        <ThemeToggle
          label={themeLabels.label}
          systemLabel={themeLabels.system}
          lightLabel={themeLabels.light}
          darkLabel={themeLabels.dark}
        />
      </section>

      <section className="kc-settings-section">
        <h2 className="kc-settings-section-title">{settingsT('signOut.title')}</h2>
        <p className="kc-settings-section-desc">{settingsT('signOut.desc')}</p>
        <button className="kc-button kc-focus-ring" data-tone="neutral" onClick={handleSignOut}>
          {settingsT('signOut.button')}
        </button>
      </section>
    </div>
  );
}
