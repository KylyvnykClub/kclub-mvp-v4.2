'use client';

import Image, { type StaticImageData } from 'next/image';
import { type KeyboardEvent, useRef, useState } from 'react';

import applyImage from '../../../assets/content/content_1.webp';
import reviewImage from '../../../assets/content/content_2.webp';
import alignImage from '../../../assets/content/content_3.webp';
import connectImage from '../../../assets/content/content_4.webp';
import sustainImage from '../../../assets/content/content_5.webp';

type ProcessStepKey = 'apply' | 'review' | 'align' | 'connect' | 'sustain';

export type ProcessStepItem = Readonly<{
  key: ProcessStepKey;
  number: number;
  title: string;
  text: string;
  progress: string;
}>;

const IMAGES: Readonly<Record<ProcessStepKey, StaticImageData>> = {
  apply: applyImage,
  review: reviewImage,
  align: alignImage,
  connect: connectImage,
  sustain: sustainImage,
};

type ProcessStepsProps = Readonly<{
  items: ReadonlyArray<ProcessStepItem>;
  navigationLabel: string;
}>;

export function ProcessSteps({ items, navigationLabel }: ProcessStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeItem = items[activeIndex];

  if (!activeItem) {
    return null;
  }

  const selectAndFocus = (index: number) => {
    setActiveIndex(index);
    stepRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
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
      default:
        return;
    }

    event.preventDefault();
    selectAndFocus(nextIndex);
  };

  return (
    <div className="kc-process">
      <div className="kc-process-stage">
        <div className="kc-process-media" aria-hidden="true">
          {items.map((item, index) => (
            <div
              className="kc-process-image-layer"
              data-state={activeIndex === index ? 'active' : 'inactive'}
              key={item.key}
            >
              <Image
                className="kc-process-image"
                src={IMAGES[item.key]}
                alt=""
                fill
                sizes="(min-width: 48rem) 80rem, 100vw"
              />
            </div>
          ))}
          <span className="kc-process-overlay" />
        </div>

        <div className="kc-process-detail" key={activeItem.key} aria-live="polite">
          <p className="kc-process-progress">{activeItem.progress}</p>
          <h3 className="kc-process-title">{activeItem.title}</h3>
          <p className="kc-process-text">{activeItem.text}</p>
        </div>
      </div>

      <ol className="kc-process-navigation" aria-label={navigationLabel}>
        {items.map((item, index) => {
          const active = activeIndex === index;
          return (
            <li className="kc-process-navigation-item" key={item.key}>
              <button
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className="kc-process-trigger kc-focus-ring"
                type="button"
                aria-current={active ? 'step' : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => selectAndFocus(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="kc-process-trigger-number">{item.progress}</span>
                <span className="kc-process-trigger-title">{item.title}</span>
                <span className="kc-process-trigger-line" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
