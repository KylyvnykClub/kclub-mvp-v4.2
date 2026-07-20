'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';

import { Link } from '../../../i18n/navigation';
import { signIn } from '../actions';

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const [phone, setPhone] = useState('');
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="kc-form">
      {state?.error && (
        <div className="kc-auth-error">{t(state.error.replace('auth.', '') as Parameters<typeof t>[0])}</div>
      )}

      <input type="hidden" name="locale" value={locale} />

      <div className="kc-field">
        <label className="kc-label" htmlFor="phone">
          {t('login.phone')}
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
          {t('login.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="kc-input kc-focus-ring"
        />
      </div>

      <button type="submit" className="kc-button kc-focus-ring" disabled={isPending}>
        {isPending ? '…' : t('login.submit')}
      </button>

      <div className="kc-auth-footer">
        {t('login.noAccount')}{' '}
        <Link href="/auth/register">{t('login.register')}</Link>
      </div>
    </form>
  );
}
