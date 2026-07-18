import { getTranslations } from 'next-intl/server';
import { SectionHeading } from './SectionHeading';

export async function HowItWorks() {
  const t = await getTranslations('home.how');
  return (
    <section className="kc-section" id="how-it-works" data-section="how-it-works">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="kc-split">
          <p className="kc-lead">{t('statement')}</p>
          <p className="kc-card-text">{t('detail')}</p>
        </div>
      </div>
    </section>
  );
}
