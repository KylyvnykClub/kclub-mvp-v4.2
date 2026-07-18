'use client';

import { useState } from 'react';

type FaqItem = Readonly<{ question: string; answer: string }>;

export function FaqAccordion({ items }: Readonly<{ items: ReadonlyArray<FaqItem> }>) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="kc-accordion">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <article
            className="kc-accordion-item"
            data-state={open ? 'open' : 'closed'}
            key={item.question}
          >
            <h3 className="kc-accordion-heading">
              <button
                className="kc-accordion-trigger kc-focus-ring"
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                {item.question}
                <span className="kc-accordion-icon" aria-hidden="true">
                  ⌄
                </span>
              </button>
            </h3>
            {open ? (
              <div className="kc-accordion-panel" id={panelId}>
                <p>{item.answer}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
