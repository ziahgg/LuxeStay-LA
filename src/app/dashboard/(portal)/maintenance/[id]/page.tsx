import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  DetailRow,
  Loading,
  Panel,
  PanelSkeleton,
  PortalFallback,
  SectionError,
  StatusLabel,
} from "@/components/dashboard/ui";
import { requireResident } from "@/lib/auth/dal";
import { categoryLabel, formatDayTime } from "@/lib/resident/format";
import { getMaintenanceRequest } from "@/lib/resident/service";

export const metadata: Metadata = { title: "Maintenance Request" };

export default function RequestPage(props: PageProps<"/dashboard/maintenance/[id]">) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/dashboard/maintenance" className="underline-offset-4 hover:text-charcoal hover:underline">
          ← Maintenance
        </Link>
      </nav>
      <Suspense
        fallback={
          <Loading label="Loading request">
            <PanelSkeleton lines={6} />
          </Loading>
        }
      >
        <RequestDetail {...props} />
      </Suspense>
    </>
  );
}

async function RequestDetail({ params, searchParams }: PageProps<"/dashboard/maintenance/[id]">) {
  const { id } = await params;
  const resident = await requireResident(`/dashboard/maintenance/${id}`);
  const [result, sp] = await Promise.all([getMaintenanceRequest(resident, id), searchParams]);

  if (!result.ok) {
    return result.reason === "unavailable" ? (
      <SectionError message={result.message} />
    ) : (
      <PortalFallback title="Request details are in the resident portal.">
        Maintenance requests are managed in the official resident portal.
      </PortalFallback>
    );
  }
  // Requests owned by other residents are indistinguishable from missing ones.
  if (!result.data) notFound();

  const r = result.data;
  return (
    <>
      {sp.submitted === "1" && (
        <div role="status" className="mb-8 border-l-2 border-success bg-paper px-5 py-4 text-sm">
          <strong className="font-semibold">Request submitted.</strong> The team will review it and update the status here.
        </div>
      )}

      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow text-olive-ink">
          {categoryLabel(r.category)} · Request #{r.id}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,1.6rem+1.6vw,3rem)] leading-tight">{r.title}</h1>
        <div className="mt-5">
          <StatusLabel status={r.status} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Details" className="lg:col-span-2">
          <p className="leading-relaxed whitespace-pre-line">{r.description}</p>
          <dl className="mt-8 border-t border-line">
            <DetailRow label="Submitted">{formatDayTime(r.submittedAt)}</DetailRow>
            <DetailRow label="Last update">{formatDayTime(r.updatedAt)}</DetailRow>
            <DetailRow label="Entry permission">
              {r.permissionToEnter === undefined
                ? "—"
                : r.permissionToEnter
                  ? "May enter if I'm not home"
                  : "Arrange a time with me"}
            </DetailRow>
          </dl>
        </Panel>

        <Panel title="History">
          <ol className="relative space-y-6 border-l border-line pl-6">
            {[...r.history].reverse().map((event) => (
              <li key={`${event.at}-${event.status}`} className="relative">
                <span aria-hidden="true" className="absolute top-1.5 -left-[1.6875rem] h-2.5 w-2.5 rounded-full border border-paper bg-olive" />
                <StatusLabel status={event.status} />
                <p className="mt-2 text-sm text-muted">
                  <time dateTime={event.at}>{formatDayTime(event.at)}</time>
                </p>
                {event.note && <p className="mt-2 text-[0.9375rem] leading-relaxed">{event.note}</p>}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
