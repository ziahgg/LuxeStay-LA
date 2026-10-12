import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MaintenanceForm } from "@/components/dashboard/maintenance-form";
import { DashboardHeader, Loading, PanelSkeleton, PortalFallback } from "@/components/dashboard/ui";
import { requireResident } from "@/lib/auth/dal";
import { residentPortalUrl } from "@/lib/resident/config";
import { getCapabilities } from "@/lib/resident/service";

export const metadata: Metadata = { title: "New Maintenance Request" };

export default function NewRequestPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/dashboard/maintenance" className="underline-offset-4 hover:text-charcoal hover:underline">
          ← Maintenance
        </Link>
      </nav>
      <DashboardHeader eyebrow="Maintenance & service" title="Report an issue." />
      <Suspense
        fallback={
          <Loading label="Loading form">
            <PanelSkeleton lines={6} />
          </Loading>
        }
      >
        <NewRequest />
      </Suspense>
    </>
  );
}

async function NewRequest() {
  await requireResident("/dashboard/maintenance/new");
  const caps = getCapabilities();

  if (!caps.maintenanceCreate) {
    return (
      <PortalFallback title="Submit maintenance requests in the resident portal." cta="Open Maintenance Portal">
        Online requests from this dashboard aren&rsquo;t connected yet. The resident portal sends your request directly
        to the maintenance team.
      </PortalFallback>
    );
  }

  return (
    <div className="max-w-2xl border border-line bg-paper p-6 sm:p-10">
      <MaintenanceForm attachmentsSupported={caps.maintenanceAttachments} portalUrl={residentPortalUrl} />
    </div>
  );
}
