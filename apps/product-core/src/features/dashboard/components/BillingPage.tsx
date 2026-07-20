import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function BillingPage() {
  const t = await getTranslations('dashboard.billing');

  const freePlanFeatures = ['profile', 'partners', 'card'] as const;
  const vipPlanFeatures = ['all', 'introductions', 'circles', 'gatherings', 'steward'] as const;

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">{t('title')}</h1>
        <p className="kc-dashboard-page-lead">{t('lead')}</p>
      </div>

      <div className="kc-plan-grid">
        <div className="kc-plan-card" data-active="true">
          <span className="kc-plan-card-name">{t('plans.free.name')}</span>
          <span className="kc-plan-card-price">
            {t('plans.free.price')} <span>/ {t('plans.free.period')}</span>
          </span>
          <ul className="kc-plan-card-features">
            {freePlanFeatures.map((key) => (
              <li key={key} className="kc-plan-card-feature">
                <Check size={16} />
                {t(`plans.free.features.${key}` as Parameters<typeof t>[0])}
              </li>
            ))}
          </ul>
          <button className="kc-button kc-focus-ring" data-tone="neutral" disabled>
            {t('active')}
          </button>
        </div>

        <div className="kc-plan-card">
          <span className="kc-plan-card-name">{t('plans.vip.name')}</span>
          <span className="kc-plan-card-price">
            {t('plans.vip.price')} <span>/ {t('plans.vip.period')}</span>
          </span>
          <ul className="kc-plan-card-features">
            {vipPlanFeatures.map((key) => (
              <li key={key} className="kc-plan-card-feature">
                <Check size={16} />
                {t(`plans.vip.features.${key}` as Parameters<typeof t>[0])}
              </li>
            ))}
          </ul>
          <button className="kc-button kc-focus-ring" disabled>
            {t('upgrade')}
          </button>
          <span className="kc-form-hint">{t('comingSoon')}</span>
        </div>
      </div>
    </div>
  );
}
