import { getTranslations } from 'next-intl/server';

import { HeaderScrollSensor } from '../../motion/HeaderScrollSensor';
import { Link } from '../../../i18n/navigation';
import { MobileNav } from './MobileNav';
import { PromoBar } from './PromoBar';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { createClient } from '../../../lib/supabase/server';

export async function Header() {
  const t = await getTranslations('home');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const links = [
    { href: '/about', label: t('nav.about') },
    { href: '/partners', label: t('nav.partners') },
    { href: '/#offerings', label: t('nav.offerings') },
    { href: '/#how-it-works', label: t('nav.how') },
    { href: '/#faq', label: t('nav.faq') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  return (
    <>
      <HeaderScrollSensor />
      <PromoBar
        label={t('header.promo.label')}
        message={t('header.promo.message')}
        dismissLabel={t('header.promo.dismiss')}
      />
      <header className="kc-header" data-section="header">
        <div className="kc-container kc-header-inner">
          <Link className="kc-brand kc-focus-ring" href="/" aria-label={t('nav.homeLabel')}>
            KYLYVNYK CLUB
          </Link>
          <nav className="kc-nav" aria-label={t('nav.label')}>
            {links.map((link) => (
              <Link className="kc-nav-link kc-focus-ring" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="kc-header-actions">
            <ThemeToggle
              label={t('theme.label')}
              systemLabel={t('theme.system')}
              lightLabel={t('theme.light')}
              darkLabel={t('theme.dark')}
            />
            {user ? (
              <Link className="kc-button kc-focus-ring kc-header-cta" data-size="sm" href="/dashboard">
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link className="kc-button kc-focus-ring kc-header-cta" data-size="sm" href="/auth/login">
                {t('nav.signIn')}
              </Link>
            )}
            <MobileNav links={links} label={t('nav.menu')} closeLabel={t('nav.close')} />
          </div>
        </div>
      </header>
    </>
  );
}
