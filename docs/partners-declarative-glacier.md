# Extend Partner with owner, phone, featured toggles, and Stripe billing status

## Context

The Partners feature (schema, seed, public site, admin CRUD) shipped earlier in this session. The user then pointed at [docs/schema.example.ts](docs/schema.example.ts) — a reference Drizzle schema for a fuller "business profile" concept (owner, representative phone, featured flags, Stripe subscription fields) — and asked for the fields missing from what we have. They confirmed explicitly: **this is not a new entity** — "business" and "Partner" are the same thing here, so these fields extend the existing `Partner` model, not a new table. Scope, confirmed via clarifying questions:

- **Owner**: link to the existing `Member` model (no new `User`/`Business` entity).
- **Country**: full ISO country list (not the current 4-value enum), using the flag SVGs already bundled at `apps/product-core/src/assets/flags.svg/` (255 files, standard ISO 3166-1 alpha-2 codenames — this is the `flag-icons` package's icon set).
- **City**: a free-text field on `Partner`, with an autocomplete convenience in the admin form (no separate Cities table).
- **Stripe**: full webhook-driven integration per the project's existing architecture docs ([docs/BILLING.md](docs/BILLING.md), [ADR-006](docs/adr/ADR-006-stripe-webhook-authority.md), [docs/SPEC.md](docs/SPEC.md) §9/§12) — but **view-only** in the admin UI. No "create checkout session" button; the webhook keeps a partner's subscription fields in sync, admin just displays them. The user will add `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` to `.env.local` themselves.

No Stripe SDK, keys, or country/city package currently exist in the repo (checked `pnpm-lock.yaml`, `.env.local`) — this is net-new plumbing, built to the standard the docs already commit to (idempotent webhook dedup, signature verification), not a shortcut version.

## Schema changes — `packages/database/prisma/schema.prisma`

Extend `Partner` (no new business/user entity):

```prisma
enum SubscriptionStatus {
  NONE
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
}

model Partner {
  // ...existing fields...
  country              String              // was PartnerCountry enum -> free ISO alpha-2 code (see below)
  city                 String?
  phone                String?
  ownerId              String?             @map("owner_id") @db.Uuid
  owner                Member?             @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  featuredTop          Boolean             @default(false) @map("featured_top")
  featuredRecommended  Boolean             @default(false) @map("featured_recommended")
  stripeCustomerId     String?             @map("stripe_customer_id")
  stripeSubscriptionId String?             @unique @map("stripe_subscription_id")
  stripePriceId        String?             @map("stripe_price_id")
  subscriptionStatus   SubscriptionStatus  @default(NONE) @map("subscription_status")
  currentPeriodStart   DateTime?           @map("current_period_start") @db.Timestamptz(6)
  currentPeriodEnd     DateTime?           @map("current_period_end") @db.Timestamptz(6)
  cancelAtPeriodEnd    Boolean             @default(false) @map("cancel_at_period_end")
}

model Member {
  // ...existing fields...
  partners Partner[]
}

model StripeWebhookEvent {
  id            String   @id @default(uuid()) @db.Uuid
  stripeEventId String   @unique @map("stripe_event_id")
  type          String
  payload       Json
  processedAt   DateTime? @map("processed_at") @db.Timestamptz(6)
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)

  @@map("stripe_webhook_events")
}
```

- Drop the `PartnerCategory`/`PartnerCountry` enum for `country` in favor of a plain `String` ISO code — a ~250-value Postgres enum is unwieldy, and `category` stays an enum since it's still a small fixed set. `country` is validated at the app layer against the same code list used to render flags (see below), matching how `Member.country` is already a free string, not an enum, in this schema.
- Migration must backfill existing 9 seeded rows' `country` from the old enum values to lowercase ISO codes (`GERMANY→de`, `SWITZERLAND→ch`, `POLAND→pl`, `UKRAINE→ua`) before dropping the old type.
- `StripeWebhookEvent` is required by [ADR-006](docs/adr/ADR-006-stripe-webhook-authority.md)'s dedup rule ("record the Stripe event ID before processing, reject duplicates") — infra plumbing, not a new domain entity.
- `ownerId` is nullable (existing seeded partners have no owner) with `onDelete: SetNull`.

Generate the migration with `prisma migrate dev`, matching the `add_partners`/`init_members` migration style already in the repo.

## Country + city data — no new DB tables

- Add `apps/product-core/src/features/partners/countries.ts`: build the full `{code, name}[]` list from the 255 codes already present as files in `assets/flags.svg/`, using `Intl.DisplayNames(['en'], {type: 'region'})` to generate English names — no new npm dependency for country names. Export a `PARTNER_COUNTRY_CODES` set from `@kclub/contracts` (or re-export from here) so both admin-app validation and the product-core API route validate against the exact same list.
- Flags currently live as statically-imported SVGs (`PartnerCard.tsx`'s `PARTNER_COUNTRY_FLAGS` map, 4 hardcoded entries). With 255 possible codes, static per-file imports don't scale — move the flag SVGs to `apps/product-core/public/flags/{code}.svg` (copy once from `assets/flags.svg/`) and reference them by plain URL path (`/flags/${code}.svg`) via a normal `<img>`/`next/image` with a `src` string, replacing the static-import map in `PartnerCard.tsx` and the admin's country `Select`.
- City: add `country-state-city` (small, maintained, zero-config npm package with city data keyed by ISO country code) as a devDependency-free runtime dependency of `apps/admin-app` only, used purely client-side in `partner-form.tsx` to power a searchable `AutoComplete` for `city`, filtered by the selected `country`. The stored value is still a plain string on `Partner.city` — no new table, no product-core dependency.

## Admin UI — `apps/admin-app`

- `partner-form.tsx`:
  - `Country`: `Select` populated from the full country list, each option showing its flag (`/flags/{code}.svg`) — replaces the current 4-option select.
  - `City`: `AutoComplete` from `country-state-city`, filtered by the chosen country code.
  - Add `phone` (`Input`).
  - Add `owner`: searchable `Select` (`AutoComplete`/remote search) hitting the **already-implemented** `/api/proxy/users?search=` (reuses the existing Members list endpoint — no new backend search needed), storing `ownerId`.
  - Add `featuredTop`/`featuredRecommended` (`Switch`).
  - Stripe/subscription fields are **not** on this form — view-only, per user's answer.
- `partner-detail.tsx` (Show page):
  - Add a "Billing" `Card` (read-only): `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `subscriptionStatus` (colored `Tag`, matching SPEC.md §8.3 statuses), `currentPeriodStart`/`currentPeriodEnd`, `cancelAtPeriodEnd`. Shows "No subscription" when `subscriptionStatus === 'NONE'`.
  - Add `phone` and `owner` (owner rendered as "First Last (phone)", linking to `/members/{ownerId}` if present) to the Overview card.
  - Extend the existing inline-edit pattern (already built for category/country/discount in this session) to also cover `featuredTop`/`featuredRecommended` `Switch`es — matches the "toggle right there" pattern the user liked.
- `partners-list.tsx`: add a compact "Featured" column (small tags: "Top" / "Rec") so staff can see at a glance who's currently featured without opening each record.

## Backend — `apps/product-core`

- `packages/contracts/src/index.ts`: extend `PartnerDto` with `ownerId`, `ownerName` (denormalized `"First Last"` for admin display), `phone`, `city`, `featuredTop`, `featuredRecommended`, `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `subscriptionStatus`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd`; `country` stays `string` (now free-form, validated against the ISO list server-side).
- `apps/product-core/.../partners/route.ts` + `[id]/route.ts`:
  - `toDto` joins `owner: { select: { id, firstName, lastName, phone } }` and computes `ownerName`.
  - Validate `country` against the shared ISO code list (`isValidCountry` swaps its 4-value check for the full list); validate `ownerId` references an existing `Member` if provided (`INVALID_INPUT` otherwise).
  - PATCH: when setting `featuredTop`/`featuredRecommended` to `true`, wrap the check + update in `db.$transaction` — count other partners with that flag `true`; reject with `CONFLICT` if already 3 (SPEC.md §11: "Max 3 ... enforce under transaction/lock").
- New `apps/product-core/src/lib/stripe.ts`: `getStripe()` singleton (`new Stripe(process.env.STRIPE_SECRET_KEY!, {...})`), same singleton-getter shape as `getDatabase()`.
- New `apps/product-core/src/app/api/stripe/webhook/route.ts` (matches the documented `POST /api/stripe/webhook` route from SPEC.md §9):
  - Reads the **raw** body (`request.text()`), verifies `stripe-signature` via `stripe.webhooks.constructEvent(...)`.
  - Looks up `StripeWebhookEvent` by `stripeEventId`; if already `processedAt`-set, returns 200 immediately without reprocessing (idempotent dedup per ADR-006).
  - Handles `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_failed` (SPEC.md §12's exact event list) — resolves the target `Partner` by `stripeCustomerId`/`stripeSubscriptionId`, falling back to the Checkout Session's `client_reference_id` (set to the partner id whenever a session is created — even though session creation is out of scope here, the webhook is built to honor it so a manually-created test session in Stripe test mode works end-to-end).
  - Updates the Partner's Stripe/subscription fields and marks the event `processedAt` in the same transaction.
- `.env.example`: add `STRIPE_SECRET_KEY=` and `STRIPE_WEBHOOK_SECRET=` (commented, no values — matches existing convention). Add the `stripe` npm package to `apps/product-core/package.json`.

## Verification

1. Run the new migration; confirm `partners` has the new columns and `stripe_webhook_events` exists (Supabase MCP `list_tables`/`execute_sql`).
2. In admin: edit a partner, set `phone`, pick an `owner` from Members search, toggle `featuredTop` on 3 different partners, confirm a 4th attempt returns a conflict error (via the `message.error` toast already wired up).
3. Confirm the country `Select` shows the full list with correct flags, and city autocomplete filters sensibly once a country is picked.
4. User adds `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` to `.env.local`; use the Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`, then `stripe trigger checkout.session.completed`) with `client_reference_id` set to a seeded partner's id — confirm the partner's Billing card updates, and redelivering the same event doesn't reprocess it (check `stripe_webhook_events.processed_at` stays on the first timestamp).
5. Per CLAUDE.md: run `impact()` on `Partner`/`toDto`/`PartnerCard`'s flag map before editing (country type change is a breaking shape change for existing consumers), and `detect_changes()` before committing.
