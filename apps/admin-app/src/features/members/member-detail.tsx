'use client';

import type { MemberDetailDto, MemberUpdateInputDto } from '@kclub/contracts';
import { Show } from '@refinedev/antd';
import { useShow, useUpdate } from '@refinedev/core';
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

/**
 * Local form value shape — uses `string | undefined` for optional fields so
 * Ant Design Form and exactOptionalPropertyTypes don't conflict.
 */
type MemberFormValues = {
  firstName: string;
  lastName: string;
  displayName: string | undefined;
  company: string | undefined;
  position: string | undefined;
  bio: string | undefined;
  city: string | undefined;
  country: string | undefined;
  preferredLocale: string;
};

const { Text } = Typography;

const applicationStatusColor: Record<string, string> = {
  SUBMITTED: 'blue',
  UNDER_REVIEW: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

const cardStatusColor: Record<string, string> = {
  ACTIVE: 'green',
  REVOKED: 'red',
  EXPIRED: 'default',
};

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English (en)' },
  { value: 'uk', label: 'Ukrainian (uk)' },
  { value: 'ru', label: 'Russian (ru)' },
];

export const MemberDetail = (): ReactNode => {
  const { message } = App.useApp();
  const [form] = Form.useForm<MemberFormValues>();

  const { query } = useShow<MemberDetailDto>({ resource: 'members' });
  const { data, isLoading } = query;
  const member = data?.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutate: update, isLoading: isSaving } = useUpdate() as any;

  // Populate form whenever member data loads or refreshes
  useEffect(() => {
    if (member) {
      form.setFieldsValue({
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName ?? undefined,
        company: member.company ?? undefined,
        position: member.position ?? undefined,
        bio: member.bio ?? undefined,
        city: member.city ?? undefined,
        country: member.country ?? undefined,
        preferredLocale: member.preferredLocale,
      } satisfies MemberFormValues);
    }
  }, [member, form]);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />;
  if (!member) return <Text type="danger">Member not found.</Text>;

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        // Convert empty strings from allowClear inputs to null.
        // firstName / lastName are required fields so .trim() returns string.
        const payload: MemberUpdateInputDto = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          displayName: values.displayName?.trim() || null,
          company: values.company?.trim() || null,
          position: values.position?.trim() || null,
          bio: values.bio?.trim() || null,
          city: values.city?.trim() || null,
          country: values.country?.trim() || null,
          preferredLocale: values.preferredLocale,
        };
        update(
          { resource: 'members', id: member.id, values: payload },
          {
            onSuccess: () => {
              void message.success('Member updated.');
              void query.refetch();
            },
            onError: (err: unknown) => {
              void message.error(
                err instanceof Error ? err.message : 'Failed to save changes.',
              );
            },
          },
        );
      })
      .catch(() => {
        void message.warning('Please fix the validation errors before saving.');
      });
  };

  return (
    <Show
      title={`${member.firstName} ${member.lastName}`}
      resource="members"
      headerButtons={() => (
        <Space>
          <Button onClick={() => form.resetFields()} disabled={isSaving}>
            Reset
          </Button>
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        </Space>
      )}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Form form={form} layout="vertical">
          {/* Personal Information */}
          <Card title="Personal information" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[{ required: true, whitespace: true, message: 'First name is required' }]}
                >
                  <Input placeholder="First name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[{ required: true, whitespace: true, message: 'Last name is required' }]}
                >
                  <Input placeholder="Last name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Display name" name="displayName">
                  <Input placeholder="Display name (optional)" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Preferred locale" name="preferredLocale">
                  <Select options={LOCALE_OPTIONS} />
                </Form.Item>
              </Col>

              {/* Phone — read-only, outside Form.Item, never submitted */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    Phone{' '}
                    <Tag color="default" style={{ fontSize: 11, marginLeft: 4 }}>
                      read-only
                    </Tag>
                  </label>
                  <Text copyable code style={{ fontSize: 14 }}>
                    {member.phone}
                  </Text>
                </div>
              </Col>

              {/* Supabase UID — read-only */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    Supabase user ID{' '}
                    <Tag color="default" style={{ fontSize: 11, marginLeft: 4 }}>
                      read-only
                    </Tag>
                  </label>
                  <Text copyable code style={{ fontSize: 12 }}>
                    {member.supabaseUserId}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Professional Details */}
          <Card title="Professional details">
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Company" name="company">
                  <Input placeholder="Company (optional)" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Position" name="position">
                  <Input placeholder="Position (optional)" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="City" name="city">
                  <Input placeholder="City (optional)" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Country" name="country">
                  <Input placeholder="Country (optional)" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Bio" name="bio">
                  <Input.TextArea rows={3} placeholder="Bio (optional)" allowClear />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* Club Card — read-only section, outside the form */}
        <Card title="Club card">
          {member.activeCard ? (
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Card number">
                <Text copyable code style={{ fontSize: 13 }}>
                  {member.activeCard.cardNumber}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Public ID">
                <Text copyable code style={{ fontSize: 13 }}>
                  {member.activeCard.publicId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tier">
                {member.activeCard.tier}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={cardStatusColor[member.activeCard.status] ?? 'default'}>
                  {member.activeCard.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Issued at">
                {new Date(member.activeCard.issuedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Expires at">
                {new Date(member.activeCard.expiresAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">No active club card for this member.</Text>
          )}
        </Card>

        {/* Membership Application — read-only */}
        {member.application && (
          <Card title="Membership application">
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Status">
                <Tag color={applicationStatusColor[member.application.status] ?? 'default'}>
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

        {/* System */}
        <Card title="System">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Member ID">
              <Text copyable code style={{ fontSize: 12 }}>
                {member.id}
              </Text>
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
