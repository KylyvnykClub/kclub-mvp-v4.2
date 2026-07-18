import { getTranslations } from 'next-intl/server';

export async function Stats() {
  const t = await getTranslations('home.stats');
  const items = ['trust', 'access', 'growth'] as const;
  return (
    <section className="kc-section" data-section="stats" data-tone="muted" aria-label={t('label')}>
      <div className="kc-container kc-grid" data-columns="3">
        {items.map((item) => (
          <article className="kc-stat" key={item}>
            <p className="kc-stat-eyebrow">{t(`${item}.eyebrow`)}</p>
            <p className="kc-stat-label">{t(`${item}.label`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
