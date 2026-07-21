'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export default function AdminNotFound(): ReactNode {
  const router = useRouter();

  return (
    <html lang="en">
      <body className="kc-app">
        <Result
          extra={
            <Button onClick={() => router.push('/')} type="primary">
              Go Home
            </Button>
          }
          status="404"
          subTitle="The page you visited does not exist."
          title="404"
        />
      </body>
    </html>
  );
}
