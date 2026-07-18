import { getTranslations } from 'next-intl/server';
import { ContactForm } from './ContactForm';
import { SectionHeading } from './SectionHeading';

export async function ContactFormSection() {
  const t = await getTranslations('home.contact');
  return (
    <section className="kc-section" id="contact" data-section="contact">
      <div className="kc-container kc-contact-grid">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <ContactForm />
      </div>
    </section>
  );
}
