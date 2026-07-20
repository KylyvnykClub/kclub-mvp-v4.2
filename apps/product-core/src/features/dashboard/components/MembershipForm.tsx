'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { submitMembershipApplication } from '../../auth/actions';

export function MembershipForm() {
  const t = useTranslations('dashboard.membership');
  const [state, formAction, isPending] = useActionState(submitMembershipApplication, null);

  if (state?.success) {
    return (
      <div className="kc-stat-card" data-tone="success">
        <span className="kc-stat-card-value">{t('submitted')}</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="kc-form">
      {state?.error && (
        <div className="kc-auth-error">{state.error}</div>
      )}

      <div className="kc-field">
        <label className="kc-label" htmlFor="motivation">{t('motivation')}</label>
        <textarea
          id="motivation"
          name="motivation"
          required
          minLength={10}
          placeholder={t('motivationPlaceholder')}
          className="kc-textarea kc-focus-ring"
        />
      </div>

      <div className="kc-field">
        <label className="kc-label" htmlFor="referralSource">{t('referralSource')}</label>
        <input
          id="referralSource"
          name="referralSource"
          type="text"
          placeholder={t('referralSourcePlaceholder')}
          className="kc-input kc-focus-ring"
        />
      </div>

      <button type="submit" className="kc-button kc-focus-ring" disabled={isPending}>
        {isPending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
