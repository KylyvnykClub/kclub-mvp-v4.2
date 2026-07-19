import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const STORIES = [
  {
    key: 'coinvestment',
    image:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800&auto=format&fit=crop&q=80',
  },
  {
    key: 'relocation',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
  },
  {
    key: 'succession',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
  },
  {
    key: 'hiring',
    image:
      'https://images.unsplash.com/photo-1546961342-1a9d5f194a89?w=800&auto=format&fit=crop&q=80',
  },
] as const;

export async function Outcomes() {
  const t = await getTranslations('home.outcomes');
  return (
    <section className="kc-section" id="outcomes" data-section="outcomes">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <div className="kc-outcomes-grid">
          {STORIES.map((story, index) => {
            const delay = ((index % 4) + 1) as 1 | 2 | 3 | 4;
            return (
              <Reveal key={story.key} delay={delay}>
                <article className="kc-outcome">
                  <div className="kc-outcome-media">
                    <Image
                      src={story.image}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 40vw, 100vw"
                    />
                    <div className="kc-outcome-veil" />
                    <span className="kc-outcome-tag">{t(`${story.key}.tag`)}</span>
                  </div>
                  <div className="kc-outcome-body">
                    <h3 className="kc-outcome-title">{t(`${story.key}.title`)}</h3>
                    <p className="kc-outcome-result">{t(`${story.key}.result`)}</p>
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
