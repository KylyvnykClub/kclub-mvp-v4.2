import { getTranslations } from 'next-intl/server';
import { SectionHeading } from './SectionHeading';

export async function Testimonials() {
  const t = await getTranslations('home.testimonials');
  const items = ['one', 'two'] as const;
  return (
    <section className="kc-section" data-section="testimonials">
      <div className="kc-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="kc-grid">
          {items.map((item) => (
            <blockquote className="kc-card kc-quote" key={item}>
              <p className="kc-lead">“{t(`${item}.quote`)}”</p>
              <footer className="kc-card-text">{t(`${item}.attribution`)}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
