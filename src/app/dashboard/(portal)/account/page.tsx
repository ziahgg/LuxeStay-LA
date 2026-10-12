import type { Metadata } from "next";
import { Suspense } from "react";
import { signOut } from "@/app/dashboard/actions";
import { DashboardHeader, DetailRow, Loading, Panel, PanelSkeleton } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { requireResident } from "@/lib/auth/dal";
import { SESSION_TTL_SECONDS } from "@/lib/auth/token";
import { residentPortalUrl } from "@/lib/resident/config";

export const metadata: Metadata = { title: "Account Settings" };

export default function AccountPage() {
  return (
    <>
      <DashboardHeader eyebrow="Account" title="Account settings." />
      <Suspense
        fallback={
          <Loading label="Loading account">
            <PanelSkeleton lines={4} />
          </Loading>
        }
      >
        <Account />
      </Suspense>
    </>
  );
}

async function Account() {
  const resident = await requireResident("/dashboard/account");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Profile" className="lg:col-span-2">
        <dl>
          <DetailRow label="Name">
            {resident.firstName} {resident.lastName}
          </DetailRow>
          <DetailRow label="Email">{resident.email}</DetailRow>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Your profile is managed by your leasing record. To update your name, email or password, use the resident
          portal or contact the team.
          {residentPortalUrl && (
            <>
              {" "}
              <a href={residentPortalUrl} target="_blank" rel="noopener noreferrer" className="text-charcoal underline underline-offset-4">
                Open resident portal<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          )}
        </p>
      </Panel>

      <Panel title="Session">
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          For your security, you&rsquo;re signed out automatically after {SESSION_TTL_SECONDS / 3600} hours. Always sign
          out on shared devices.
        </p>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="secondary" className="w-full">
            Sign Out
          </Button>
        </form>
      </Panel>
    </div>
  );
}
