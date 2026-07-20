import {
  User,
  ShieldCheck,
  CreditCard,
  Settings,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '../../../i18n/navigation';
import type { MembershipApplicationStatus } from '@kclub/domain';

type DashboardHomeProps = {
  memberName: string;
  applicationStatus: MembershipApplicationStatus | null;
};

const STATUS_TONE: Record<string, string> = {
  SUBMITTED: 'warning',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'accent',
};

const STATUS_KEY: Record<string, string> = {
  SUBMITTED: 'statusSubmitted',
  UNDER_REVIEW: 'statusUnderReview',
  APPROVED: 'statusApproved',
  REJECTED: 'statusRejected',
};

export async function DashboardHome({ memberName, applicationStatus }: DashboardHomeProps) {
  const t = await getTranslations('dashboard.overview');

  const links = [
    { href: '/dashboard/profile', key: 'profile', icon: User },
    { href: '/dashboard/membership', key: 'membership', icon: ShieldCheck },
    { href: '/dashboard/billing', key: 'billing', icon: CreditCard },
    { href: '/dashboard/settings', key: 'settings', icon: Settings },
  ] as const;

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">
          {t('greeting', { name: memberName })}
        </h1>
        <p className="kc-dashboard-page-lead">{t('lead')}</p>
      </div>

      <div className="kc-stat-grid">
        <div
          className="kc-stat-card"
          data-tone={applicationStatus ? STATUS_TONE[applicationStatus] : undefined}
        >
          <span className="kc-stat-card-label">{t('membershipStatus')}</span>
          <span className="kc-stat-card-value">
            {applicationStatus
              ? t(STATUS_KEY[applicationStatus] as Parameters<typeof t>[0])
              : t('statusNone')}
          </span>
        </div>
        <div className="kc-stat-card">
          <span className="kc-stat-card-label">{t('plan')}</span>
          <span className="kc-stat-card-value">{t('freePlan')}</span>
        </div>
      </div>

      <div className="kc-quick-links">
        {links.map(({ href, key, icon: Icon }) => (
          <Link key={key} href={href} className="kc-quick-link">
            <Icon size={20} />
            <div className="kc-quick-link-text">
              <span className="kc-quick-link-title">
                {t(`links.${key}.title` as Parameters<typeof t>[0])}
              </span>
              <span className="kc-quick-link-desc">
                {t(`links.${key}.desc` as Parameters<typeof t>[0])}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
