import { ArrowRight, BadgePercent, BriefcaseBusiness } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

import switzerlandFlag from '../../assets/flags.svg/ch.svg';
import germanyFlag from '../../assets/flags.svg/de.svg';
import polandFlag from '../../assets/flags.svg/pl.svg';
import ukraineFlag from '../../assets/flags.svg/ua.svg';
import { Link } from '../../i18n/navigation';
import type { PartnerCountry } from './data';

const PARTNER_COUNTRY_FLAGS = {
  germany: germanyFlag,
  poland: polandFlag,
  switzerland: switzerlandFlag,
  ukraine: ukraineFlag,
} satisfies Record<PartnerCountry, StaticImageData>;

type PartnerCardProps = Readonly<{
  image: string;
  name: string;
  description: string;
  category: string;
  country: PartnerCountry;
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
  const countryFlag = PARTNER_COUNTRY_FLAGS[country];

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
            <Image src={countryFlag} alt="" className="kc-partner-flag" aria-hidden="true" />
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
