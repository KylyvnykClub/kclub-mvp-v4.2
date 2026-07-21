import { getLocale, getTranslations } from 'next-intl/server';

import { Reveal } from '../../motion/Reveal';
import { listPartners } from '../../partners/repository';
import { PartnerCard } from '../../partners/PartnerCard';
import { SectionHeading } from './SectionHeading';

export async function Partners() {
  const locale = await getLocale();
  const t = await getTranslations('home.partners');
  const partnerT = await getTranslations('partners');
  const partners = await listPartners(locale);

  return (
    <section className="kc-section" id="partners" data-section="partners">
      <div className="kc-container">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </Reveal>
        <div className="kc-partners-grid">
          {partners.slice(0, 3).map((partner, index) => {
            const delay = (index + 1) as 1 | 2 | 3;

            return (
              <Reveal key={partner.slug} delay={delay}>
                <PartnerCard
                  image={partner.image}
                  name={partner.name}
                  description={partner.description}
                  category={partnerT(`categories.${partner.category}`)}
                  country={partner.country}
                  countryLabel={partnerT(`countries.${partner.country}`)}
                  discountText={partnerT('card.discount', {
                    discount: partner.discountPercent,
                  })}
                  detailsLabel={t('details')}
                  href={`/partners/${partner.slug}`}
                />
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
