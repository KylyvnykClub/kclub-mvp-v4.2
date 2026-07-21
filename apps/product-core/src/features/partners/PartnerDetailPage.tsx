import { ArrowLeft, BadgePercent, BriefcaseBusiness, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Link } from '../../i18n/navigation';
import { getCountryFlagUrl } from './data';
import type { PartnerPublic } from './repository';

const DEFAULT_HERO =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85';

type PartnerDetailPageProps = Readonly<{
  partner: PartnerPublic;
}>;

export async function PartnerDetailPage({ partner }: PartnerDetailPageProps) {
  const t = await getTranslations('partners');
  const dt = await getTranslations('partners.detail');

  const category = t(`categories.${partner.category}`);
  // If the translation key exists, we can use it, but since country is now a free string,
  // we might want to fallback to the raw code if translation is missing. 
  // For MVP, we can keep the translation lookup as it might be defined.
  // We'll uppercase the first letter or keep it as is if it fails.
  const countryLabel = partner.countryName ?? t(`countries.${partner.country}`);

  return (
    <main className="kc-partner-detail">
      <section className="kc-section">
        <div className="kc-container">
          <nav className="kc-breadcrumbs" aria-label={t('breadcrumbs.label')}>
            <ol>
              <li>
                <Link className="kc-focus-ring" href="/">
                  {t('breadcrumbs.home')}
                </Link>
              </li>
              <li>
                <Link className="kc-focus-ring" href="/partners">
                  {t('breadcrumbs.partners')}
                </Link>
              </li>
              <li aria-current="page">{partner.name}</li>
            </ol>
          </nav>

          <div className="kc-partner-detail-layout">
            <article className="kc-partner-detail-main">
              <div className="kc-partner-detail-meta">
                <span>
                  <BriefcaseBusiness aria-hidden="true" />
                  {category}
                </span>
                <span>
                  <img src={getCountryFlagUrl(partner.country)} alt="" className="kc-partner-flag" aria-hidden="true" width={20} height={15} />
                  {countryLabel}
                </span>
              </div>

              <h1 className="kc-partner-detail-title">{partner.name}</h1>
              <p className="kc-partner-detail-lead">{partner.description}</p>

              <div className="kc-partner-detail-hero">
                <Image
                  src={partner.image || DEFAULT_HERO}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 60vw, 100vw"
                  priority
                />
              </div>

              <div className="kc-partner-detail-body">
                <h2>{dt('about')}</h2>
                <p>{dt('aboutText', { name: partner.name })}</p>

                <h2>{dt('memberBenefit')}</h2>
                <p>{dt('memberBenefitText', { name: partner.name, discount: partner.discountPercent })}</p>

                <h2>{dt('howItWorks')}</h2>
                <p>{dt('howItWorksText')}</p>
              </div>

              <Link className="kc-button kc-focus-ring kc-partner-detail-back" href="/partners">
                <ArrowLeft aria-hidden="true" />
                {dt('backToPartners')}
              </Link>
            </article>

            <aside className="kc-partner-detail-sidebar">
              <div className="kc-partner-detail-card">
                <p className="kc-eyebrow">{dt('companyInfo')}</p>
                <h2 className="kc-partner-detail-card-title">{partner.name}</h2>

                <ul className="kc-partner-detail-facts">
                  <li>
                    <BriefcaseBusiness aria-hidden="true" />
                    <span className="kc-partner-detail-fact-label">{dt('categoryLabel')}</span>
                    <span>{category}</span>
                  </li>
                  <li>
                    <MapPin aria-hidden="true" />
                    <span className="kc-partner-detail-fact-label">{dt('locationLabel')}</span>
                    <span>{countryLabel}</span>
                  </li>
                  <li>
                    <BadgePercent aria-hidden="true" />
                    <span className="kc-partner-detail-fact-label">{dt('discountLabel')}</span>
                    <span>{t('card.discount', { discount: partner.discountPercent })}</span>
                  </li>
                </ul>

                <Link className="kc-button kc-focus-ring kc-partner-detail-cta" href="/#contact">
                  {dt('contactClub')}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
