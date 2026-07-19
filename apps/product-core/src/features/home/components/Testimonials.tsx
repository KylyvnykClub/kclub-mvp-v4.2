import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { SectionHeading } from './SectionHeading';

const ITEMS = [
  {
    key: 'one',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&crop=faces&q=80',
  },
  {
    key: 'two',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&crop=faces&q=80',
  },
  {
    key: 'three',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&crop=faces&q=80',
  },
] as const;

export async function Testimonials() {
  const t = await getTranslations('home.testimonials');
  return (
    <section className="kc-section" data-section="testimonials">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <div className="kc-testimonials-grid">
          {ITEMS.map((item, index) => {
            const delay = ((index + 1) as 1 | 2 | 3);
            return (
              <Reveal key={item.key} delay={delay}>
                <blockquote className="kc-testimonial">
                  <p className="kc-testimonial-quote">
                    “{t(`${item.key}.quote`)}”
                  </p>
                  <footer className="kc-testimonial-footer">
                    <span className="kc-hero-avatar">
                      <Image
                        src={item.avatar}
                        alt=""
                        width={40}
                        height={40}
                        sizes="40px"
                      />
                    </span>
                    <span>
                      <span className="kc-testimonial-name">
                        {t(`${item.key}.name`)}
                      </span>
                      <span className="kc-testimonial-role">
                        {t(`${item.key}.role`)}
                      </span>
                    </span>
                  </footer>
                </blockquote>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
