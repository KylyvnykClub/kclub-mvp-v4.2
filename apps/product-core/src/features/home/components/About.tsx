import { getTranslations } from 'next-intl/server';
import { SectionHeading } from './SectionHeading';

export async function About() {
  const t = await getTranslations('home.about');
  const cards = ['community', 'standards', 'reciprocity'] as const;
  return (
    <section className="kc-section" id="about" data-section="about">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="kc-grid" data-columns="3">
          {cards.map((card) => (
            <article className="kc-card" key={card}>
              <h3 className="kc-card-title">{t(`${card}.title`)}</h3>
              <p className="kc-card-text">{t(`${card}.text`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
