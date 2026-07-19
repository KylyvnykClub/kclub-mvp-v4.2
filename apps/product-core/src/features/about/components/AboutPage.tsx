import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import aboutCompanies from '../../../assets/content/about_companies.webp';
import aboutImageOne from '../../../assets/content/about_img-1.webp';
import aboutImageTwo from '../../../assets/content/about_img-2.webp';
import aboutMember from '../../../assets/content/about_member.webp';
import aboutMission from '../../../assets/content/about_mission.webp';
import aboutProfessional from '../../../assets/content/about_professional.webp';
import principleOne from '../../../assets/content/princips_1.webp';
import principleTwo from '../../../assets/content/princips_2.webp';
import principleThree from '../../../assets/content/princips_3.webp';
import principleFour from '../../../assets/content/princips_4.webp';
import principleFive from '../../../assets/content/princips_5.webp';
import { Link } from '../../../i18n/navigation';
import { ContactFormSection } from '../../home/components/ContactFormSection';
import { Reveal } from '../../motion/Reveal';
import { TrustSignals, type TrustSignal } from './TrustSignals';

const METRICS = ['reviewed', 'formats', 'languages', 'steward'] as const;
const PRINCIPLES = ['context', 'discretion', 'reciprocity'] as const;
const OFFERINGS = ['introductions', 'circles', 'advisory', 'gatherings', 'stewardship'] as const;
const OFFERING_IMAGES = [
  principleOne,
  principleTwo,
  principleThree,
  principleFour,
  principleFive,
] as const;
const VALUE_METRICS = ['review', 'formats', 'locale'] as const;

export async function AboutPage() {
  const t = await getTranslations('about');
  const home = await getTranslations('home.offerings');
  const trustItems: ReadonlyArray<TrustSignal> = [
    {
      key: 'longView',
      label: t('trust.items.longView.label'),
      category: t('trust.items.longView.category'),
      text: t('trust.items.longView.text'),
      image: aboutImageOne,
    },
    {
      key: 'foundersGuild',
      label: t('trust.items.foundersGuild.label'),
      category: t('trust.items.foundersGuild.category'),
      text: t('trust.items.foundersGuild.text'),
      image: aboutImageTwo,
    },
    {
      key: 'meridian',
      label: t('trust.items.meridian.label'),
      category: t('trust.items.meridian.category'),
      text: t('trust.items.meridian.text'),
      image: aboutMember,
    },
    {
      key: 'stewards',
      label: t('trust.items.stewards.label'),
      category: t('trust.items.stewards.category'),
      text: t('trust.items.stewards.text'),
      image: aboutProfessional,
    },
  ];

  return (
    <main className="kc-about-page">
      <section className="kc-about-hero" data-section="about-hero">
        <div className="kc-container">
          <Reveal>
            <p className="kc-eyebrow">{t('hero.eyebrow')}</p>
            <h1 className="kc-about-hero-title">{t('hero.title')}</h1>
          </Reveal>
          <div className="kc-about-hero-collage" aria-hidden="true">
            {[aboutImageOne, aboutImageTwo, aboutMember, aboutProfessional].map((image, index) => (
              <Reveal
                className="kc-about-hero-image"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={image.src}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  priority={index < 2}
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="kc-about-metrics">
            {METRICS.map((key) => (
              <div key={key}>
                <strong>{t(`hero.metrics.${key}.value`)}</strong>
                <span>{t(`hero.metrics.${key}.label`)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="kc-section kc-about-story" data-section="about-story">
        <div className="kc-container kc-about-story-grid">
          <Reveal>
            <p className="kc-eyebrow">{t('story.eyebrow')}</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="kc-about-statement">{t('story.title')}</h2>
            <p className="kc-about-lead">{t('story.text')}</p>
            <div className="kc-about-story-action">
              <div className="kc-about-markers" aria-label={t('story.markersLabel')}>
                <span>01</span>
                <span>02</span>
                <span>03</span>
              </div>
              <Link className="kc-button kc-focus-ring" href="/#contact">
                {t('story.cta')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="kc-section kc-about-mission" data-section="about-mission">
        <div className="kc-container kc-about-split">
          <Reveal className="kc-about-media" variant="left">
            <Image
              src={aboutMission}
              alt={t('mission.imageAlt')}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal className="kc-about-copy" variant="right">
            <p className="kc-eyebrow">{t('mission.eyebrow')}</p>
            <h2>{t('mission.title')}</h2>
            <p>{t('mission.text')}</p>
            <ol className="kc-about-principles">
              {PRINCIPLES.map((key, index) => (
                <li key={key}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {t(`mission.principles.${key}`)}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="kc-section kc-about-work" data-section="about-offerings">
        <div className="kc-container">
          <Reveal className="kc-about-section-heading">
            <p className="kc-eyebrow">{t('work.eyebrow')}</p>
            <h2>{t('work.title')}</h2>
            <p>{t('work.lead')}</p>
          </Reveal>
          <div className="kc-about-work-grid">
            {OFFERINGS.map((key, index) => (
              <Reveal className="kc-about-work-card" delay={(index % 3) as 0 | 1 | 2} key={key}>
                <Link className="kc-focus-ring" href="/#offerings">
                  <span className="kc-about-work-image">
                    <Image
                      src={OFFERING_IMAGES[index] ?? principleOne}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 33vw, 50vw"
                    />
                  </span>
                  <span className="kc-about-work-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{home(`${key}.title`)}</h3>
                  <p>{home(`${key}.lead`)}</p>
                </Link>
              </Reveal>
            ))}
            <Reveal className="kc-about-work-card kc-about-work-cta" delay={2}>
              <Link className="kc-focus-ring" href="/#contact">
                <span className="kc-eyebrow">{t('work.ctaEyebrow')}</span>
                <h3>{t('work.ctaTitle')}</h3>
                <span className="kc-button" data-tone="neutral">
                  {t('work.ctaLabel')}
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="kc-section kc-about-values" data-section="about-values">
        <div className="kc-container">
          <Reveal className="kc-about-values-media">
            <Image src={aboutCompanies} alt={t('values.imageAlt')} fill sizes="100vw" />
            <div className="kc-about-values-overlay">
              <p className="kc-eyebrow">{t('values.eyebrow')}</p>
              <h2>{t('values.title')}</h2>
              <p>{t('values.text')}</p>
            </div>
          </Reveal>
          <Reveal className="kc-about-value-metrics">
            {VALUE_METRICS.map((key) => (
              <div key={key}>
                <strong>{t(`values.metrics.${key}.value`)}</strong>
                <span>{t(`values.metrics.${key}.label`)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="kc-section kc-about-trust" data-section="about-trust">
        <div className="kc-container">
          <Reveal className="kc-about-section-heading">
            <p className="kc-eyebrow">{t('trust.eyebrow')}</p>
            <h2>{t('trust.title')}</h2>
            <p>{t('trust.lead')}</p>
          </Reveal>
          <Reveal>
            <TrustSignals items={trustItems} navigationLabel={t('trust.navigationLabel')} />
          </Reveal>
          <Reveal>
            <p className="kc-stat-note">{t('trust.note')}</p>
          </Reveal>
        </div>
      </section>

      <ContactFormSection />
    </main>
  );
}
