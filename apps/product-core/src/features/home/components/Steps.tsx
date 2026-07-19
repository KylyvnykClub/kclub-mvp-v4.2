import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const STEP_KEYS = ['apply', 'review', 'align', 'connect', 'sustain'] as const;

export async function Steps() {
  const t = await getTranslations('home.steps');
  return (
    <section className="kc-section" id="how-it-works" data-section="steps" data-tone="muted">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <ol className="kc-step-list">
          {STEP_KEYS.map((item, index) => {
            const delay = (((index % 5) + 1) as 1 | 2 | 3 | 4 | 5);
            return (
              <Reveal key={item} delay={delay} as="li">
                <article className="kc-step">
                  <span className="kc-step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="kc-step-title">{t(`${item}.title`)}</h3>
                    <p className="kc-step-text">{t(`${item}.text`)}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
