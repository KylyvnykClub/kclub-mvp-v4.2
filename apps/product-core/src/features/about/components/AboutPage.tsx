import { CreditCard, Globe, Handshake, Search, Shield, Star } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import aboutCompanies from '../../../assets/content/about_companies.webp';
import aboutImageOne from '../../../assets/content/about_img-1.webp';
import aboutMember from '../../../assets/content/about_member.webp';
import aboutMission from '../../../assets/content/about_mission.webp';
import aboutProfessional from '../../../assets/content/about_professional.webp';
import { Link } from '../../../i18n/navigation';
import { ContactFormSection } from '../../home/components/ContactFormSection';
import { Reveal } from '../../motion/Reveal';

const AUDIENCE_KEYS = ['members', 'entrepreneurs', 'companies'] as const;
const AUDIENCE_IMAGES = [aboutMember, aboutProfessional, aboutCompanies] as const;

const WHY_KEYS = ['international', 'card', 'offers', 'catalog', 'connections', 'privacy'] as const;
const WHY_ICONS = [Globe, CreditCard, Star, Search, Handshake, Shield] as const;

export async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <main className="kc-about-page">
      <section className="kc-about-hero" data-section="about-hero">
        <div className="kc-container">
          <Reveal>
            <p className="kc-eyebrow">{t('hero.eyebrow')}</p>
            <h1 className="kc-about-hero-title">{t('hero.title')}</h1>
          </Reveal>
          <Reveal className="kc-about-hero-body" delay={1}>
            <p>{t('hero.text1')}</p>
            <p>{t('hero.text2')}</p>
            <p>{t('hero.text3')}</p>
          </Reveal>
          <Reveal className="kc-about-hero-media" delay={2}>
            <Image
              src={aboutImageOne}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
            />
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
          </Reveal>
        </div>
      </section>

      <section className="kc-section kc-about-audience" data-section="about-audience">
        <div className="kc-container">
          <Reveal className="kc-about-section-heading">
            <p className="kc-eyebrow">{t('audience.eyebrow')}</p>
            <h2>{t('audience.title')}</h2>
          </Reveal>
          <div className="kc-about-audience-grid">
            {AUDIENCE_KEYS.map((key, index) => {
              const img = AUDIENCE_IMAGES[index] ?? aboutMember;
              return (
                <Reveal
                  className="kc-about-audience-card"
                  delay={(index % 3) as 0 | 1 | 2}
                  key={key}
                >
                  <div className="kc-about-audience-media">
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 33vw, 100vw"
                    />
                  </div>
                  <h3>{t(`audience.${key}.title`)}</h3>
                  <p>{t(`audience.${key}.text`)}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kc-section kc-about-why" data-section="about-why">
        <div className="kc-container">
          <Reveal className="kc-about-section-heading">
            <p className="kc-eyebrow">{t('why.eyebrow')}</p>
            <h2>{t('why.title')}</h2>
          </Reveal>
          <div className="kc-about-why-grid">
            {WHY_KEYS.map((key, index) => {
              const Icon = WHY_ICONS[index] ?? Globe;
              return (
                <Reveal
                  className="kc-about-why-item"
                  delay={(index % 3) as 0 | 1 | 2}
                  key={key}
                >
                  <span className="kc-about-why-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{t(`why.${key}.title`)}</h3>
                  <p>{t(`why.${key}.text`)}</p>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="kc-about-why-cta">
            <Link className="kc-button kc-focus-ring" href="/#contact">
              {t('why.cta')}
            </Link>
          </Reveal>
        </div>
      </section>

      <ContactFormSection />
    </main>
  );
}
