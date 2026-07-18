import { getTranslations } from 'next-intl/server';
import { SectionHeading } from './SectionHeading';

export async function Plan() {
  const t = await getTranslations('home.plan');
  const items = ['profile', 'network', 'opportunities'] as const;
  return (
    <section className="kc-section" data-section="plan" data-tone="muted">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="kc-grid" data-columns="3">
          {items.map((item) => (
            <article className="kc-card" key={item}>
              <span className="kc-badge">{t(`${item}.badge`)}</span>
              <h3 className="kc-card-title">{t(`${item}.title`)}</h3>
              <p className="kc-card-text">{t(`${item}.text`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
