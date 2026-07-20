import { getTranslations } from 'next-intl/server';
import { FaqAccordion } from './FaqAccordion';
import { SectionHeading } from './SectionHeading';

export async function Faq() {
  const t = await getTranslations('home.faq');
  const keys = [
    'whatIsClub',
    'whoCanJoin',
    'memberBenefits',
    'freeRegistration',
    'vipBenefits',
    'digitalCard',
    'partnerBenefits',
    'discountGuarantee',
    'companyRegistration',
    'becomePartner',
    'catalogTiming',
    'partnerServiceReview',
    'countries',
    'memberData',
    'cancelVip',
    'support',
  ] as const;
  const items = keys.map((key) => ({ question: t(`${key}.question`), answer: t(`${key}.answer`) }));
  return (
    <section className="kc-section" id="faq" data-section="faq" data-tone="muted">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="kc-faq-scroll-shell">
          <div className="kc-faq-scroll kc-focus-ring" aria-label={t('title')} tabIndex={0}>
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
