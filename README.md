# LuxeStay LA

A premium website and **Resident Dashboard** for LuxeStay LA, a conceptual residential
hospitality brand offering furnished apartments for temporary stays in Los Angeles.

> **Portfolio project.** Residences, rates, availability and residents are **fictional
> sample data**, and photography is **placeholder imagery** from Unsplash. All of it is
> labelled as such in the UI. The Yardi / RentCafe integrations are **architected but not
> implemented**; see [docs/INTEGRATION.md](docs/INTEGRATION.md) and
> [docs/DASHBOARD.md](docs/DASHBOARD.md).

**Contents:** [Website screenshots](#website) · [Resident Dashboard screenshots](#resident-dashboard) ·
[Stack](#stack) · [Getting started](#getting-started) · [Project structure](#project-structure) ·
[Environment variables](#environment-variables) · [Deployment](#deployment)

---

## Website

### Home

![Home page, full length](docs/screenshots/01-home.jpg)

The homepage introduces the brand and leads visitors toward the residences:

- **Editorial hero.** A full-screen architectural photograph with the headline at the top
  left, a short introduction with *Explore Residences* and *Find Your Stay* links at the
  top right, and the oversized LuxeStay wordmark (from the official logo) along the
  bottom. The navbar is transparent over the hero and turns solid on scroll.
- **Stay finder.** Location, move-in, move-out and bedrooms. It's a plain GET form, so it
  works without JavaScript, and it validates that move-out falls after move-in.
- **Featured residences.** Curated cards with availability badges and *Sample data* tags.
- **The LuxeStay experience.** Five benefits with a sticky editorial image.
- **Neighborhoods.** LA photography and links that open the residences page pre-filtered.
- **How it works, brand story and closing call to action.**

<details>
<summary>Hero at viewport size</summary>

![Home hero](docs/screenshots/02-home-hero.jpg)

</details>

### Residences: search, filter and sort

![Residences listing](docs/screenshots/03-residences.jpg)

- Filters for neighborhood, bedrooms, bathrooms, *available by* date and monthly price
  range, plus sorting (featured, soonest available, price low to high and high to low).
- Every filter combination is a **shareable URL**. With JavaScript, filters apply
  instantly and the results dim while loading; without it, the form still works.
- Pagination, a result count, availability badges and clear *Sample data* labelling.

| Filtered (2+ bedrooms, under $8,000, price ascending) | Empty state |
| --- | --- |
| ![Filtered results](docs/screenshots/04-residences-filtered.jpg) | ![Empty state](docs/screenshots/05-residences-empty.jpg) |

### Residence detail

![Residence detail page](docs/screenshots/06-residence-detail.jpg)

- An editorial photo mosaic that opens a **full-screen gallery** (keyboard arrows, swipe,
  focus management).
- Overview, key facts, highlights, furnishings and amenities, floor-plan table,
  neighborhood information and leasing policies (marked as placeholders).
- A **sticky pricing and inquiry panel**. The primary button opens the official leasing
  flow when one exists; otherwise it starts a pre-filled inquiry.
- Related residences. Sample listings are `noindex` and never emit listing structured data.

![Gallery lightbox](docs/screenshots/07-residence-gallery.jpg)

### The Experience and About

| The Experience | About |
| --- | --- |
| ![The Experience page](docs/screenshots/08-experience.jpg) | ![About page](docs/screenshots/09-about.jpg) |

- **The Experience:** benefits, what's included (kitchen, bedroom, working from home),
  neighborhoods and the three-step process.
- **About:** the brand philosophy, why furnished living, the comfort, convenience and
  quality approach, and what guests can expect.

### FAQ and Contact

| FAQ (accessible accordion) | Contact (validation state) |
| --- | --- |
| ![FAQ page](docs/screenshots/10-faq.jpg) | ![Contact page](docs/screenshots/11-contact-validation.jpg) |

- **FAQ:** WAI-ARIA accordions grouped by topic. Answers that depend on official policy
  are clearly tagged *Placeholder: pending official policy*.
- **Contact:** a server-action form with inline errors, an error summary that receives
  focus, a honeypot, privacy messaging, and pre-filling from residence pages
  (`?type=leasing&residence=…`). Contact details stay as placeholders until verified, and
  nothing is invented.

### Legal and 404

| Placeholder legal pages | Custom 404 |
| --- | --- |
| ![Privacy policy placeholder](docs/screenshots/12-legal.jpg) | ![404 page](docs/screenshots/13-not-found.jpg) |

Privacy, Terms and Accessibility pages are structural outlines, marked clearly as not
legal advice or official policy.

### Mobile

<p>
  <img src="docs/screenshots/14-mobile-home.jpg" width="200" alt="Mobile home hero" />
  <img src="docs/screenshots/15-mobile-menu.jpg" width="200" alt="Mobile navigation drawer" />
  <img src="docs/screenshots/16-mobile-filters.jpg" width="200" alt="Mobile residence filters" />
  <img src="docs/screenshots/17-mobile-detail.jpg" width="200" alt="Mobile residence detail with inquiry bar" />
</p>

Layouts are reorganised for small screens rather than shrunk: the hero stacks, the menu
is a native `<dialog>` drawer, filters collapse behind a *Filters* toggle, and residence
pages keep a compact price-and-inquiry bar at the bottom. No horizontal overflow at 375 px.

---

## Resident Dashboard

A private area at `/dashboard` for residents. Every page requires sign-in, and every
data request is authorized on the server. The screenshots use the **development
fixtures** (fictional residents), which is why each page shows the *Development
fixtures* banner. Fixtures are disabled in production builds.

### Sign in

![Resident sign-in](docs/screenshots/20-dashboard-login.jpg)

- Signed, `HttpOnly` session cookie (HMAC-SHA256, 8-hour expiry); no database needed.
- Generic error messages, constant-time password comparison, rate limiting
  (5 attempts per 15 minutes per email and IP), and redirects only back into the dashboard.
- With no identity provider configured (for example in production before the RentCafe
  identity method is verified), this page explains that online sign-in isn't available
  and links to the official resident portal instead. There is no fake login.

### Overview

![Dashboard overview](docs/screenshots/21-dashboard-overview.jpg)

A personalised welcome, the resident's property and unit, move-in and lease-end dates,
**reminders derived only from real data** (for example a lease ending within 90 days, or
a request awaiting a reply), building announcements, a maintenance summary and
quick-access cards. Each panel has its own loading, empty, error and portal-fallback
state.

### My Residence

![My Residence](docs/screenshots/22-dashboard-residence.jpg)

Property and unit details, layout, amenities, lease status and dates, move-in
information, and a link to the official resident portal for renewals and lease workflows.

### Maintenance and service requests

![Maintenance list](docs/screenshots/23-dashboard-maintenance.jpg)

Open and completed requests with category, request number, submission and update dates,
and status labels (submitted, scheduled, in progress, awaiting reply, completed).

| New request: validation | Request submitted |
| --- | --- |
| ![New request validation](docs/screenshots/24-dashboard-new-request-validation.jpg) | ![Request submitted](docs/screenshots/25-dashboard-request-submitted.jpg) |

- New requests choose a category (plumbing, electrical, appliances, heating and cooling,
  furnishings, general), add a summary, details and entry permission, and are validated
  on the server. Emergency guidance points residents to phone contact instead.
- Photo attachments are only offered when the data source supports them; otherwise the
  form says so and points to the resident portal.
- When the connected system can't accept requests, the page links to the official
  portal rather than collecting requests that would go nowhere.

| Request detail and history | Another resident's request |
| --- | --- |
| ![Request detail](docs/screenshots/26-dashboard-request-detail.jpg) | ![Authorization: not found](docs/screenshots/27-dashboard-authorization.jpg) |

Every request is **ownership-checked**. Opening another resident's request by URL shows
the same *not found* page as a missing record, so ids can't be probed.

### Resident Guide

![Resident guide](docs/screenshots/28-dashboard-guide.jpg)

Move-in, building access, parking and amenities, utilities and Wi-Fi, property
guidelines, local Los Angeles recommendations, an FAQ and property-management contacts.
The content lives in one editable file (`src/content/resident-guide.ts`). Official policy
sections are marked as awaiting information from property management, and no access codes
or passwords are ever published there.

### Payments and Documents

| Payments: official portal fallback | Documents: secure downloads |
| --- | --- |
| ![Payments](docs/screenshots/29-dashboard-payments.jpg) | ![Documents](docs/screenshots/30-dashboard-documents.jpg) |

- **Payments:** the dashboard never processes payments or invents balances. Without a
  verified ledger integration it shows a clear explanation and a button to the official
  RentCafe payment portal. A payment summary and history view are ready for verified data.
- **Documents:** each download goes through `/api/resident/documents/[id]`, which
  re-checks the session and document ownership and responds with
  `Cache-Control: private, no-store`. There are no public file URLs.

### Help & Support and Account Settings

| Help & Support | Account Settings |
| --- | --- |
| ![Help and support](docs/screenshots/31-dashboard-support.jpg) | ![Account settings](docs/screenshots/32-dashboard-account.jpg) |

- **Help & Support:** a message form (the website's contact form, pre-filled with the
  resident's name and email), contact details, a resident portal link and common questions.
- **Account Settings:** a read-only profile (managed by the leasing record), session
  information and sign out.

### Dashboard on mobile

<p>
  <img src="docs/screenshots/33-dashboard-mobile-overview.jpg" width="240" alt="Mobile dashboard overview" />
  <img src="docs/screenshots/34-dashboard-mobile-menu.jpg" width="240" alt="Mobile dashboard menu" />
  <img src="docs/screenshots/35-dashboard-mobile-maintenance.jpg" width="240" alt="Mobile maintenance list" />
</p>

On desktop the navigation is a sidebar. On phones and tablets it becomes a top bar
showing the current section, with a drawer menu that includes the resident's name,
*Back to website* and *Sign out*.

### Security at a glance

- **Two layers of protection:** `src/proxy.ts` redirects unauthenticated requests before
  rendering, and every page, Server Action and route handler re-verifies the session
  through a Data Access Layer (`requireResident()`).
- **Server-side identity only:** resident data functions require an
  `AuthenticatedResident`, which only the Data Access Layer can create. Ids from URLs are
  always ownership-checked.
- **No secrets in the browser:** tokens and passwords live in server-side environment
  variables (the client bundle was scanned to confirm this). Dashboard pages are `noindex`
  and disallowed in `robots.txt`.
- **Verified:** forged and expired cookies are rejected; resident A can't reach resident
  B's requests or documents; sign-out ends access; axe-core reports 0 violations on all
  dashboard pages, desktop and mobile.

Full details and the steps for connecting live Yardi / RentCafe resident data are in
[docs/DASHBOARD.md](docs/DASHBOARD.md).

---

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
