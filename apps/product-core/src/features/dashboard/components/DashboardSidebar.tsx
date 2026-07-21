'use client';

import { LayoutDashboard, User, BriefcaseBusiness, ArrowLeft, LogOut, X, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link, usePathname } from '../../../i18n/navigation';
import { signOut } from '../../auth/actions';

type SidebarProps = {
  locale: string;
  memberName: string;
  memberInitials: string;
  showBusiness: boolean;
};

const NAV_ITEMS = [
  { href: '/dashboard', key: 'overview', icon: LayoutDashboard, visible: true },
  { href: '/dashboard/profile', key: 'account', icon: User, visible: true },
  { href: '/dashboard/business', key: 'business', icon: BriefcaseBusiness, visible: false },
] as const;

export function DashboardSidebar({
  locale,
  memberName,
  memberInitials,
  showBusiness,
}: SidebarProps) {
  const t = useTranslations('dashboard.nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(locale);
  };

  return (
    <>
      <div className="kc-dashboard-header">
        <Link href="/" className="kc-dashboard-header-brand">
          KYLYVNYK CLUB
        </Link>
        <button
          className="kc-dashboard-burger"
          onClick={() => setOpen(true)}
          aria-label={t('overview')}
        >
          <Menu size={20} />
        </button>
      </div>

      <aside className="kc-sidebar" data-open={open}>
        <div className="kc-sidebar-top">
          <Link href="/" className="kc-sidebar-brand">
            KYLYVNYK CLUB
          </Link>
          <button className="kc-sidebar-close" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="kc-user-info">
          <div className="kc-avatar" data-size="md">
            <span className="kc-avatar-initials">{memberInitials}</span>
          </div>
          <div className="kc-user-info-details">
            <span className="kc-user-info-name">{memberName}</span>
            <span className="kc-user-info-role">Member</span>
          </div>
        </div>

        <nav className="kc-sidebar-nav">
          {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
            if (key === 'business' && !showBusiness) {
              return null;
            }

            const isActive =
              href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
            const label =
              key === 'account'
                ? `${t('profile')} / ${t('settings')}`
                : key === 'business'
                  ? 'Business'
                  : t(key as Parameters<typeof t>[0]);

            return (
              <Link
                key={key}
                href={href}
                className="kc-sidebar-link"
                data-active={isActive}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="kc-sidebar-footer">
          <Link href="/" className="kc-sidebar-link" onClick={() => setOpen(false)}>
            <ArrowLeft size={18} />
            {t('backToSite')}
          </Link>
          <button className="kc-sidebar-link" onClick={handleSignOut}>
            <LogOut size={18} />
            {t('signOut')}
          </button>
        </div>
      </aside>
    </>
  );
}
