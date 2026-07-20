import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '../../../i18n/routing';

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="kc-auth-layout">
      <div className="kc-auth-card">{children}</div>
    </div>
  );
}
