'use client';

import type { PartnerDto } from '@kclub/contracts';
import { Show } from '@refinedev/antd';
import { useGo, useShow, useUpdate } from '@refinedev/core';
import {
  Button, Card, Descriptions, Image, InputNumber, message, Select, Space, Spin, Tag, Typography, Switch
} from 'antd';
import type { ReactNode } from 'react';
import { COUNTRY_OPTIONS, countryCodeToEmoji } from './countries';

const CATEGORIES = ['ADVISORY', 'FINANCE', 'LEGAL', 'TECHNOLOGY'] as const;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  PAST_DUE: 'orange',
  CANCELED: 'red',
  EXPIRED: 'volcano',
  NONE: 'default',
};

export const PartnerDetail = (): ReactNode => {
  const go = useGo();
  const { query } = useShow<PartnerDto>({ resource: 'partners' });
  const { data, isLoading } = query;
  const partner = data?.data;
  const { mutate: updatePartner, isLoading: isSaving, isPending } = useUpdate() as any;
  const saving = isSaving || isPending;

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />;
  if (!partner) return <Typography.Text type="danger">Partner not found.</Typography.Text>;

  const patchField = (values: Partial<PartnerDto>) => {
    updatePartner(
      { resource: 'partners', id: partner.id, values },
      {
        onSuccess: () => query.refetch(),
        onError: (error: any) => message.error(error instanceof Error ? error.message : 'Failed to save.'),
      },
    );
  };

  return (
    <Show
      title={partner.slug}
      resource="partners"
      headerButtons={[
        <Button key="edit" type="primary" onClick={() => go({ to: `/partners/${partner.id}/edit`, type: 'push' })}>
          Edit
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Overview">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="ID">
              <Typography.Text copyable code style={{ fontSize: 12 }}>{partner.id}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Slug">{partner.slug}</Descriptions.Item>
            <Descriptions.Item label="Category">
              <Select
                value={partner.category}
                disabled={saving}
                style={{ minWidth: 160 }}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                onChange={(value) => patchField({ category: value })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              <Select
                showSearch
                optionFilterProp="label"
                value={partner.country}
                disabled={saving}
                style={{ minWidth: 160 }}
                options={COUNTRY_OPTIONS.map((c) => ({
                  label: `${countryCodeToEmoji(c.code)} ${c.name}`,
                  value: c.code,
                }))}
                onChange={(value) => patchField({ country: value })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="City">{partner.city ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Phone">{partner.phone ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Owner">
              {partner.ownerId ? (
                <a href={`/members/${partner.ownerId}`} onClick={(e) => {
                  e.preventDefault();
                  go({ to: `/members/${partner.ownerId}`, type: 'push' });
                }}>
                  {partner.ownerName ?? partner.ownerId}
                </a>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              <InputNumber
                value={partner.discountPercent}
                disabled={saving}
                min={0} max={100}
                addonAfter="%"
                onChange={(value) => { if (value !== null) patchField({ discountPercent: value }); }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Featured Top">
              <Switch
                checked={partner.featuredTop}
                disabled={saving}
                onChange={(checked) => patchField({ featuredTop: checked })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Featured Recommended">
              <Switch
                checked={partner.featuredRecommended}
                disabled={saving}
                onChange={(checked) => patchField({ featuredRecommended: checked })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Active">
              {partner.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Sort order">{partner.sortOrder}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Billing">
          {partner.subscriptionStatus === 'NONE' ? (
            <Typography.Text type="secondary">No subscription</Typography.Text>
          ) : (
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[partner.subscriptionStatus] ?? 'default'}>
                  {partner.subscriptionStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Stripe Customer">{partner.stripeCustomerId ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Subscription ID">{partner.stripeSubscriptionId ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Price ID">{partner.stripePriceId ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Period Start">
                {partner.currentPeriodStart ? new Date(partner.currentPeriodStart).toLocaleDateString() : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Period End">
                {partner.currentPeriodEnd ? new Date(partner.currentPeriodEnd).toLocaleDateString() : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Cancel at Period End">
                {partner.cancelAtPeriodEnd ? <Tag color="orange">Yes</Tag> : 'No'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="Image">
          <Image src={partner.image} alt={partner.slug} width={320}
            style={{ borderRadius: 8, objectFit: 'cover' }} />
        </Card>

        <Card title="Translations">
          {(['en', 'ru', 'uk'] as const).map((locale) => (
            <Card key={locale} type="inner" title={locale.toUpperCase()} style={{ marginBottom: 12 }}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Name">{partner.translations[locale]?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Description">{partner.translations[locale]?.description ?? '—'}</Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </Card>

        <Card title="System">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Created">{new Date(partner.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Updated">{new Date(partner.updatedAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Show>
  );
};
