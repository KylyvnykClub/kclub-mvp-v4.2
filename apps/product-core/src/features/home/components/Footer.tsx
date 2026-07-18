import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { ThemeToggle } from '../../theme/ThemeToggle';

export async function Footer() {
  const t = await getTranslations('home.footer');
  return (
    <footer className="kc-footer" data-section="footer">
      <div className="kc-container">
        <div className="kc-footer-inner">
          <div>
            <p className="kc-brand kc-footer-brand">KYLYVNYK CLUB</p>
            <p>{t('tagline')}</p>
          </div>
          <div>
            <h2 className="kc-footer-title">{t('navigate')}</h2>
            <ul className="kc-footer-list">
              <li>
                <a className="kc-footer-link" href="#about">
                  {t('about')}
                </a>
              </li>
              <li>
                <a className="kc-footer-link" href="#faq">
                  {t('faq')}
                </a>
              </li>
              <li>
                <a className="kc-footer-link" href="#contact">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="kc-footer-title">{t('languages')}</h2>
            <ul className="kc-footer-list">
              <li>
                <Link className="kc-footer-link" href="/" locale="en">
                  English
                </Link>
              </li>
              <li>
                <Link className="kc-footer-link" href="/" locale="ru">
                  Русский
                </Link>
              </li>
              <li>
                <Link className="kc-footer-link" href="/" locale="uk">
                  Українська
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="kc-footer-bottom">
          <span>{t('copyright')}</span>
          <div className="kc-cluster">
            <span>{t('status')}</span>
            <ThemeToggle lightLabel={t('theme.light')} darkLabel={t('theme.dark')} />
          </div>
        </div>
      </div>
    </footer>
  );
}
