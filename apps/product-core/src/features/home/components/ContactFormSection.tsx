import { getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { ContactForm } from './ContactForm';
import { SectionHeading } from './SectionHeading';

const BULLET_KEYS = ['response', 'privacy', 'senior'] as const;

export async function ContactFormSection() {
  const t = await getTranslations('home.contact');
  return (
    <section className="kc-section" id="contact" data-section="contact">
      <div className="kc-container kc-contact-grid">
        <Reveal>
          <div className="kc-contact-lede">
            <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
            <ul className="kc-contact-bullets">
              {BULLET_KEYS.map((key) => (
                <li key={key}>
                  <span className="kc-contact-bullet-title">
                    {t(`bullets.${key}.title`)}
                  </span>
                  <span className="kc-contact-bullet-text">
                    {t(`bullets.${key}.text`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
