import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { ProcessSteps, type ProcessStepItem } from './ProcessSteps';
import { SectionHeading } from './SectionHeading';

const STEP_KEYS = ['apply', 'review', 'align', 'connect', 'sustain'] as const;

export async function Steps() {
  const t = await getTranslations('home.steps');
  const items: ReadonlyArray<ProcessStepItem> = STEP_KEYS.map((key, index) => ({
    key,
    number: index + 1,
    title: t(`${key}.title`),
    text: t(`${key}.text`),
    progress: t('progress', { current: index + 1, total: STEP_KEYS.length }),
  }));

  return (
    <section className="kc-section" id="how-it-works" data-section="steps" data-tone="muted">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <Reveal delay={1}>
          <ProcessSteps items={items} navigationLabel={t('navigationLabel')} />
        </Reveal>
      </div>
    </section>
  );
}
