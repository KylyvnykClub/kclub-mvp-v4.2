import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { routing } from '../../../../i18n/routing';
import { Link } from '../../../../i18n/navigation';
import { RegisterForm } from '../../../../features/auth/components/RegisterForm';

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return {
    title: t('title'),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return (
    <>
      <div className="kc-auth-header">
        <Link href="/" className="kc-auth-brand">
          KYLYVNYK CLUB
        </Link>
        <h1 className="kc-auth-title">{t('title')}</h1>
        <p className="kc-auth-lead">{t('lead')}</p>
      </div>
      <RegisterForm locale={locale} />
    </>
  );
}
