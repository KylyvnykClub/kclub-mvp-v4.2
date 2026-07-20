import { Check, X } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import type { MembershipApplicationStatus } from '@kclub/domain';

type StatusTrackerProps = {
  status: MembershipApplicationStatus;
};

function getStepState(
  status: MembershipApplicationStatus,
  step: 'submitted' | 'underReview' | 'decision',
): 'completed' | 'active' | 'pending' | 'rejected' {
  if (step === 'submitted') {
    return 'completed';
  }
  if (step === 'underReview') {
    if (status === 'SUBMITTED') return 'pending';
    return status === 'UNDER_REVIEW' ? 'active' : 'completed';
  }
  if (status === 'APPROVED') return 'completed';
  if (status === 'REJECTED') return 'rejected';
  return 'pending';
}

export async function StatusTracker({ status }: StatusTrackerProps) {
  const t = await getTranslations('dashboard.membership.steps');

  const steps = [
    { key: 'submitted' as const, label: t('submitted') },
    { key: 'underReview' as const, label: t('underReview') },
    { key: 'decision' as const, label: t('decision') },
  ];

  return (
    <div className="kc-status-tracker">
      {steps.map(({ key, label }) => {
        const state = getStepState(status, key);
        return (
          <div key={key} className="kc-status-step" data-state={state}>
            <div className="kc-status-dot">
              {state === 'completed' && <Check size={14} />}
              {state === 'rejected' && <X size={14} />}
            </div>
            <span className="kc-status-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
