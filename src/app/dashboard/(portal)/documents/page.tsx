import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardHeader, EmptyState, Loading, PanelSkeleton, PortalFallback, SectionError } from "@/components/dashboard/ui";
import { requireResident } from "@/lib/auth/dal";
import { residentPortalUrl } from "@/lib/resident/config";
import { formatDay } from "@/lib/resident/format";
import { getCapabilities, listDocuments } from "@/lib/resident/service";
import type { ResidentDocument } from "@/lib/resident/types";

export const metadata: Metadata = { title: "Documents" };

const categoryLabels: Record<ResidentDocument["category"], string> = {
  lease: "Lease",
  addendum: "Addendum",
  "move-in": "Move-in",
  notice: "Notice",
  other: "Other",
};

export default function DocumentsPage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Documents & lease"
        title="Your documents."
        description="Lease agreements and residence paperwork shared with you."
      />
      <Suspense
        fallback={
          <Loading label="Loading documents">
            <PanelSkeleton lines={4} />
          </Loading>
        }
      >
        <Documents />
      </Suspense>
    </>
  );
}

async function Documents() {
  const resident = await requireResident("/dashboard/documents");
  const result = await listDocuments(resident);
  const canDownload = getCapabilities().documentsDownload;

  if (!result.ok) {
    return result.reason === "unavailable" ? (
      <SectionError message={result.message} />
    ) : (
      <PortalFallback title="Your lease and documents are in the resident portal." cta="Open Document Portal">
        Signed leases, addenda and notices are stored securely in the official RentCafe resident portal.
      </PortalFallback>
    );
  }

  if (result.data.length === 0) {
    return (
      <EmptyState title="No documents yet">
        Documents shared with you by the leasing team will appear here.
      </EmptyState>
    );
  }

  return (
    <>
      <ul className="divide-y divide-line border border-line bg-paper">
        {result.data.map((doc) => (
          <li key={doc.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-muted">{categoryLabels[doc.category]}</p>
              <p className="mt-1 font-medium">{doc.label}</p>
              <p className="mt-1 text-sm text-muted">Issued {formatDay(doc.issuedAt)}</p>
            </div>
            {canDownload ? (
              // Served by an authenticated route that checks ownership on every request.
              <a
                href={`/api/resident/documents/${encodeURIComponent(doc.id)}`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center border border-charcoal px-5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-charcoal hover:text-ivory"
              >
                Download<span className="sr-only"> {doc.label}</span>
              </a>
            ) : residentPortalUrl ? (
              <a href={residentPortalUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">
                View in portal<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Documents are private to you and are only available while you&rsquo;re signed in.
      </p>
    </>
  );
}
