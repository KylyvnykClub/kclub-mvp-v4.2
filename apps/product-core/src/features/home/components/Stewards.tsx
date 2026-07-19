import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const STEWARDS = [
  {
    key: 'chair',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80',
  },
  {
    key: 'programs',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
  },
  {
    key: 'membership',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80',
  },
] as const;

export async function Stewards() {
  const t = await getTranslations('home.stewards');
  return (
    <section className="kc-section" data-section="stewards" data-tone="muted">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <div className="kc-stewards-grid">
          {STEWARDS.map((steward, index) => {
            const delay = ((index + 1) as 1 | 2 | 3);
            return (
              <Reveal key={steward.key} delay={delay}>
                <article className="kc-steward">
                  <div className="kc-steward-media">
                    <Image
                      src={steward.image}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 33vw, 100vw"
                    />
                  </div>
                  <div className="kc-steward-body">
                    <p className="kc-eyebrow">{t(`${steward.key}.role`)}</p>
                    <h3 className="kc-steward-name">{t(`${steward.key}.name`)}</h3>
                    <p className="kc-steward-credo">{t(`${steward.key}.credo`)}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="kc-stat-note">{t('note')}</p>
        </Reveal>
      </div>
    </section>
  );
}
