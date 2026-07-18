type SectionHeadingProps = Readonly<{ eyebrow: string; title: string; lead: string }>;

export function SectionHeading({ eyebrow, title, lead }: SectionHeadingProps) {
  return (
    <header className="kc-section-head">
      <p className="kc-eyebrow">{eyebrow}</p>
      <h2 className="kc-section-title">{title}</h2>
      <p className="kc-section-lead">{lead}</p>
    </header>
  );
}
