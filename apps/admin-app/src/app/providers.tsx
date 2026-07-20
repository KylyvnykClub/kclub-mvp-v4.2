'use client';

import '@ant-design/v5-patch-for-react-19';

import { RefineThemes, useNotificationProvider } from '@refinedev/antd';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import type { ReactNode } from 'react';
import { accessControlProvider, authProvider, dataProvider } from '../refine/providers';
import { ADMIN_RESOURCES } from '../refine/resources';

type AdminProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function AdminProviders({ children }: AdminProvidersProps): ReactNode {
  return (
    <ConfigProvider
      componentSize="middle"
      theme={{
        ...RefineThemes.Blue,
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <AntdApp>
        <AdminRefineProvider>{children}</AdminRefineProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

const AdminRefineProvider = ({ children }: AdminProvidersProps): ReactNode => {
  const notificationProvider = useNotificationProvider();

  return (
    <Refine
      accessControlProvider={accessControlProvider}
      authProvider={authProvider}
      dataProvider={dataProvider}
      notificationProvider={notificationProvider}
      routerProvider={routerProvider}
      resources={ADMIN_RESOURCES}
      options={{
        disableTelemetry: true,
        syncWithLocation: true,
        title: { text: 'KYLYVNYK Admin' },
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
};
