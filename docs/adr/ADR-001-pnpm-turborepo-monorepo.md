# ADR-001: pnpm and Turborepo Monorepo

Status: Accepted

The codebase uses `pnpm` workspaces and Turborepo. It provides one lockfile, efficient package sharing, deterministic workspace scripts, and an explicit dependency graph. npm is not the primary workspace manager; Bun is not the deployment/runtime foundation for this project.
