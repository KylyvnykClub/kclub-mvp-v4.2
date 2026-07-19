'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRef, useState, type KeyboardEvent } from 'react';

export type TrustSignal = Readonly<{
  key: string;
  label: string;
  category: string;
  text: string;
  image: StaticImageData;
}>;

type TrustSignalsProps = Readonly<{
  items: ReadonlyArray<TrustSignal>;
  navigationLabel: string;
}>;

export function TrustSignals({ items, navigationLabel }: TrustSignalsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeItem = items[activeIndex] ?? items[0];

  if (!activeItem) return null;

  const selectAndFocus = (index: number) => {
    setActiveIndex(index);
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      selectAndFocus((index + 1) % items.length);
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectAndFocus((index - 1 + items.length) % items.length);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      selectAndFocus(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      selectAndFocus(items.length - 1);
    }
  };

  return (
    <div className="kc-about-trust-layout">
      <div className="kc-about-trust-media" aria-live="polite">
        {items.map((item, index) => (
          <div
            className="kc-about-trust-image"
            data-state={index === activeIndex ? 'active' : 'inactive'}
            key={item.key}
          >
            <Image src={item.image} alt="" fill sizes="(min-width: 768px) 52vw, 100vw" />
          </div>
        ))}
        <div className="kc-about-trust-caption">
          <span>{activeItem.category}</span>
          <p>{activeItem.text}</p>
        </div>
      </div>
      <div className="kc-about-trust-list" role="group" aria-label={navigationLabel}>
        {items.map((item, index) => (
          <button
            className="kc-about-trust-trigger kc-focus-ring"
            data-state={index === activeIndex ? 'active' : 'inactive'}
            type="button"
            aria-pressed={index === activeIndex}
            key={item.key}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
