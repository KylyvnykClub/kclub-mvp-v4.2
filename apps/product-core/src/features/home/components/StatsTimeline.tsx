import { getTranslations } from 'next-intl/server';

import { SectionHeading } from './SectionHeading';
import { YearlyStats } from './YearlyStats';

const METRIC_KEYS = ['members', 'cities', 'intros', 'events'] as const;
const METRIC_SUFFIXES = ['+', '', '+', ''];

// Placeholder figures for the MVP preview — replace with verified club data.
const YEARS = [
  { key: '2023', label: '2023', values: [24, 3, 40, 6] },
  { key: '2024', label: '2024', values: [61, 7, 150, 18] },
  { key: '2025', label: '2025', values: [118, 12, 420, 36] },
  { key: '2026', label: '2026', values: [180, 18, 800, 60] },
];

export async function StatsTimeline() {
  const t = await getTranslations('home.statsTimeline');
  const metrics = METRIC_KEYS.map((key, i) => ({
    label: t(`metrics.${key}`),
    suffix: METRIC_SUFFIXES[i] ?? '',
  }));
  return (
    <section className="kc-section" data-section="stats-timeline" aria-label={t('label')}>
      <div className="kc-container kc-stack">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <YearlyStats years={YEARS} metrics={metrics} yearsLabel={t('yearsLabel')} />
        <p className="kc-stat-note">{t('note')}</p>
      </div>
    </section>
  );
}
