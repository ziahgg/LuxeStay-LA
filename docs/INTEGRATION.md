# Yardi / RentCafe Integration

**Status: not implemented. The integration method has not been verified yet.**

No API documentation, credentials, account permissions or details of the existing
website were available during the build. Following the project brief, nothing about
Yardi or RentCafe endpoints, authentication or capabilities has been assumed. The
site ships with:

- a vendor-neutral **adapter interface** (`src/lib/properties/adapter.ts`);
- a **sample adapter** with clearly labelled fictional data (the default);
- a **RentCafe adapter stub** (`src/lib/properties/rentcafe-adapter.ts`) that reads
  server-side configuration but refuses to run until it is implemented;
- **graceful fallbacks**: if the selected source is not configured or is unavailable,
  pages render a helpful notice with the inquiry form and (if configured) the
  official leasing portal. The site stays usable.

## Architecture

```
Pages / components
      │  (only import from service.ts)
      ▼
src/lib/properties/service.ts   ← selects adapter, caches reads ("use cache"),
      │                           converts failures into DataResult states
      ├─ sample-adapter.ts      ← PROPERTY_DATA_SOURCE=sample (default)
      └─ rentcafe-adapter.ts    ← PROPERTY_DATA_SOURCE=rentcafe
              │
              ▼
        Internal model: src/lib/properties/types.ts (Property, Availability, Pricing…)
```

- Adapters are `server-only`; credentials are read from environment variables and
  never reach the browser.
- Filtering, sorting and pagination (`query.ts`) operate on the internal model, so
  they work with any source. If the upstream API supports server-side filtering,
  push filters into the adapter for efficiency.
- Successful reads are cached for minutes (`cacheLife("minutes")`, tag
  `properties`). Failures are never cached. Call `revalidateTag("properties")` from a
  webhook route to refresh immediately when Yardi pushes changes.

## Step 1: Verify the integration method (with the client and Yardi)

Confirm the following before writing any adapter code:

| Question | Why it matters |
| --- | --- |
| Which Yardi products are licensed (Voyager, RentCafe CRM, RentCafe website/marketing)? | Determines which data feeds exist. |
| Is API access included, or must it be requested or purchased? Is this an approved Yardi interface? | Some feeds require partner or interface agreements. |
| What is the documented method: a REST/HTTP API, an XML/ILS feed (for example MITS), or a scheduled export? | Determines the fetch and mapping code. |
| What authentication is used (API token, company/property codes, IP allow-listing)? | Determines the env vars and hosting constraints. |
| Which fields are available: unit types, floor plans, rent ranges, availability dates, amenities, photos? | Determines which UI sections can show live data. |
| Are photos served from a CDN host we may hot-link? | Needs adding to `images.remotePatterns` in `next.config.ts`. |
| What is the official application / leasing URL per property? | Powers the "Apply to Lease" CTA (`leasing.applyUrl`). |
| Is there a lead or guest-card endpoint for inquiries? | Could become the `CONTACT_WEBHOOK_URL` target. |
| What are the rate limits and terms on display/caching of pricing? | Affects `cacheLife` and disclaimers. |
| What existing leasing functionality must be preserved (current site, portal links)? | Must not be replaced by a non-functional form. |

## Step 2: Implement the adapter

In `src/lib/properties/rentcafe-adapter.ts`:

1. Implement `fetchFromRentCafe(config)` against the **documented** endpoints. Use
   `fetch` with a timeout (`AbortSignal.timeout`) and throw
   `IntegrationUnavailableError` on non-2xx responses.
2. Implement `mapToProperty(record)`:
   - Derive a stable `slug` (for example from the property code plus name) so URLs
     do not change between syncs.
   - Leave optional fields **undefined** when the source does not provide them
     (`pricing`, `availability.availableFrom`, `squareFeet`, `floorPlans`…). The UI
     already handles missing data ("Pricing on request", "Availability on request").
   - Set `source: "rentcafe"`.
   - Set `leasing.applyUrl` to the official application URL.
3. Adjust `readConfig()` and the env var names to match the confirmed method.
4. Set `IMPLEMENTED = true`.
5. Add the image host to `next.config.ts` → `images.remotePatterns`.
6. Set `PROPERTY_DATA_SOURCE=rentcafe` and the credentials in the hosting provider.

## Step 3: Test

- [ ] Listing page shows live residences; filters return the expected results.
- [ ] Detail pages render for every slug; missing fields degrade gracefully.
- [ ] Prices and availability match the property management system exactly.
- [ ] "Apply to Lease" opens the official leasing flow for the correct property.
- [ ] Simulated outage (bad token or unreachable host) shows the "unavailable"
      state, not an error page.
- [ ] No credentials appear in client bundles (search `.next/static` for the token).
- [ ] Sample-data labels no longer appear anywhere.
- [ ] Live property pages are indexable and emit `Apartment` JSON-LD; the sitemap
      includes them.

## Notes

- **Unknown slugs** return the not-found UI with `noindex`. Because detail pages
  stream, the HTTP status is 200 (a documented Next.js behaviour). If a hard 404
  status is required, add a fast slug check in `src/proxy.ts` (see the Next.js
  Proxy docs) against a cached slug list.
- If no listings can be fetched at build time, `generateStaticParams` returns a
  reserved slug (`listings-unavailable`), because Cache Components requires at
  least one entry. That page only shows the "unavailable" state.
