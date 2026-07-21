import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { prisma } from '../../../../lib/supabase/db';
import { routing } from '../../../../i18n/routing';

type VerifyCardPageProps = {
  params: Promise<{
    locale: string;
    publicId: string;
  }>;
};

export default async function VerifyCardPage({ params }: VerifyCardPageProps) {
  const { locale, publicId } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const card = await prisma.clubCard.findUnique({
    where: { publicId: decodeURIComponent(publicId).toUpperCase() },
    include: {
      member: {
        select: {
          displayName: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const isValid = card?.status === 'ACTIVE' && card.expiresAt > new Date();
  const memberName =
    card?.member.displayName ?? `${card?.member.firstName ?? ''} ${card?.member.lastName ?? ''}`.trim();

  return (
    <main className="kc-verify-card">
      <div className="kc-verify-card-panel" data-valid={isValid}>
        <span className="kc-badge">{isValid ? 'Valid card' : 'Card not valid'}</span>
        <h1>KYLYVNYK CLUB</h1>
        <dl>
          <div>
            <dt>ID</dt>
            <dd>{card?.publicId ?? publicId}</dd>
          </div>
          <div>
            <dt>Member</dt>
            <dd>{memberName || '-'}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{card?.status ?? 'UNKNOWN'}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
