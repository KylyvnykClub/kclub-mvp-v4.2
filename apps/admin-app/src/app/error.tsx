'use client';

import { logError } from '@kclub/observability';
import { Button, Result } from 'antd';
import type { ReactNode } from 'react';

type AdminErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function AdminError({ error, reset }: AdminErrorProps): ReactNode {
  logError(error, { scope: 'admin-app.error' });

  return (
    <Result
      extra={
        <Button onClick={reset} type="primary">
          Retry
        </Button>
      }
      status="error"
      subTitle="Please try again or contact support if the problem persists."
      title="Something went wrong"
    />
  );
}
