# LuxeStay LA: website

A multi-page website for LuxeStay LA, a residential hospitality brand offering furnished
apartments for temporary stays in Los Angeles.

> **Development status.** Residences, rates and availability are **sample data**, and
> photography is **placeholder imagery** from Unsplash. Both are labelled as such in the
> UI. The Yardi / RentCafe integration is **architected but not implemented**: see
> [docs/INTEGRATION.md](docs/INTEGRATION.md).

## Stack

- **Next.js 16.4** (App Router, Turbopack, Cache Components + Partial Prefetching)
- **React 19.3**, **TypeScript 5**
- **Tailwind CSS 4** (design tokens in `src/app/globals.css`)
- `next/font` (Cormorant Garamond + Manrope), `next/image`
- No UI or form libraries. Only one runtime dependency was added: `server-only`.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; defaults work for local development
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Unit tests: listing filters, session tokens, dashboard reminders |

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero with stay finder, featured residences, experience, neighborhoods, how it works, brand story, CTA |
| `/residences` | Search and filter (neighborhood, bedrooms, bathrooms, available-by date, price range), sorting, pagination, loading, empty and error states |
| `/residences/[slug]` | Gallery and lightbox, overview, highlights, furnishings and amenities, floor plans, neighborhood, leasing and policies, sticky inquiry panel, mobile CTA bar, related residences |
| `/experience` | Benefits, what's included, neighborhoods, process |
| `/about` | Brand philosophy and narrative |
| `/contact` | Validated inquiry form (server action), contact details placeholders, privacy messaging; accepts `?type=&residence=&moveIn=` prefill |
| `/faq` | Accessible accordions; policy answers marked as placeholders |
| `/privacy`, `/terms`, `/accessibility` | Placeholder legal pages, clearly marked as not final |
| 404 / error | Custom not-found page and error boundary |
| `/dashboard/*` | **Resident Dashboard** (private): overview, residence, maintenance, guide, payments, documents, support, account. See [docs/DASHBOARD.md](docs/DASHBOARD.md) |
| `/sitemap.xml`, `/robots.txt` | Generated; indexing disabled unless `NEXT_PUBLIC_ALLOW_INDEXING=true` |

## Project structure

```
src/
  app/                      Root layout, not-found, sitemap, robots, icon
    (site)/                 Public website routes (header/footer layout)
    dashboard/              Resident Dashboard (login + authenticated (portal) group)
    api/resident/           Authenticated resident route handlers
  proxy.ts                  Route protection for /dashboard and /api/resident
  components/
    layout/                 Header (transparent over hero, drawer on mobile), footer, wordmark
    ui/                     Button, layout primitives, accordion, page intro, legal page
    home/                   Shared marketing sections (home + experience)
    residences/             Card, stay finder, filters, pagination, gallery, inquiry panel, states
    forms/                  Contact form
    dashboard/              Dashboard navigation, panels, states and forms
  lib/
    auth/                   Signed sessions, identity providers, Data Access Layer
    resident/               Resident data layer: adapter contract, fixtures, RentCafe stub
    properties/             Data layer: types, adapter interface, sample + RentCafe adapters,
                            query (filter/sort/paginate), cached service
    images.ts               Placeholder photography registry with alt text
    contact.ts              Shared form validation
    format.ts, site.ts      Formatting helpers, site config and navigation
public/brand/               Official logo (dark/light) and hero wordmark, vector-traced
                            from the client's artwork; src/app/icon.svg uses the "L" mark
docs/INTEGRATION.md         Yardi / RentCafe integration plan and checklist
```

## Environment variables

See [.env.example](.env.example) for the full list. Summary:

| Variable | Scope | Required in production | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | yes | Canonical origin for metadata, sitemap, JSON-LD |
| `NEXT_PUBLIC_ALLOW_INDEXING` | public | yes (`true` on prod only) | Allows crawling in robots.txt |
| `PROPERTY_DATA_SOURCE` | server | yes | `sample` or `rentcafe` |
| `RENTCAFE_*` | server | when integrated | Credentials and codes (names may change once the method is verified) |
| `NEXT_PUBLIC_LEASING_PORTAL_URL` | public | recommended | Official leasing / application portal |
| `CONTACT_WEBHOOK_URL` | server | yes | Destination for inquiries (form errors in production without it) |
| `CONTACT_WEBHOOK_SECRET` | server | optional | Bearer token for the webhook |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `NEXT_PUBLIC_BUSINESS_HOURS` | public | when verified | Shown on contact page and footer; placeholders until set |
| `AUTH_SECRET` | server | yes (for dashboard sign-in) | Signs resident session cookies (≥ 32 chars) |
| `RESIDENT_AUTH_PROVIDER` / `RESIDENT_DATA_SOURCE` | server | when integrated | `fixtures` (dev only) or `rentcafe` (stub); unset = sign-in off |
| `DEV_RESIDENT_PASSWORD` | server | dev only | Fixture sign-in password |
| `NEXT_PUBLIC_RESIDENT_PORTAL_URL` | public | recommended | Official RentCafe resident portal (dashboard fallbacks) |

`NEXT_PUBLIC_*` values are inlined at **build time**: rebuild after changing them.

## Key behaviours

- **Data integrity.** Sample records carry `source: "sample"`, display "Sample data" tags
  and a footer notice, are excluded from the sitemap, are served with
  `noindex`, and never emit listing JSON-LD.
- **Resilience.** The property service converts upstream failures into "unavailable" or
  "not configured" states. Pages stay usable and offer the inquiry form and the official
  leasing portal.
- **Leasing handoff.** If a property has `leasing.applyUrl`, the primary CTA opens the
  official leasing flow; otherwise it routes to a prefilled inquiry.
- **Contact delivery.** Inquiries are POSTed to `CONTACT_WEBHOOK_URL`. In development
  without a webhook, submissions are logged (email redacted) and the success state says
  nothing was delivered. In production without one, the form shows an error.
- **Progressive enhancement.** The stay finder and filters are GET forms that work without
  JavaScript; with JS, filters apply instantly and results dim while loading.
- **Motion.** CSS-only entrance animations (scroll-driven where supported), all disabled
  under `prefers-reduced-motion`.
- **Accessibility.** Skip link, landmarks, visible focus, AA-contrast token variants
  (`*-ink`), labelled form errors and summary, native `<dialog>` for menu and lightbox,
  WAI-ARIA accordion.

## Deployment

The app is a standard Next.js server application. Vercel works with zero configuration.
Any Node 20.9+ host works too (`npm run build && npm start`; see the Next.js
self-hosting guide in `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`).

Launch checklist:

1. Set the production environment variables (see above), including
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=true` and `CONTACT_WEBHOOK_URL`.
2. Replace placeholder photography with licensed property photography, and update
   `src/lib/images.ts` and `images.remotePatterns`.
3. Complete the RentCafe integration (docs/INTEGRATION.md). Do not launch publicly with
   sample listings: if the integration is not ready, set `PROPERTY_DATA_SOURCE=rentcafe`
   anyway. Listing pages then show the "being connected" state with the inquiry form
   and leasing-portal link (inquiry-only mode).
4. Replace placeholder FAQ policy answers and legal pages with approved text.
5. Supply verified contact details (email, phone, hours).
6. Review and approve brand copy (homepage, About, Experience): it is draft copy.
7. Confirm analytics / tracking requirements and consent needs with the client (none
   are installed).
8. Run Lighthouse / Core Web Vitals checks against the production URL.
