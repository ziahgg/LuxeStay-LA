import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  DashboardHeader,
  EmptyState,
  Loading,
  PanelSkeleton,
  PortalFallback,
  SectionError,
  StatusLabel,
  isOpenStatus,
} from "@/components/dashboard/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireResident } from "@/lib/auth/dal";
import { categoryLabel, formatDay } from "@/lib/resident/format";
import { getCapabilities, listMaintenanceRequests } from "@/lib/resident/service";
import type { MaintenanceRequest } from "@/lib/resident/types";

export const metadata: Metadata = { title: "Maintenance" };

export default function MaintenancePage() {
  const caps = getCapabilities();
  return (
    <>
      <DashboardHeader
        eyebrow="Maintenance & service"
        title="Maintenance requests."
        description="Report an issue and follow its progress."
        actions={
          caps.maintenanceCreate ? (
            <ButtonLink href="/dashboard/maintenance/new" arrow>
              New Request
            </ButtonLink>
          ) : null
        }
      />
      <Suspense
        fallback={
          <Loading label="Loading maintenance requests">
            <PanelSkeleton lines={5} />
          </Loading>
        }
      >
        <RequestList />
      </Suspense>
    </>
  );
}

async function RequestList() {
  const resident = await requireResident("/dashboard/maintenance");
  const result = await listMaintenanceRequests(resident);

  if (!result.ok) {
    return result.reason === "unavailable" ? (
      <SectionError message={result.message} />
    ) : (
      <PortalFallback title="Submit and track requests in the resident portal." cta="Open Maintenance Portal">
        Maintenance requests are handled through the official RentCafe resident portal, so your request reaches the
        maintenance team directly. Requests will appear here once the dashboard is connected.
      </PortalFallback>
    );
  }

  const open = result.data.filter((r) => isOpenStatus(r.status));
  const closed = result.data.filter((r) => !isOpenStatus(r.status));

  if (result.data.length === 0) {
    return (
      <EmptyState title="No maintenance requests">
        When you report an issue, you&rsquo;ll be able to follow its progress here.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-12">
      <RequestGroup title="Open" requests={open} empty="No open requests." />
      <RequestGroup title="Completed" requests={closed} empty="No completed requests yet." />
    </div>
  );
}

function RequestGroup({ title, requests, empty }: { title: string; requests: MaintenanceRequest[]; empty: string }) {
  return (
    <section aria-labelledby={`group-${title}`}>
      <h2 id={`group-${title}`} className="eyebrow mb-4 text-olive-ink">
        {title} <span className="text-muted">({requests.length})</span>
      </h2>
      {requests.length === 0 ? (
        <p className="border border-line bg-paper px-6 py-5 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-line border border-line bg-paper">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                href={`/dashboard/maintenance/${r.id}`}
                className="group grid gap-3 px-6 py-5 transition-colors hover:bg-stone-soft sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted">
                    {categoryLabel(r.category)} · #{r.id}
                  </p>
                  <p className="mt-1 font-medium group-hover:underline group-hover:underline-offset-4">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    Submitted {formatDay(r.submittedAt)} · Updated {formatDay(r.updatedAt)}
                  </p>
                </div>
                <StatusLabel status={r.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
