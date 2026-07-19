import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const VALUES_IMAGE_SRC =
  'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&auto=format&fit=crop&q=80';
const CARDS = ['community', 'standards', 'reciprocity'] as const;

export async function Values() {
  const t = await getTranslations('home.values');
  return (
    <section className="kc-section kc-values" id="values" data-section="values">
      <div className="kc-values-backdrop" aria-hidden="true">
        <Image
          src={VALUES_IMAGE_SRC}
          alt=""
          fill
          sizes="100vw"
          className="kc-values-photo"
        />
        <div className="kc-values-veil" />
      </div>
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <div className="kc-grid kc-values-grid" data-columns="3">
          {CARDS.map((card, index) => (
            <Reveal key={card} delay={((index + 1) as 1 | 2 | 3)}>
              <article className="kc-card kc-values-card">
                <h3 className="kc-card-title">{t(`${card}.title`)}</h3>
                <p className="kc-card-text">{t(`${card}.text`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
