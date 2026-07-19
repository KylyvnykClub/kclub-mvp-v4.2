'use client';

import { useEffect, useRef, useState } from 'react';

type Metric = Readonly<{ label: string; suffix: string }>;
type Year = Readonly<{ key: string; label: string; values: readonly number[] }>;

type YearlyStatsProps = Readonly<{
  years: readonly Year[];
  metrics: readonly Metric[];
  yearsLabel: string;
}>;

const ANIMATION_MS = 600;

export function YearlyStats({ years, metrics, yearsLabel }: YearlyStatsProps) {
  const [selected, setSelected] = useState(0);
  const [displayed, setDisplayed] = useState<readonly number[]>(years[0]?.values ?? []);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const selectYear = (index: number) => {
    const target = years[index]?.values;
    if (!target) {
      return;
    }
    setSelected(index);
    cancelAnimationFrame(frame.current);
    const from = displayed;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / ANIMATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayed(from.map((value, i) => Math.round(value + ((target[i] ?? value) - value) * eased)));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };

  return (
    <div className="kc-stat-timeline">
      <div className="kc-stat-timeline-grid">
        {metrics.map((metric, i) => (
          <article className="kc-stat" key={metric.label}>
            <p className="kc-stat-value">
              {displayed[i]}
              {metric.suffix}
            </p>
            <p className="kc-stat-metric-label">{metric.label}</p>
          </article>
        ))}
      </div>
      <div className="kc-cluster kc-stat-years" role="group" aria-label={yearsLabel}>
        {years.map((year, i) => (
          <button
            className="kc-year-pill kc-focus-ring"
            type="button"
            key={year.key}
            aria-pressed={selected === i}
            onClick={() => selectYear(i)}
          >
            {year.label}
          </button>
        ))}
      </div>
      <div className="kc-ruler" aria-hidden="true" />
    </div>
  );
}
