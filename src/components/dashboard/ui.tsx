import type { ReactNode } from "react";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { residentPortalUrl } from "@/lib/resident/config";
import type { MaintenanceStatus } from "@/lib/resident/types";

/** Page heading used across dashboard pages. */
export function DashboardHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-4 text-olive-ink">{eyebrow}</p>}
        <h1 className="font-serif text-[clamp(2.25rem,1.7rem+2vw,3.25rem)] leading-[1.05] font-normal">{title}</h1>
        {description && <div className="mt-4 leading-relaxed text-muted">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

/** Bordered content panel — the dashboard's primary surface. */
export function Panel({
  title,
  action,
  children,
  className = "",
  as: Tag = "section",
  headingLevel: H = "h2",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Tag className={`@container border border-line bg-paper p-6 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-6 flex items-baseline justify-between gap-4">
          {title && <H className="font-serif text-2xl leading-tight">{title}</H>}
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

/** Definition-list row used for residence and account details. */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    // Sized by its panel (container query): label/value side by side when narrow, aligned columns when wide.
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-4 last:border-b-0 @xl:grid @xl:grid-cols-[12rem_1fr] @xl:gap-6">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-right @xl:text-left">{children}</dd>
    </div>
  );
}

export function NotProvided({ children = "Not provided" }: { children?: ReactNode }) {
  return <span className="text-muted italic">{children}</span>;
}

/**
 * Shown when a capability isn't supported by the connected data source.
 * Points residents to the official RentCafe workflow instead of a fake UI.
 */
export function PortalFallback({
  title,
  children,
  cta = "Open Resident Portal",
}: {
  title: string;
  children: ReactNode;
  cta?: string;
}) {
  return (
    <div className="border border-line bg-paper px-6 py-10 sm:px-10 sm:py-12">
      <p className="eyebrow text-taupe-ink">Official resident portal</p>
      <h2 className="mt-4 max-w-xl font-serif text-title">{title}</h2>
      <div className="mt-4 max-w-xl leading-relaxed text-muted">{children}</div>
      <div className="mt-8 flex flex-wrap gap-3">
        {residentPortalUrl ? (
          <ExternalButtonLink href={residentPortalUrl}>{cta}</ExternalButtonLink>
        ) : (
          <p className="border-l-2 border-taupe bg-stone-soft px-4 py-3 text-sm text-muted">
            The resident portal link will be added once provided by LuxeStay LA.
          </p>
        )}
        <ButtonLink href="/dashboard/support" variant="secondary">
          Contact Support
        </ButtonLink>
      </div>
    </div>
  );
}

/** Error state for a section whose data source failed. */
export function SectionError({ message }: { message: string }) {
  return (
    <div role="alert" className="border-l-2 border-error bg-paper px-5 py-4 text-sm text-error">
      {message}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-line px-6 py-10 text-center">
      <p className="font-serif text-xl">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{children}</div>}
    </div>
  );
}

export function PanelSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`border border-line bg-paper p-6 sm:p-8 ${className}`}>
      <div className="h-6 w-40 animate-pulse bg-stone" />
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="mt-4 h-4 animate-pulse bg-stone-soft" style={{ width: `${90 - i * 15}%` }} />
      ))}
    </div>
  );
}

/** Accessible loading wrapper: announces once, hides decorative skeletons. */
export function Loading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

const statusStyles: Record<MaintenanceStatus, { label: string; dot: string }> = {
  submitted: { label: "Submitted", dot: "bg-taupe-ink" },
  scheduled: { label: "Scheduled", dot: "bg-olive" },
  "in-progress": { label: "In progress", dot: "bg-olive-ink" },
  "awaiting-resident": { label: "Awaiting your reply", dot: "bg-error" },
  completed: { label: "Completed", dot: "bg-charcoal/30" },
  cancelled: { label: "Cancelled", dot: "bg-charcoal/20" },
};

export function StatusLabel({ status }: { status: MaintenanceStatus }) {
  const s = statusStyles[status];
  return (
    <span className="inline-flex w-fit items-center gap-2 border border-line bg-ivory px-2.5 py-1 text-xs font-medium whitespace-nowrap">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export const isOpenStatus = (s: MaintenanceStatus) => s !== "completed" && s !== "cancelled";
