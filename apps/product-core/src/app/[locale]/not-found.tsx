'use client';

import { DataState } from '@kclub/ui';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

export default function LocaleNotFound(): ReactNode {
  const t = useTranslations();

  return (
    <DataState tone="neutral" title={t('errors.notFoundTitle')} message={t('errors.notFoundMessage')}>
      <a className="kc-button" href={`/${t('locale')}`}>
        {t('errors.home')}
      </a>
    </DataState>
  );
}
