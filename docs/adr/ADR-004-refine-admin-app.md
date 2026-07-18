# ADR-004: Refine for the Operations Admin

Status: Accepted

`apps/admin-app` uses Refine.dev for CRUD/resource routing, data access abstractions, authentication integration, and access-control-aware administrative UX. Refine does not own data, authorization, or business transitions; it is a React operational client over product-core APIs.
