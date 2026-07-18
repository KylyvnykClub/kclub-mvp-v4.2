import { getTranslations } from 'next-intl/server';
export async function Cta() {
  const t = await getTranslations('home.cta');
  return (
    <section className="kc-section" data-section="cta" data-tone="accent">
      <div className="kc-container kc-cta">
        <div>
          <h2 className="kc-section-title">{t('title')}</h2>
          <p className="kc-section-lead">{t('lead')}</p>
        </div>
        <a className="kc-button kc-focus-ring" data-size="lg" data-tone="neutral" href="#contact">
          {t('button')}
        </a>
      </div>
    </section>
  );
}
