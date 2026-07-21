import { BriefcaseBusiness, CreditCard } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '../../../i18n/navigation';
import { startVipCheckout } from '../../auth/actions';
import type { MembershipApplicationStatus } from '@kclub/domain';

type DashboardHomeProps = {
  locale: string;
  memberName: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    phone: string;
    country: string | null;
    city: string | null;
    preferredLocale: string;
    createdAt: Date;
  };
  card: {
    publicId: string;
    expiresAt: Date;
    qrCodeDataUrl: string;
  };
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

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const formatCardDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    month: '2-digit',
    year: 'numeric',
  }).format(date);

export async function DashboardHome({
  locale,
  memberName,
  member,
  card,
  applicationStatus,
}: DashboardHomeProps) {
  const t = await getTranslations('dashboard.overview');
  const profileT = await getTranslations('dashboard.profile');
  const settingsT = await getTranslations('dashboard.settings');

  const fullName = member.displayName ?? `${member.firstName} ${member.lastName}`;

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">{t('greeting', { name: memberName })}</h1>
        <p className="kc-dashboard-page-lead">{t('lead')}</p>
      </div>

      <section className="kc-member-hero" aria-label={t('title')}>
        <div className="kc-member-identity">
          <div className="kc-avatar" data-size="lg">
            <span className="kc-avatar-initials">
              {member.firstName[0]}
              {member.lastName[0]}
            </span>
          </div>
          <div className="kc-member-identity-copy">
            <div className="kc-member-name-row">
              <h2>{memberName}</h2>
              <span className="kc-badge">Member</span>
            </div>
            <p>{formatDate(member.createdAt)}</p>
          </div>
        </div>

        <div className="kc-club-card" aria-label={`Club card ${card.publicId}`}>
          <img
            className="kc-club-card-qr"
            src={card.qrCodeDataUrl}
            alt="Club card validation QR code"
          />
          <div className="kc-club-card-mark">KC</div>
          <div className="kc-club-card-brand">
            <span>KYLYVNYK</span>
            <span>BUSINESS CLUB</span>
          </div>
          <strong>{fullName}</strong>
          <small>ID: {card.publicId} VALID UNTIL: {formatCardDate(card.expiresAt)}</small>
        </div>
      </section>

      <dl className="kc-member-details">
        <div>
          <dt>{profileT('displayName')}</dt>
          <dd>{member.displayName ?? fullName}</dd>
        </div>
        <div>
          <dt>{profileT('phone')}</dt>
          <dd>{member.phone}</dd>
        </div>
        <div>
          <dt>{profileT('country')}</dt>
          <dd>{member.country ?? '-'}</dd>
        </div>
        <div>
          <dt>{profileT('city')}</dt>
          <dd>{member.city ?? '-'}</dd>
        </div>
        <div>
          <dt>{settingsT('language.title')}</dt>
          <dd>
            {settingsT(`language.${member.preferredLocale}` as Parameters<typeof settingsT>[0])}
          </dd>
        </div>
        <div>
          <dt>{t('membershipStatus')}</dt>
          <dd data-tone={applicationStatus ? STATUS_TONE[applicationStatus] : undefined}>
            {applicationStatus
              ? t(STATUS_KEY[applicationStatus] as Parameters<typeof t>[0])
              : t('statusNone')}
          </dd>
        </div>
      </dl>

      <div className="kc-quick-links" data-columns="2">
        <form action={startVipCheckout} className="kc-quick-link-form">
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="kc-quick-link kc-quick-link-button">
            <CreditCard size={20} />
            <div className="kc-quick-link-text">
              <span className="kc-quick-link-title">Get VIP</span>
              <span className="kc-quick-link-desc">19.99$/month</span>
            </div>
          </button>
        </form>

        <Link href="/dashboard/business/onboarding" className="kc-quick-link">
          <BriefcaseBusiness size={20} />
          <div className="kc-quick-link-text">
            <span className="kc-quick-link-title">Business placement</span>
            <span className="kc-quick-link-desc">Company information and onboarding steps</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
