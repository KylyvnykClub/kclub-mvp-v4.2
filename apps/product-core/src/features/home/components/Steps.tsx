import { getTranslations } from 'next-intl/server';

export async function Steps() {
  const t = await getTranslations('home.steps');
  const items = ['apply', 'review', 'connect'] as const;
  return (
    <section className="kc-section" data-section="steps" data-tone="muted">
      <div className="kc-container kc-step-list">
        {items.map((item, index) => (
          <article className="kc-step" key={item}>
            <span className="kc-step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h2 className="kc-step-title">{t(`${item}.title`)}</h2>
              <p className="kc-step-text">{t(`${item}.text`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
