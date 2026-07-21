import React from 'react';
import { LegalDoc } from '../types';

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  if (!doc) return null;
  return (
    <div className="kc-container">
      <div className="kc-legal-page">
        <h1>{doc.title}</h1>
        <div className="kc-legal-meta">
          <span>Effective Date: {doc.effectiveDate}</span>
          {doc.version && <span>Version: {doc.version}</span>}
          {doc.operatorLines?.map((line, idx) => (
            <span key={idx}>{line}</span>
          ))}
        </div>

        {doc.intro && (
          <div className="kc-legal-blocks" style={{ marginBottom: 'var(--kc-space-10)' }}>
            {doc.intro.map((block, idx) => {
              if (block.type === 'paragraph') {
                return <p key={idx}>{block.text}</p>;
              }
              if (block.type === 'list') {
                return (
                  <ul key={idx}>
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
        )}

        <div className="kc-legal-sections">
          {doc.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="kc-legal-section-heading">{section.heading}</h2>
              <div className="kc-legal-blocks">
                {section.blocks.map((block, blockIdx) => {
                  if (block.type === 'paragraph') {
                    return <p key={blockIdx}>{block.text}</p>;
                  }
                  if (block.type === 'list') {
                    return (
                      <ul key={blockIdx}>
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>
            </section>
          ))}
        </div>

        {doc.note && (
          <div className="kc-legal-note">
            {Array.isArray(doc.note) ? (
              doc.note.map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p>{doc.note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
