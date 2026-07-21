import '@kclub/ui/styles.css';

import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { routing } from '../../i18n/routing';
import { Footer } from '../../features/home/components/Footer';
import { Header } from '../../features/home/components/Header';
import { AppThemeProvider } from '../../features/theme/AppThemeProvider';

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kylyvnyk.club';

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'home.meta' });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('title'), template: `%s | ${t('siteName')}` },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ru: '/ru', uk: '/uk', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('title'),
      description: t('description'),
      locale,
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="kc-app" suppressHydrationWarning>
        <NextIntlClientProvider>
          <AppThemeProvider>
            <Header />
            {children}
            <Footer />
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
