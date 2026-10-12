# Resident Dashboard

A private area at `/dashboard` where residents can see their residence, maintenance
requests, documents, building announcements and resident guide, with links to the
official RentCafe resident portal for anything not yet connected.

> **Status.** The dashboard UI, authentication framework, route protection and data
> layer are complete. **No live resident data source is connected yet.** Yardi / RentCafe
> resident APIs, credentials and the client's identity method have not been verified.
> Development uses clearly labelled **fixtures** (fictional residents), which are
> disabled in production builds.

## Routes

| Route | Purpose | Data / fallback |
| --- | --- | --- |
| `/dashboard/login` | Resident sign-in | Shows "not available yet" + portal link when no identity provider is configured |
| `/dashboard` | Overview: welcome, residence and lease dates, reminders, announcements, maintenance summary, quick access | Each panel falls back independently |
| `/dashboard/residence` | Property, unit, layout, amenities, lease status and dates, move-in notes | Portal fallback |
| `/dashboard/maintenance` | Open and completed requests with status | Portal fallback |
| `/dashboard/maintenance/new` | New request (category, summary, details, entry permission) | Portal fallback when creation isn't supported |
| `/dashboard/maintenance/[id]` | Request details and status history | Owner-only; others get "not found" |
| `/dashboard/guide` | Move-in, access, parking, utilities, guidelines, local tips, FAQ, contact | Editable content in `src/content/resident-guide.ts` |
| `/dashboard/payments` | Payment summary and history **only from a verified source** | Always portal fallback today (no financial data is fabricated) |
| `/dashboard/documents` | Lease and residence documents | Portal fallback |
| `/dashboard/support` | Contact details, FAQ, message form (reuses the site's contact form) | Placeholder contact details until provided |
| `/dashboard/account` | Profile (read-only), session info, sign out | — |
| `/api/resident/documents/[id]` | Authenticated, owner-checked document download | 401 / 404 / 503 |

The public site is unchanged except for a **"Resident login"** link in the footer.
Public pages moved into the `src/app/(site)` route group so the dashboard can use its
own shell. URLs are identical.

## Architecture

```
src/proxy.ts                         Optimistic gate: redirects /dashboard/* (and 401s
                                     /api/resident/*) without a valid signed session
src/lib/auth/
  token.ts                           HMAC-SHA256 signed session token (no PII, 8 h expiry)
  session.ts                         HttpOnly cookie read/issue/clear (server-only)
  providers.ts                       Identity providers: "fixtures" (dev) / "rentcafe" (stub)
  dal.ts                             Data Access Layer: getCurrentResident(), requireResident()
  rate-limit.ts                      Sign-in attempt limiting (in-memory)
src/lib/resident/
  types.ts                           Internal resident model + capability flags
  adapter.ts                         ResidentDataAdapter contract
  fixtures.ts                        Development fixtures (2 fictional residents)
  rentcafe-adapter.ts                Stub: all capabilities false
  service.ts                         Capability checks, error handling, adapter selection
  config.ts                          Data source selection, fixture gate, portal URL
  reminders.ts / format.ts           Pure helpers (unit-tested)
src/app/dashboard/
  login/, actions.ts                 Sign-in / sign-out Server Actions
  (portal)/                          Authenticated shell + pages
src/components/dashboard/            Sidebar / mobile nav, panels, states, forms
src/content/resident-guide.ts        Editable guide + resident FAQ content
```

### Security model

- **Authentication.** Signed (HMAC-SHA256), `HttpOnly`, `SameSite=Lax`, `Secure` in
  production, 8-hour session cookie. `AUTH_SECRET` (≥ 32 chars) is server-only.
  The token contains only an opaque resident id, provider and timestamps.
- **Two layers of route protection.** `src/proxy.ts` redirects unauthenticated requests
  before rendering. Every page, Server Action and Route Handler then calls
  `requireResident()` / `getCurrentResident()`, which re-verifies the signature and expiry,
  confirms the issuing provider is still enabled, and confirms the resident still exists.
- **Authorization.** All data functions take an `AuthenticatedResident`, a type that only
  the DAL can produce, and the adapter scopes every query to that resident id. Ids from
  URLs (request or document ids) are always checked for ownership. Another resident's
  record is indistinguishable from a missing one (404 or "not found").
- **Documents** stream through `/api/resident/documents/[id]` with
  `Cache-Control: private, no-store`, `Content-Disposition: attachment` and `nosniff`.
  No public file URLs or open storage.
- **Sign-in** returns generic errors, compares passwords in constant time, rate-limits per
  email and IP (5 attempts / 15 min), and only redirects back into `/dashboard` (no open
  redirects).
- **Fixtures** require `RESIDENT_AUTH_PROVIDER=fixtures`, `RESIDENT_DATA_SOURCE=fixtures`
  and a `DEV_RESIDENT_PASSWORD` of at least 12 characters, and are **off in production
  builds** unless `ALLOW_RESIDENT_FIXTURES_IN_PRODUCTION=true` (only for a protected
  staging site). Every dashboard page shows a "Development fixtures" banner while they're
  in use.
- **No secrets in the client.** Credentials and tokens live in server-side env vars;
  only `NEXT_PUBLIC_RESIDENT_PORTAL_URL` is public.
- **Private pages are `noindex`**, and `robots.txt` disallows `/dashboard` and `/api/`.

### Verified during development

- Unauthenticated `/dashboard/*` → 307 to login with a safe `next` path; `/api/resident/*` → 401.
- Forged or tampered cookies → rejected. A validly signed fixture token in a production
  build → rejected by the DAL (provider disabled).
- Resident A cannot open resident B's request (not found) or document (404); path-traversal ids → 404.
- Sign-out clears the session; the dashboard and documents become inaccessible.
- axe-core: 0 violations on all dashboard pages and the login page (desktop and 390 px);
  no horizontal overflow.

## Local development

`.env.local` (gitignored) is created with a random `AUTH_SECRET`, fixture mode and a
random `DEV_RESIDENT_PASSWORD`. Sign in at `/dashboard/login` with
`resident.a@example.test` or `resident.b@example.test` and that password. Maintenance
requests created in fixture mode live in memory and reset when the server restarts.

## Enabling live resident data (remaining work)

Confirm with the client and Yardi before writing any integration code:

1. **Identity.** How should residents authenticate: RentCafe SSO / OAuth / SAML, an
   approved resident API with credential verification, or email magic links matched
   against the resident roster? This decides the `rentcafe` identity provider in
   `src/lib/auth/providers.ts`. Do not collect RentCafe passwords unless Yardi explicitly
   supports and approves it.
2. **Resident data access.** Which resident endpoints exist under the client's licence
   (profile, unit and lease, work orders, ledger, documents), their auth method, rate
   limits and terms.
3. **Implement `src/lib/resident/rentcafe-adapter.ts`.** Map responses into the types in
   `types.ts` and set each capability flag to `true` only after testing against the real
   service. Scope every call to the session's resident id.
4. **Payments.** Show balances only from the verified ledger API; otherwise keep the
   portal fallback. Never process payments in this app.
5. **Maintenance.** If RentCafe already handles work orders, either sync through the
   official API or keep the portal link. Don't run a disconnected duplicate system.
   Attachments require an approved upload method (`maintenanceAttachments`).
6. **Documents.** Stream from the provider through the existing route handler; never
   expose provider URLs that are public or long-lived.
7. **Production hardening.** Back `rate-limit.ts` with a shared store (e.g. Redis) when
   running multiple instances, set `AUTH_SECRET` per environment, and set
   `NEXT_PUBLIC_RESIDENT_PORTAL_URL`.
8. **Content.** Supply official building access, parking, utilities, guidelines and
   contact details for the guide (`src/content/resident-guide.ts`). Never put access codes
   or Wi-Fi passwords in that file.

No database was added. If later features need app-owned data (for example notification
preferences or announcements authored outside Yardi), add the data store with per-resident
authorization rules at that point.
