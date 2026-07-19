'use client';

import Image, { type StaticImageData } from 'next/image';
import { type KeyboardEvent, useRef, useState } from 'react';

import introductionsImage from '../../../assets/content/princips_1.webp';
import circlesImage from '../../../assets/content/princips_2.webp';
import advisoryImage from '../../../assets/content/princips_3.webp';
import gatheringsImage from '../../../assets/content/princips_4.webp';
import stewardshipImage from '../../../assets/content/princips_5.webp';

type OfferingKey = 'introductions' | 'circles' | 'advisory' | 'gatherings' | 'stewardship';

export type OfferingPanelItem = Readonly<{
  key: OfferingKey;
  number: number;
  title: string;
  lead: string;
  linkLabel: string;
}>;

const IMAGES: Readonly<Record<OfferingKey, StaticImageData>> = {
  introductions: introductionsImage,
  circles: circlesImage,
  advisory: advisoryImage,
  gatherings: gatheringsImage,
  stewardship: stewardshipImage,
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const;

type OfferingPanelsProps = Readonly<{
  items: ReadonlyArray<OfferingPanelItem>;
  interactionHint: string;
}>;

export function OfferingPanels({ items, interactionHint }: OfferingPanelsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = previewIndex ?? selectedIndex;

  const selectAndFocus = (index: number) => {
    setPreviewIndex(null);
    setSelectedIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        nextIndex = index;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectAndFocus(nextIndex);
  };

  return (
    <div className="kc-offerings-shell">
      <div
        className="kc-offerings-tabs"
        data-active={activeIndex}
        role="tablist"
        aria-label={interactionHint}
        onPointerLeave={() => setPreviewIndex(null)}
      >
        {items.map((item, index) => {
          const active = activeIndex === index;
          const selected = selectedIndex === index;
          const roman = ROMAN_NUMERALS[index];

          return (
            <article
              className="kc-offerings-panel"
              data-state={active ? 'active' : 'inactive'}
              key={item.key}
            >
              <button
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                className="kc-offerings-tab kc-focus-ring"
                type="button"
                id={`offering-tab-${item.key}`}
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectAndFocus(index)}
                onFocus={() => setPreviewIndex(index)}
                onPointerEnter={() => setPreviewIndex(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className="kc-offerings-spine" aria-hidden={active}>
                  <span className="kc-offerings-roman">{roman}</span>
                  <span className="kc-offerings-vertical-title">{item.title}</span>
                  <span className="kc-offerings-volume">
                    KC · {String(item.number).padStart(2, '0')}
                  </span>
                </span>

                <Image
                  className="kc-offerings-image"
                  src={IMAGES[item.key]}
                  alt=""
                  fill
                  sizes="(min-width: 48rem) 60vw, 100vw"
                />
                <span className="kc-offerings-veil" aria-hidden="true" />
                <span className="kc-offerings-copy">
                  <span className="kc-offerings-kicker">
                    {roman} · {item.linkLabel}
                  </span>
                  <span className="kc-offerings-title">{item.title}</span>
                  <span className="kc-offerings-lead">{item.lead}</span>
                </span>
              </button>
            </article>
          );
        })}
      </div>

      <div className="kc-offerings-accordion">
        {items.map((item, index) => {
          const open = selectedIndex === index;
          const panelId = `offering-mobile-panel-${item.key}`;
          const roman = ROMAN_NUMERALS[index];

          return (
            <article
              className="kc-offerings-accordion-item"
              data-state={open ? 'open' : 'closed'}
              key={item.key}
            >
              <h3 className="kc-offerings-accordion-heading">
                <button
                  className="kc-offerings-accordion-trigger kc-focus-ring"
                  type="button"
                  id={`offering-mobile-trigger-${item.key}`}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span className="kc-offerings-accordion-number">{roman}</span>
                  <span>{item.title}</span>
                  <span className="kc-offerings-accordion-icon" aria-hidden="true">
                    ⌄
                  </span>
                </button>
              </h3>
              {open ? (
                <div
                  className="kc-offerings-accordion-content"
                  id={panelId}
                  role="region"
                  aria-labelledby={`offering-mobile-trigger-${item.key}`}
                >
                  <div className="kc-offerings-accordion-media">
                    <Image src={IMAGES[item.key]} alt="" fill sizes="100vw" />
                    <span className="kc-offerings-veil" aria-hidden="true" />
                  </div>
                  <div className="kc-offerings-accordion-copy">
                    <p className="kc-offerings-kicker">
                      {roman} · {item.linkLabel}
                    </p>
                    <p className="kc-offerings-lead">{item.lead}</p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="kc-offerings-hint">— {interactionHint}</p>
    </div>
  );
}
