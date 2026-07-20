'use client';

import type { StaffProfileDto } from '@kclub/contracts';
import { useGetIdentity } from '@refinedev/core';
import { Card, Descriptions, Space, Tag, Typography } from 'antd';
import { messages } from '../../messages/en';

export const AdminOverview = ({ staff }: Readonly<{ staff: StaffProfileDto }>) => {
  const { data: identity } = useGetIdentity<StaffProfileDto>();
  const activeStaff = identity ?? staff;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Typography.Text type="secondary">{messages.overview}</Typography.Text>
        <Typography.Title level={2}>{messages.dashboardTitle}</Typography.Title>
        <Typography.Paragraph type="secondary">{messages.dashboardLead}</Typography.Paragraph>
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Staff">{activeStaff.maskedPhone}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color="blue">{activeStaff.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="MFA">
            <Tag color={activeStaff.mfaEnabled ? 'green' : 'orange'}>
              {activeStaff.mfaEnabled ? 'Enabled' : 'Pending'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={messages.permissionsTitle}>
        <Space wrap>
          {activeStaff.permissions.map((permission) => (
            <Tag key={permission}>{permission}</Tag>
          ))}
        </Space>
      </Card>
    </Space>
  );
};
