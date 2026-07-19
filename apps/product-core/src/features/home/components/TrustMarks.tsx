import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const ROW_A = ['pressA', 'pressB', 'pressC', 'partnerA', 'partnerB', 'partnerC'] as const;
const ROW_B = ['awardA', 'awardB', 'guildA', 'guildB', 'guildC', 'guildD'] as const;

export async function TrustMarks() {
  const t = await getTranslations('home.trustMarks');
  const rowA = ROW_A.map((k) => t(`marks.${k}`));
  const rowB = ROW_B.map((k) => t(`marks.${k}`));
  return (
    <section className="kc-section" data-section="trust-marks" aria-label={t('label')}>
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
      </div>
      <Reveal>
        <div className="kc-marquee kc-marquee-outer" role="list">
          <div className="kc-marquee-track">
            {[...rowA, ...rowA].map((mark, i) => (
              <span className="kc-marquee-item" role="listitem" key={`a-${i}`}>
                {mark}
              </span>
            ))}
          </div>
          <div className="kc-marquee-track" aria-hidden="true">
            {[...rowA, ...rowA].map((mark, i) => (
              <span className="kc-marquee-item" key={`a2-${i}`}>
                {mark}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal delay={1}>
        <div
          className="kc-marquee kc-marquee-outer kc-marquee-secondary"
          data-direction="reverse"
          role="list"
        >
          <div className="kc-marquee-track">
            {[...rowB, ...rowB].map((mark, i) => (
              <span className="kc-marquee-item" role="listitem" key={`b-${i}`}>
                {mark}
              </span>
            ))}
          </div>
          <div className="kc-marquee-track" aria-hidden="true">
            {[...rowB, ...rowB].map((mark, i) => (
              <span className="kc-marquee-item" key={`b2-${i}`}>
                {mark}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="kc-container">
        <Reveal>
          <p className="kc-stat-note">{t('note')}</p>
        </Reveal>
      </div>
    </section>
  );
}
