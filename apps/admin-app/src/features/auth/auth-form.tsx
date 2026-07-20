'use client';

import { useLogin } from '@refinedev/core';
import { Alert, Button, Card, Form, Input, List, QRCode, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { messages } from '../../messages/en';
import type { StaffActivationAuthResponse, StaffAuthLoginParams } from '../../refine/providers';

type Mode = 'activate' | 'mfa' | 'sign-in';
type ActivationResult = Readonly<{
  otpauthUri: string;
  qrCodeDataUrl: string;
  recoveryCodes: readonly string[];
}>;
type StaffAuthFormValues = Readonly<{
  code?: string;
  inviteToken?: string;
  password?: string;
  phone?: string;
}>;

export const AuthForm = ({ mode }: Readonly<{ mode: Mode }>): ReactNode => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [activation, setActivation] = useState<ActivationResult>();
  const [awaitingMfa, setAwaitingMfa] = useState(mode === 'mfa');
  const { mutate: login, isPending } = useLogin<StaffAuthLoginParams>({
    mutationOptions: {
      onSuccess: (response) => {
        if (!response.success) {
          setError(messages.genericError);
          return;
        }
        if (response.redirectTo !== undefined) {
          router.replace(response.redirectTo);
          router.refresh();
          return;
        }
        const activationResponse = response as StaffActivationAuthResponse;
        if (activationResponse.activation !== undefined) {
          setActivation(activationResponse.activation);
          setAwaitingMfa(true);
          return;
        }
        if (mode === 'sign-in') setAwaitingMfa(true);
      },
      onError: () => setError(messages.genericError),
    },
  });

  const submit = (values: StaffAuthFormValues): void => {
    setError(undefined);
    if (awaitingMfa) {
      login({ mode: 'mfa', code: String(values.code ?? '') });
      return;
    }
    if (mode === 'activate')
      login({
        mode,
        inviteToken: String(values.inviteToken ?? ''),
        password: String(values.password ?? ''),
      });
    if (mode === 'sign-in')
      login({ mode, phone: String(values.phone ?? ''), password: String(values.password ?? '') });
    if (mode === 'mfa') login({ mode, code: String(values.code ?? '') });
  };

  const mfaForm = (lead: string): ReactNode => (
    <Form<StaffAuthFormValues> layout="vertical" requiredMark={false} onFinish={submit}>
      <Alert message={messages.passwordVerified} description={lead} type="success" showIcon />
      <Form.Item name="code" label={messages.mfaCode} rules={[{ required: true }]}>
        <Input inputMode="numeric" autoComplete="one-time-code" autoFocus />
      </Form.Item>
      {error === undefined ? null : (
        <Form.Item>
          <Alert message={error} type="error" showIcon />
        </Form.Item>
      )}
      <Button type="primary" htmlType="submit" block loading={isPending}>
        {messages.verify}
      </Button>
    </Form>
  );

  if (activation !== undefined)
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message={messages.recoveryTitle}
          description={messages.recoveryLead}
          type="success"
          showIcon
        />
        <Card>
          <Space direction="vertical" size="middle" align="center" style={{ width: '100%' }}>
            <QRCode value={activation.otpauthUri} size={220} />
            <Typography.Text code copyable>
              {activation.otpauthUri}
            </Typography.Text>
          </Space>
        </Card>
        <List
          bordered
          dataSource={[...activation.recoveryCodes]}
          renderItem={(code) => (
            <List.Item>
              <Typography.Text code copyable>
                {code}
              </Typography.Text>
            </List.Item>
          )}
        />
        {mfaForm(messages.activationMfaLead)}
      </Space>
    );

  if (awaitingMfa) return mfaForm(messages.mfaLead);

  return (
    <Form<StaffAuthFormValues> layout="vertical" requiredMark={false} onFinish={submit}>
      {mode === 'sign-in' ? (
        <>
          <Form.Item name="phone" label={messages.phone} rules={[{ required: true }]}>
            <Input autoComplete="username" placeholder="+12025550123" />
          </Form.Item>
          <Form.Item
            name="password"
            label={messages.password}
            rules={[{ required: true, min: 12 }]}
          >
            <Input type="password" autoComplete="current-password" />
          </Form.Item>
        </>
      ) : null}
      {mode === 'activate' ? (
        <>
          <Form.Item name="inviteToken" label={messages.inviteToken} rules={[{ required: true }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            label={messages.password}
            extra={messages.passwordHint}
            rules={[{ required: true, min: 12 }]}
          >
            <Input type="password" autoComplete="new-password" />
          </Form.Item>
        </>
      ) : null}
      {mode === 'mfa' ? (
        <Form.Item name="code" label={messages.mfaCode} rules={[{ required: true }]}>
          <Input inputMode="numeric" autoComplete="one-time-code" />
        </Form.Item>
      ) : null}
      {error === undefined ? null : (
        <Form.Item>
          <Alert message={error} type="error" showIcon />
        </Form.Item>
      )}
      <Button type="primary" htmlType="submit" block loading={isPending}>
        {mode === 'activate'
          ? messages.activate
          : mode === 'mfa'
            ? messages.verify
            : messages.signIn}
      </Button>
    </Form>
  );
};
