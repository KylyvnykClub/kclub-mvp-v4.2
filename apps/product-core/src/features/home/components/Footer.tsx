import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { Reveal } from '../../motion/Reveal';
import { ThemeToggle } from '../../theme/ThemeToggle';

export async function Footer() {
  const t = await getTranslations('home.footer');
  return (
    <footer className="kc-footer" data-section="footer">
      <div className="kc-container">
        <Reveal className="kc-footer-inner-wrap">
          <div className="kc-footer-inner">
            <div>
              <p className="kc-brand kc-footer-brand">KYLYVNYK CLUB</p>
              <p>{t('tagline')}</p>
            </div>
            <div>
              <h2 className="kc-footer-title">{t('navigate')}</h2>
              <ul className="kc-footer-list">
                <li>
                  <Link className="kc-footer-link" href="/about">
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/#faq">
                    {t('faq')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/#contact">
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="kc-footer-title">{t('legal_policies')}</h2>
              <ul className="kc-footer-list">
                <li>
                  <Link className="kc-footer-link" href="/legal/terms-of-use">
                    {t('terms-of-use')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/privacy-policy">
                    {t('privacy-policy')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/cookie-policy">
                    {t('cookie-policy')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/refund-policy">
                    {t('refund-policy')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/disclaimer">
                    {t('disclaimer')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="kc-footer-title">{t('legal_rules')}</h2>
              <ul className="kc-footer-list">
                <li>
                  <Link className="kc-footer-link" href="/legal/club-rules">
                    {t('club-rules')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/partner-rules">
                    {t('partner-rules')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/business-introduction-rules">
                    {t('business-introduction-rules')}
                  </Link>
                </li>
                <li>
                  <Link className="kc-footer-link" href="/legal/contact-us">
                    {t('contact-us')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="kc-footer-bottom">
            <span>{t('copyright')}</span>
            <div className="kc-cluster">
              <span>{t('status')}</span>
              <ThemeToggle
                label={t('theme.label')}
                systemLabel={t('theme.system')}
                lightLabel={t('theme.light')}
                darkLabel={t('theme.dark')}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
