import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  DashboardHeader,
  EmptyState,
  Loading,
  Panel,
  PanelSkeleton,
  SectionError,
  StatusLabel,
  isOpenStatus,
} from "@/components/dashboard/ui";
import { requireResident } from "@/lib/auth/dal";
import { residentPortalUrl } from "@/lib/resident/config";
import { categoryLabel, formatDay } from "@/lib/resident/format";
import { buildReminders } from "@/lib/resident/reminders";
import { getAnnouncements, getResidence, listMaintenanceRequests } from "@/lib/resident/service";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <Loading label="Loading your dashboard">
          <div className="mb-12 h-24 w-2/3 animate-pulse bg-stone-soft" />
          <div className="grid gap-6 lg:grid-cols-3">
            <PanelSkeleton className="lg:col-span-2" lines={4} />
            <PanelSkeleton />
          </div>
        </Loading>
      }
    >
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  const resident = await requireResident("/dashboard");
  const [residence, announcements, requests] = await Promise.all([
    getResidence(resident),
    getAnnouncements(resident),
    listMaintenanceRequests(resident),
  ]);
  const reminders = buildReminders(
    residence.ok ? residence.data : null,
    requests.ok ? requests.data : [],
  );

  const openRequests = requests.ok ? requests.data.filter((r) => isOpenStatus(r.status)) : [];

  return (
    <>
      <DashboardHeader
        eyebrow="Overview"
        title={<>Welcome back, {resident.firstName}.</>}
        description={
          residence.ok && residence.data ? (
            <p>
              {residence.data.propertyName} · Unit {residence.data.unit}
              {residence.data.neighborhood ? ` · ${residence.data.neighborhood}` : ""}
            </p>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Residence summary */}
        <Panel title="Your residence" className="lg:col-span-2" action={<ViewLink href="/dashboard/residence" />}>
          {residence.ok ? (
            residence.data ? (
              <dl className="grid gap-6 sm:grid-cols-3">
                <Fact label="Residence">
                  {residence.data.propertyName}, Unit {residence.data.unit}
                </Fact>
                <Fact label="Move-in">{residence.data.moveInDate ? formatDay(residence.data.moveInDate) : "—"}</Fact>
                <Fact label="Lease ends">{residence.data.leaseEndDate ? formatDay(residence.data.leaseEndDate) : "—"}</Fact>
              </dl>
            ) : (
              <EmptyState title="No residence on file">
                We couldn&rsquo;t find a residence linked to your account. Please contact the team.
              </EmptyState>
            )
          ) : residence.reason === "unavailable" ? (
            <SectionError message={residence.message} />
          ) : (
            <PortalNote>Residence and lease details are available in the official resident portal.</PortalNote>
          )}
        </Panel>

        {/* Reminders */}
        <Panel title="Reminders">
          {reminders.length > 0 ? (
            <ul className="space-y-5">
              {reminders.map((r) => (
                <li key={r.text} className="border-l-2 border-olive pl-4">
                  <p className="text-[0.9375rem] leading-relaxed">{r.text}</p>
                  <Link href={r.href} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
                    {r.cta}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.9375rem] leading-relaxed text-muted">You&rsquo;re all caught up. Nothing needs your attention right now.</p>
          )}
        </Panel>

        {/* Announcements */}
        <Panel title="Announcements" className="lg:col-span-2">
          {announcements.ok ? (
            announcements.data.length > 0 ? (
              <ul className="divide-y divide-line">
                {announcements.data.map((a) => (
                  <li key={a.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-medium">{a.title}</h3>
                      {a.priority === "important" && (
                        <span className="eyebrow text-[0.625rem] text-olive-ink">Important</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      <time dateTime={a.publishedAt}>{formatDay(a.publishedAt)}</time>
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No announcements">Building updates from the team will appear here.</EmptyState>
            )
          ) : announcements.reason === "unavailable" ? (
            <SectionError message={announcements.message} />
          ) : (
            <PortalNote>Building announcements will appear here once connected to the property management system.</PortalNote>
          )}
        </Panel>

        {/* Maintenance summary */}
        <Panel title="Maintenance" action={<ViewLink href="/dashboard/maintenance" />}>
          {requests.ok ? (
            <>
              <p className="font-serif text-5xl leading-none">{openRequests.length}</p>
              <p className="mt-2 text-sm text-muted">open {openRequests.length === 1 ? "request" : "requests"}</p>
              {openRequests[0] && (
                <Link href={`/dashboard/maintenance/${openRequests[0].id}`} className="group mt-6 block border-t border-line pt-5">
                  <p className="text-xs text-muted">{categoryLabel(openRequests[0].category)}</p>
                  <p className="mt-1 font-medium group-hover:underline group-hover:underline-offset-4">{openRequests[0].title}</p>
                  <div className="mt-3">
                    <StatusLabel status={openRequests[0].status} />
                  </div>
                </Link>
              )}
            </>
          ) : requests.reason === "unavailable" ? (
            <SectionError message={requests.message} />
          ) : (
            <PortalNote>Track and submit maintenance requests in the official resident portal.</PortalNote>
          )}
        </Panel>
      </div>

      {/* Quick access */}
      <section aria-labelledby="quick-access" className="mt-14">
        <h2 id="quick-access" className="eyebrow mb-5 text-olive-ink">
          Quick access
        </h2>
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/dashboard/maintenance/new", title: "Request maintenance", body: "Report an issue in your residence." },
            { href: "/dashboard/payments", title: "Payments", body: "Rent and billing through the official portal." },
            { href: "/dashboard/documents", title: "Documents", body: "Your lease and move-in paperwork." },
            { href: "/dashboard/guide", title: "Resident guide", body: "Move-in, amenities and local favorites." },
          ].map((card) => (
            <li key={card.href} className="bg-paper">
              <Link href={card.href} className="group flex h-full flex-col p-6 transition-colors hover:bg-stone-soft">
                <span className="font-serif text-xl">{card.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{card.body}</span>
                <span aria-hidden="true" className="mt-6 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-serif text-2xl leading-snug">{children}</dd>
    </div>
  );
}

function ViewLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm font-medium whitespace-nowrap underline-offset-4 hover:underline">
      View all
    </Link>
  );
}

function PortalNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.9375rem] leading-relaxed text-muted">
      <p>{children}</p>
      {residentPortalUrl && (
        <a href={residentPortalUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-charcoal underline underline-offset-4">
          Open resident portal<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
