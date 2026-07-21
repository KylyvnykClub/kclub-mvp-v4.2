import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '../../../../../i18n/routing';

type BusinessOnboardingRouteProps = {
  params: Promise<{ locale: string }>;
};

const STEPS = ['Company details', 'Representative', 'Location and category', 'Review'] as const;

export function generateMetadata(): Metadata {
  return { title: 'Business placement' };
}

export default async function BusinessOnboardingRoute({ params }: BusinessOnboardingRouteProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">Business placement</h1>
        <p className="kc-dashboard-page-lead">
          Submit company information for KYLYVNYK CLUB review.
        </p>
      </div>

      <div className="kc-business-steps">
        {STEPS.map((step, index) => (
          <div key={step} className="kc-business-step">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <form className="kc-form kc-business-form">
        <div className="kc-field">
          <label className="kc-label" htmlFor="businessName">
            Business name
          </label>
          <input id="businessName" name="businessName" className="kc-input kc-focus-ring" />
        </div>
        <div className="kc-field">
          <label className="kc-label" htmlFor="representativeName">
            Representative name
          </label>
          <input
            id="representativeName"
            name="representativeName"
            className="kc-input kc-focus-ring"
          />
        </div>
        <div className="kc-field">
          <label className="kc-label" htmlFor="businessEmail">
            Email
          </label>
          <input
            id="businessEmail"
            name="businessEmail"
            type="email"
            className="kc-input kc-focus-ring"
          />
        </div>
        <div className="kc-field">
          <label className="kc-label" htmlFor="businessDescription">
            Brief description
          </label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            className="kc-textarea kc-focus-ring"
          />
        </div>
        <button type="button" className="kc-button kc-focus-ring" disabled>
          Continue
        </button>
      </form>
    </div>
  );
}
