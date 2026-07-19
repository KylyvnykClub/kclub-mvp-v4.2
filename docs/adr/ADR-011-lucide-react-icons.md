# ADR-011: Lucide React Icons

Status: Accepted

Use `lucide-react` as the shared source for interface icons in React surfaces. Lucide provides
tree-shakeable named exports, a consistent visual language, and standard SVG accessibility
attributes without introducing a project-specific icon convention.

Icons remain presentational: meaningful labels stay in localized text, decorative icons are hidden
from assistive technology, and components consume design-system color and sizing tokens rather than
hard-coded visual values.
