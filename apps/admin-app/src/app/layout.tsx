import '@ant-design/v5-patch-for-react-19';
import '@kclub/ui/styles.css';
import '@refinedev/antd/dist/reset.css';
import 'antd/dist/reset.css';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

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
        <AntdRegistry>
          <Suspense fallback={null}>
            <AdminProviders>{children}</AdminProviders>
          </Suspense>
        </AntdRegistry>
      </body>
    </html>
  );
}
