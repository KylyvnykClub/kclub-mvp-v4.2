import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { OfferingPanels, type OfferingPanelItem } from './OfferingPanels';
import { SectionHeading } from './SectionHeading';

const ITEM_KEYS = ['introductions', 'circles', 'advisory', 'gatherings', 'stewardship'] as const;

export async function Offerings() {
  const t = await getTranslations('home.offerings');
  const items: ReadonlyArray<OfferingPanelItem> = ITEM_KEYS.map((key, index) => ({
    key,
    number: index + 1,
    title: t(`${key}.title`),
    lead: t(`${key}.lead`),
    linkLabel: t(`${key}.link`),
  }));

  return (
    <section className="kc-section" id="offerings" data-section="offerings" data-tone="muted">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <Reveal delay={1}>
          <OfferingPanels items={items} interactionHint={t('interactionHint')} />
        </Reveal>
      </div>
    </section>
  );
}
