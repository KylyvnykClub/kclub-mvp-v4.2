# ADR-007: Token-Driven Shared UI

Status: Accepted

Visual rules live in `packages/ui` tokens and reusable primitives. Raw feature-level visual values and duplicated generic components are prohibited. Public and operations surfaces may have different compositions, but share the same visual language and accessibility behavior. This is an explicit consistency control for multi-agent development.
