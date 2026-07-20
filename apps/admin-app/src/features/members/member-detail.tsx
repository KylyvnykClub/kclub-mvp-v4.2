'use client';

import type { MemberDetailDto } from '@kclub/contracts';
import { Show } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Card, Descriptions, Space, Spin, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';

const statusColor: Record<string, string> = {
  SUBMITTED: 'blue',
  UNDER_REVIEW: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

export const MemberDetail = (): ReactNode => {
  const { query } = useShow<MemberDetailDto>({ resource: 'members' });
  const { data, isLoading } = query;
  const member = data?.data;

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />;
  if (!member) return <Typography.Text type="danger">Member not found.</Typography.Text>;

  return (
    <Show title={`${member.firstName} ${member.lastName}`} resource="members">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Personal information">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="First name">{member.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last name">{member.lastName}</Descriptions.Item>
            <Descriptions.Item label="Display name">
              {member.displayName ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">{member.phone}</Descriptions.Item>
            <Descriptions.Item label="Preferred locale">{member.preferredLocale}</Descriptions.Item>
            <Descriptions.Item label="Supabase user ID">
              <Typography.Text copyable code style={{ fontSize: 12 }}>
                {member.supabaseUserId}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Professional details">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Company">{member.company ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Position">{member.position ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="City">{member.city ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Country">{member.country ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Bio" span={2}>
              {member.bio ?? '—'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {member.application && (
          <Card title="Membership application">
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Status">
                <Tag color={statusColor[member.application.status] ?? 'default'}>
                  {member.application.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Applied">
                {new Date(member.application.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Motivation" span={2}>
                {member.application.motivation ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Referral source" span={2}>
                {member.application.referralSource ?? '—'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        <Card title="System">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Member ID">
              <Typography.Text copyable code style={{ fontSize: 12 }}>
                {member.id}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Registered">
              {new Date(member.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last updated">
              {new Date(member.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Show>
  );
};
