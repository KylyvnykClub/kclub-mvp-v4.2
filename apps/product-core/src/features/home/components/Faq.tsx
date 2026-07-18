import { getTranslations } from 'next-intl/server';
import { FaqAccordion } from './FaqAccordion';
import { SectionHeading } from './SectionHeading';

export async function Faq() {
  const t = await getTranslations('home.faq');
  const keys = ['membership', 'business', 'privacy', 'timing'] as const;
  const items = keys.map((key) => ({ question: t(`${key}.question`), answer: t(`${key}.answer`) }));
  return (
    <section className="kc-section" id="faq" data-section="faq" data-tone="muted">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
