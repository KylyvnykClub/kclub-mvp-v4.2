'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { updateProfile } from '../../auth/actions';

type ProfilePageProps = {
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

export function ProfilePage({ member }: ProfilePageProps) {
  const t = useTranslations('dashboard.profile');
  const [state, formAction, isPending] = useActionState(updateProfile, null);

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
          <label className="kc-label" htmlFor="phone">{t('phone')}</label>
          <input
            id="phone"
            type="text"
            value={member.phone}
            disabled
            className="kc-input"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="firstName">{t('firstName')}</label>
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
          <label className="kc-label" htmlFor="lastName">{t('lastName')}</label>
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
          <label className="kc-label" htmlFor="displayName">{t('displayName')}</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={member.displayName ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="company">{t('company')}</label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={member.company ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="position">{t('position')}</label>
          <input
            id="position"
            name="position"
            type="text"
            defaultValue={member.position ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="bio">{t('bio')}</label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={member.bio ?? ''}
            className="kc-textarea kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="city">{t('city')}</label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={member.city ?? ''}
            className="kc-input kc-focus-ring"
          />
        </div>

        <div className="kc-field">
          <label className="kc-label" htmlFor="country">{t('country')}</label>
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
    </div>
  );
}
