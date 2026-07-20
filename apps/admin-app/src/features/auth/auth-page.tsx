'use client';

import { Card, Layout, Typography } from 'antd';
import type { ReactNode } from 'react';
import { messages } from '../../messages/en';
import { AuthForm } from './auth-form';

type Mode = 'activate' | 'mfa' | 'sign-in';
export const AuthPage = ({ mode }: Readonly<{ mode: Mode }>): ReactNode => {
  const copy =
    mode === 'activate'
      ? { title: messages.activateTitle, lead: messages.activateLead }
      : mode === 'mfa'
        ? { title: messages.mfaTitle, lead: messages.mfaLead }
        : { title: messages.signInTitle, lead: messages.signInLead };
  return (
    <Layout className="kc-refine-auth">
      <Card className="kc-refine-auth-card">
        <Typography.Text type="secondary">{messages.brand}</Typography.Text>
        <Typography.Title level={2}>{copy.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{copy.lead}</Typography.Paragraph>
        <AuthForm mode={mode} />
      </Card>
    </Layout>
  );
};
