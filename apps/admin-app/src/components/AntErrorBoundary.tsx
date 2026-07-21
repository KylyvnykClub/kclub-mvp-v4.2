'use client';

import { ErrorBoundary } from '@kclub/ui';
import { Button, Result } from 'antd';
import type { ErrorInfo, ReactNode } from 'react';

type AntErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}>;

export const AntErrorBoundary = ({ children, onError }: AntErrorBoundaryProps) => (
  <ErrorBoundary
    fallback={
      <Result
        extra={
          <Button onClick={() => window.location.reload()} type="primary">
            Retry
          </Button>
        }
        status="error"
        subTitle="Please try again or contact support if the problem persists."
        title="Something went wrong"
      />
    }
    {...(onError !== undefined ? { onError } : {})}
  >
    {children}
  </ErrorBoundary>
);
