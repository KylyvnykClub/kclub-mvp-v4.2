import { getTranslations } from 'next-intl/server';

export async function Hero() {
  const t = await getTranslations('home.hero');
  return (
    <section className="kc-section kc-hero" data-section="hero">
      <div className="kc-container kc-hero-grid">
        <div className="kc-stack">
          <p className="kc-eyebrow">{t('eyebrow')}</p>
          <h1 className="kc-title">{t('title')}</h1>
          <p className="kc-lead">{t('lead')}</p>
          <div className="kc-cluster">
            <a className="kc-button kc-focus-ring" data-size="lg" href="#contact">
              {t('primary')}
            </a>
            <a className="kc-button kc-focus-ring" data-size="lg" data-tone="neutral" href="#about">
              {t('secondary')}
            </a>
          </div>
        </div>
        <aside className="kc-hero-note" aria-label={t('noteLabel')}>
          <p className="kc-badge">{t('noteBadge')}</p>
          <p className="kc-lead">{t('note')}</p>
        </aside>
      </div>
    </section>
  );
}
