'use client';

import { logError } from '@kclub/observability';
import { Button, Result } from 'antd';
import type { ReactNode } from 'react';

type MemberDetailErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function MemberDetailError({ error, reset }: MemberDetailErrorProps): ReactNode {
  logError(error, { scope: 'admin-app.member-detail' });

  return (
    <Result
      extra={
        <Button onClick={reset} type="primary">
          Retry
        </Button>
      }
      status="error"
      subTitle="An error occurred while loading this member."
      title="Member Load Error"
    />
  );
}
