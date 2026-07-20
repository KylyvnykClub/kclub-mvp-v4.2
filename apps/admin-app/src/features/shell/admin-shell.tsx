'use client';

import type { StaffSessionDto } from '@kclub/contracts';
import { DashboardOutlined } from '@ant-design/icons';
import { ThemedLayout, ThemedTitle } from '@refinedev/antd';
import { useGetIdentity } from '@refinedev/core';
import { Layout, Space, Tag, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { messages } from '../../messages/en';
import { LogoutButton } from './logout-button';

export const AdminShell = ({
  children,
  session,
}: Readonly<{ children: ReactNode; session: StaffSessionDto }>) => (
  <AdminShellContent session={session}>{children}</AdminShellContent>
);

const AdminShellContent = ({
  children,
  session,
}: Readonly<{ children: ReactNode; session: StaffSessionDto }>): ReactNode => {
  const { data: identity } = useGetIdentity<StaffSessionDto['staff']>();
  const staff = identity ?? session.staff;

  return (
    <ThemedLayout Header={() => <AdminHeader staff={staff} />} Title={AdminTitle}>
      {children}
    </ThemedLayout>
  );
};

const AdminTitle = ({ collapsed }: Readonly<{ collapsed: boolean }>): ReactNode => (
  <ThemedTitle collapsed={collapsed} icon={<DashboardOutlined />} text="KCLUB" />
);

const AdminHeader = ({ staff }: Readonly<{ staff: StaffSessionDto['staff'] }>): ReactNode => {
  const { token } = theme.useToken();

  return (
    <Layout.Header
      style={{
        alignItems: 'center',
        background: token.colorBgElevated,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        gap: token.marginMD,
        height: 56,
        justifyContent: 'space-between',
        paddingInline: token.paddingLG,
      }}
    >
      <Typography.Text strong>{messages.brand}</Typography.Text>
      <Space size="middle" wrap>
        <Typography.Text type="secondary">{staff.maskedPhone}</Typography.Text>
        <Tag color="blue">{staff.role}</Tag>
        <LogoutButton />
      </Space>
    </Layout.Header>
  );
};
