import { ArrowRight, BadgePercent, BriefcaseBusiness } from 'lucide-react';
import Image from 'next/image';

import { Link } from '../../i18n/navigation';
import { getCountryFlagUrl } from './data';

type PartnerCardProps = Readonly<{
  image: string;
  name: string;
  description: string;
  category: string;
  country: string;
  countryLabel: string;
  discountText: string;
  detailsLabel: string;
  href: string;
}>;

export function PartnerCard({
  image,
  name,
  description,
  category,
  country,
  countryLabel,
  discountText,
  detailsLabel,
  href,
}: PartnerCardProps) {
  return (
    <article className="kc-partner-card">
      <div className="kc-partner-media">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 50vw, 100vw"
        />
        <span className="kc-partner-discount">
          <BadgePercent aria-hidden="true" />
          {discountText}
        </span>
      </div>
      <div className="kc-partner-content">
        <div className="kc-partner-meta">
          <span>
            <BriefcaseBusiness aria-hidden="true" />
            {category}
          </span>
          <span>
            <img src={getCountryFlagUrl(country)} alt="" className="kc-partner-flag" aria-hidden="true" width={20} height={15} />
            {countryLabel}
          </span>
        </div>
        <h3 className="kc-partner-title">{name}</h3>
        <p className="kc-partner-description">{description}</p>
        <div className="kc-partner-action-wrap">
          <Link className="kc-button kc-focus-ring kc-partner-action" data-tone="ghost" href={href}>
            {detailsLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
