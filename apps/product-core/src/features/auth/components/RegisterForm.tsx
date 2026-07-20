'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';

import { Link } from '../../../i18n/navigation';
import { signUp } from '../actions';

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const [phone, setPhone] = useState('');
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <form action={formAction} className="kc-form">
      {state?.error && (
        <div className="kc-auth-error">{t(state.error.replace('auth.', '') as Parameters<typeof t>[0])}</div>
      )}

      <input type="hidden" name="locale" value={locale} />

      <div className="kc-field">
        <label className="kc-label" htmlFor="firstName">
          {t('register.firstName')}
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          className="kc-input kc-focus-ring"
        />
      </div>

      <div className="kc-field">
        <label className="kc-label" htmlFor="lastName">
          {t('register.lastName')}
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          className="kc-input kc-focus-ring"
        />
      </div>

      <div className="kc-field">
        <label className="kc-label" htmlFor="phone">
          {t('register.phone')}
        </label>
        <div className="kc-phone-input">
          <PhoneInput
            id="phone"
            name="phone"
            value={phone}
            onChange={(value) => setPhone(value ?? '')}
            defaultCountry="UA"
            international
            countryCallingCodeEditable={false}
          />
        </div>
      </div>

      <div className="kc-field">
        <label className="kc-label" htmlFor="password">
          {t('register.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="kc-input kc-focus-ring"
        />
        <span className="kc-form-hint">{t('register.passwordHint')}</span>
      </div>

      <button type="submit" className="kc-button kc-focus-ring" disabled={isPending}>
        {isPending ? '…' : t('register.submit')}
      </button>

      <div className="kc-auth-footer">
        {t('register.hasAccount')}{' '}
        <Link href="/auth/login">{t('register.login')}</Link>
      </div>
    </form>
  );
}
