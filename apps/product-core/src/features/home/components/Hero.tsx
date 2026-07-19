import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';

const HERO_IMAGE_SRC =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop&q=80';
const HERO_IMAGE_ALT = 'Placeholder — private conversation between two members';

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&crop=faces&q=80',
] as const;

const BULLET_KEYS = ['trust', 'access', 'growth'] as const;

export async function Hero() {
  const t = await getTranslations('home.hero');
  const bullets = BULLET_KEYS.map((key) => t(`bullets.${key}`));

  return (
    <section className="kc-section kc-hero" data-section="hero">
      <div className="kc-hero-backdrop" aria-hidden="true">
        <Image
          src={HERO_IMAGE_SRC}
          alt={HERO_IMAGE_ALT}
          fill
          priority
          sizes="100vw"
          className="kc-hero-photo"
        />
        <div className="kc-hero-veil" />
      </div>
      <div className="kc-container kc-hero-inner">
        <Reveal>
          <p className="kc-eyebrow kc-hero-eyebrow">
            <span aria-hidden="true">→</span> {t('eyebrow')}
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="kc-hero-title">{t('title')}</h1>
        </Reveal>
        <Reveal delay={2}>
          <ul className="kc-hero-bullets">
            {bullets.map((bullet, i) => (
              <li key={BULLET_KEYS[i]}>{bullet}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={3}>
          <div className="kc-cluster kc-hero-ctas">
            <a
              className="kc-button kc-focus-ring kc-pill"
              data-size="lg"
              href="#contact"
            >
              {t('primary')}
            </a>
            <a
              className="kc-button kc-focus-ring kc-pill"
              data-size="lg"
              data-tone="neutral"
              href="#offerings"
            >
              {t('secondary')}
            </a>
          </div>
        </Reveal>
        <Reveal delay={4}>
          <div className="kc-hero-strip">
            <div className="kc-hero-trust">
              <div className="kc-hero-avatars" aria-hidden="true">
                {AVATAR_URLS.map((src) => (
                  <span className="kc-hero-avatar" key={src}>
                    <Image
                      src={src}
                      alt=""
                      width={40}
                      height={40}
                      sizes="40px"
                    />
                  </span>
                ))}
              </div>
              <div>
                <p className="kc-hero-trust-count">{t('trustedBy.count')}</p>
                <p className="kc-hero-trust-label">{t('trustedBy.label')}</p>
              </div>
            </div>
            <a
              className="kc-hero-scroll kc-focus-ring"
              href="#values"
              aria-label={t('scroll.label')}
            >
              <span>{t('scroll.text')}</span>
              <span className="kc-hero-scroll-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
