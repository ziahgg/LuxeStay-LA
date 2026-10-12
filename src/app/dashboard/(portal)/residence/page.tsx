import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  DashboardHeader,
  DetailRow,
  EmptyState,
  Loading,
  NotProvided,
  Panel,
  PanelSkeleton,
  PortalFallback,
  SectionError,
} from "@/components/dashboard/ui";
import { ExternalButtonLink } from "@/components/ui/button";
import { requireResident } from "@/lib/auth/dal";
import { residentPortalUrl } from "@/lib/resident/config";
import { formatDay, leaseStatusLabel } from "@/lib/resident/format";
import { getCapabilities, getResidence } from "@/lib/resident/service";

export const metadata: Metadata = { title: "My Residence" };

export default function ResidencePage() {
  return (
    <>
      <DashboardHeader eyebrow="My Residence" title="Your home with LuxeStay." />
      <Suspense
        fallback={
          <Loading label="Loading your residence">
            <div className="grid gap-6 lg:grid-cols-3">
              <PanelSkeleton className="lg:col-span-2" lines={6} />
              <PanelSkeleton lines={4} />
            </div>
          </Loading>
        }
      >
        <ResidenceDetails />
      </Suspense>
    </>
  );
}

async function ResidenceDetails() {
  const resident = await requireResident("/dashboard/residence");
  const result = await getResidence(resident);
  const caps = getCapabilities();

  if (!result.ok) {
    return result.reason === "unavailable" ? (
      <SectionError message={result.message} />
    ) : (
      <PortalFallback title="Residence and lease details are in the resident portal.">
        Your unit, lease dates and lease status are managed in the official RentCafe resident portal. They&rsquo;ll
        appear here once the dashboard is connected to the property management system.
      </PortalFallback>
    );
  }

  const r = result.data;
  if (!r) {
    return (
      <EmptyState title="No residence linked to your account">
        If you&rsquo;ve recently signed a lease, it may take a little time to appear. Please{" "}
        <Link href="/dashboard/support" className="underline underline-offset-4">
          contact the team
        </Link>{" "}
        if this continues.
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Panel title={`${r.propertyName}, Unit ${r.unit}`}>
          <dl>
            <DetailRow label="Property">
              {r.propertyName}
              {r.propertySlug && (
                <Link href={`/residences/${r.propertySlug}`} className="ml-3 text-sm text-muted underline underline-offset-4">
                  View listing
                </Link>
              )}
            </DetailRow>
            <DetailRow label="Unit">{r.unit}</DetailRow>
            <DetailRow label="Neighborhood">{r.neighborhood ?? <NotProvided />}</DetailRow>
            <DetailRow label="Layout">
              {r.bedrooms !== undefined ? (
                <>
                  {r.bedrooms === 0 ? "Studio" : `${r.bedrooms} bedroom${r.bedrooms === 1 ? "" : "s"}`}
                  {r.bathrooms !== undefined ? ` · ${r.bathrooms} bath${r.bathrooms === 1 ? "" : "s"}` : ""}
                </>
              ) : (
                <NotProvided />
              )}
            </DetailRow>
          </dl>
        </Panel>

        <Panel title="Amenities">
          {r.amenities.length > 0 ? (
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {r.amenities.map((a) => (
                <li key={a} className="flex items-center gap-4 border-b border-line py-3.5 text-[0.9375rem]">
                  <span aria-hidden="true" className="h-px w-4 bg-olive" />
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No amenities are listed for your residence.</p>
          )}
        </Panel>

        <Panel title="Move-in information" headingLevel="h2">
          {r.moveInNotes && r.moveInNotes.length > 0 ? (
            <ol className="space-y-3 text-[0.9375rem] leading-relaxed">
              {r.moveInNotes.map((n, i) => (
                <li key={n} className="grid grid-cols-[2rem_1fr]">
                  <span aria-hidden="true" className="font-serif text-lg text-taupe-ink">
                    {i + 1}.
                  </span>
                  {n}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted">No move-in notes have been provided for your residence.</p>
          )}
          <Link href="/dashboard/guide#move-in" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
            Read the full move-in guide
          </Link>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Lease">
          <dl>
            <DetailRow label="Status">{r.leaseStatus ? leaseStatusLabel[r.leaseStatus] : <NotProvided />}</DetailRow>
            <DetailRow label="Move-in">{r.moveInDate ? formatDay(r.moveInDate) : <NotProvided />}</DetailRow>
            <DetailRow label="Lease start">{r.leaseStartDate ? formatDay(r.leaseStartDate) : <NotProvided />}</DetailRow>
            <DetailRow label="Lease end">{r.leaseEndDate ? formatDay(r.leaseEndDate) : <NotProvided />}</DetailRow>
          </dl>
          {caps.documentsList && (
            <Link href="/dashboard/documents" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
              View lease documents
            </Link>
          )}
        </Panel>

        <Panel title="Resident portal" headingLevel="h2">
          <p className="text-[0.9375rem] leading-relaxed text-muted">
            Renewals, payments and official lease workflows are handled in the RentCafe resident portal.
          </p>
          {residentPortalUrl ? (
            <ExternalButtonLink href={residentPortalUrl} variant="secondary" className="mt-6 w-full">
              Open Resident Portal
            </ExternalButtonLink>
          ) : (
            <p className="mt-6 text-sm text-muted italic">Portal link to be provided by LuxeStay LA.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
