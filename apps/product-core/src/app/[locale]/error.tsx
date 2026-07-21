'use client';

import { logError } from '@kclub/observability';
import { DataState } from '@kclub/ui';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type LocaleErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function LocaleError({ error, reset }: LocaleErrorProps): ReactNode {
  const t = useTranslations();

  logError(error, { scope: 'product-core.locale-error' });

  return (
    <DataState
      tone="error"
      title={t('errors.title')}
      message={t('errors.generic')}
    >
      <button className="kc-button" onClick={reset} type="button">
        {t('errors.retry')}
      </button>
    </DataState>
  );
}
