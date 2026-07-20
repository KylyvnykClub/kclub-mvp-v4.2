import { getTranslations } from 'next-intl/server';

import type { MembershipApplicationStatus } from '@kclub/domain';
import { StatusTracker } from './StatusTracker';
import { MembershipForm } from './MembershipForm';

type MembershipPageProps = {
  application: {
    status: MembershipApplicationStatus;
    motivation: string | null;
    referralSource: string | null;
    submittedAt: Date;
    reviewNote: string | null;
  } | null;
};

export async function MembershipPage({ application }: MembershipPageProps) {
  const t = await getTranslations('dashboard.membership');

  if (!application) {
    return (
      <div className="kc-dashboard-page">
        <div className="kc-dashboard-page-header">
          <h1 className="kc-dashboard-page-title">{t('applyTitle')}</h1>
          <p className="kc-dashboard-page-lead">{t('applyLead')}</p>
        </div>
        <MembershipForm />
      </div>
    );
  }

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">{t('statusTitle')}</h1>
        <p className="kc-dashboard-page-lead">{t('statusLead')}</p>
      </div>

      <StatusTracker status={application.status} />

      {application.status === 'APPROVED' && (
        <div className="kc-stat-card" data-tone="success">
          <span className="kc-stat-card-value">{t('approved')}</span>
        </div>
      )}

      {application.status === 'REJECTED' && (
        <div className="kc-stat-card">
          <span className="kc-stat-card-value" style={{ color: 'var(--kc-error)' }}>
            {t('rejected')}
          </span>
          {application.reviewNote && (
            <>
              <span className="kc-stat-card-label">{t('reviewNote')}</span>
              <p style={{ fontSize: 'var(--kc-text-sm)', color: 'var(--kc-text-muted)' }}>
                {application.reviewNote}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
