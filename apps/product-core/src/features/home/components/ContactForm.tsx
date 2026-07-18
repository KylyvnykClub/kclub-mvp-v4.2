'use client';

import { contactFormSchema, type ContactFormValues } from '@kclub/validation';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export function ContactForm() {
  const t = useTranslations('home.contact.form');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = contactFormSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !(field in nextErrors))
          nextErrors[field as keyof ContactFormValues] = t(
            issue.message.replace('contact.form.', ''),
          );
      }
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }
    // Intentionally no fetch: persistence requires a separate audited backend slice.
    setErrors({});
    setSubmitted(true);
    form.reset();
  }

  if (submitted)
    return (
      <div className="kc-card" role="status">
        <h3 className="kc-card-title">{t('successTitle')}</h3>
        <p className="kc-card-text">{t('successText')}</p>
        <button
          className="kc-button kc-focus-ring"
          data-tone="neutral"
          type="button"
          onClick={() => setSubmitted(false)}
        >
          {t('again')}
        </button>
      </div>
    );

  const field = (name: keyof ContactFormValues, label: string, type = 'text') => (
    <div className="kc-field">
      <label className="kc-label" htmlFor={`contact-${name}`}>
        {label}
      </label>
      <input
        className="kc-input"
        id={`contact-${name}`}
        name={name}
        type={type}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
      />
      {errors[name] ? (
        <p className="kc-field-error" id={`contact-${name}-error`}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form className="kc-form" noValidate onSubmit={handleSubmit}>
      {field('name', t('name'))}
      {field('email', t('email'), 'email')}
      {field('company', t('company'))}
      {field('phone', t('phone'), 'tel')}
      <div className="kc-field">
        <label className="kc-label" htmlFor="contact-message">
          {t('message')}
        </label>
        <textarea
          className="kc-textarea"
          id="contact-message"
          name="message"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message ? (
          <p className="kc-field-error" id="contact-message-error">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="kc-honeypot" aria-hidden="true">
        <label htmlFor="contact-company-url">{t('website')}</label>
        <input id="contact-company-url" name="companyUrl" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="kc-form-hint">{t('privacy')}</p>
      <button className="kc-button kc-focus-ring" type="submit">
        {t('submit')}
      </button>
    </form>
  );
}
