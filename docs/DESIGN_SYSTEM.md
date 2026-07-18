# Design System

## One visual system

All product surfaces use the same token system and `@kclub/ui` primitives. Public pages may be editorial and brand-led; the admin is dense, quiet, and operational. They must not fork colors, typography, spacing, control behavior, or accessibility rules.

## Source of truth

```text
packages/ui/src/styles/
  tokens.css       raw values and semantic aliases only
  theme.css        light/dark semantic mappings
  globals.css      reset, base elements, accessibility utilities
  components.css   shared component recipes consuming tokens only
```

Raw colors, dimensions, radii, shadows, z-index values, and typography scales are allowed only in `tokens.css`. Components consume semantic `--kc-*` variables. A lint check rejects raw visual values outside that layer except transparent, `currentColor`, and documented layout math.

## Class and component policy

- Shared CSS classes use the `kc-` namespace: `kc-page`, `kc-container`, `kc-section`, `kc-stack`, `kc-cluster`, `kc-card`, `kc-table`, `kc-toolbar`.
- Variant state uses `data-*`: `data-tone`, `data-size`, `data-state`, `data-loading`; do not create ad-hoc modifier naming systems.
- Component APIs use typed variants, preferably CVA or an equivalent centralized variant definition. Visual variation is a prop, not copied markup.
- Every command button uses `@kclub/ui/Button`. A raw `<button>` exists only inside the shared primitive implementation.
- Shared primitives include Button, IconButton, Input, Select, Checkbox, Field, Badge, StatusBadge, Modal, Drawer, Tabs, Table, Pagination, EmptyState, DataState, Tooltip, and Toast.

## Component boundary

Primitives are presentational and accessible. They receive labels, state, and callbacks; they never decide whether a member may be approved, whether a payment may be refunded, or what status transition is valid. Feature screens compose primitives and pass interaction callbacks. Commands and permissions remain outside the visual layer.

## Layout and accessibility

- Mobile-first with stable layouts; never use viewport-width font scaling.
- Use semantic HTML first, accessible names for controls, visible focus, keyboard support, and 44px minimum touch targets where relevant.
- Public pages require one H1 and meaningful server-rendered content. Admin tables may scroll horizontally on narrow screens; actions remain reachable.
- Use Lucide icons for known actions. Icon-only buttons require a tooltip and accessible label.
- All visible strings come from locale messages; no hard-coded user-facing copy in components.

## Change protocol

1. Look for an existing primitive and token.
2. Add a documented variant if the behavior belongs to the same component.
3. Add a new primitive only when it is reusable across at least two features or removes real complexity.
4. Add stories/tests for shared primitives and verify focus, disabled, loading, empty, error, and small-screen states.
