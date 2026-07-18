import '@kclub/ui/styles.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminProviders } from './providers';

export const metadata: Metadata = {
  title: 'KYLYVNYK CLUB Admin',
  robots: { index: false, follow: false },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body className="kc-app">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
