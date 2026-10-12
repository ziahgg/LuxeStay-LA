"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Logo } from "@/components/layout/logo";

export const dashboardNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/residence", label: "My Residence" },
  { href: "/dashboard/maintenance", label: "Maintenance" },
  { href: "/dashboard/guide", label: "Resident Guide" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/support", label: "Help & Support" },
  { href: "/dashboard/account", label: "Account Settings" },
] as const;

const isActiveFor = (pathname: string | null) => (href: string) =>
  pathname !== null &&
  (href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

function NavItems({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  const isActive = isActiveFor(pathname);
  return (
    <ul className="space-y-0.5">
      {dashboardNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(item.href) ? "page" : undefined}
            className="relative flex min-h-11 items-center px-4 text-[0.9375rem] text-muted transition-colors hover:bg-stone-soft hover:text-charcoal aria-[current=page]:bg-stone-soft aria-[current=page]:font-medium aria-[current=page]:text-charcoal aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:left-0 aria-[current=page]:before:w-0.5 aria-[current=page]:before:bg-olive"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ActiveNavItems({ onNavigate }: { onNavigate?: () => void }) {
  return <NavItems pathname={usePathname()} onNavigate={onNavigate} />;
}

/**
 * The pathname is request data on dynamic routes, so the active state streams
 * in behind Suspense; the fallback is the same menu without a highlight.
 */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavItems pathname={null} onNavigate={onNavigate} />}>
      <ActiveNavItems onNavigate={onNavigate} />
    </Suspense>
  );
}

/** Desktop sidebar navigation. `footer` is server-rendered (resident name, sign out). */
export function DashboardSidebar({ footer }: { footer: ReactNode }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-line bg-paper lg:flex">
      <div className="px-7 pt-8 pb-10">
        <Link href="/dashboard" aria-label="LuxeStay LA Resident Dashboard — overview">
          <Logo tone="dark" decorative className="h-11" />
        </Link>
        <p className="eyebrow mt-5 text-olive-ink">Resident Dashboard</p>
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3">
        <NavList />
      </nav>
      <div className="border-t border-line px-7 py-6">{footer}</div>
    </aside>
  );
}

/** Mobile/tablet top bar with a modal navigation drawer (native <dialog>). */
function CurrentSectionLabel() {
  const pathname = usePathname();
  const current = dashboardNav.find((i) => (i.href === "/dashboard" ? pathname === i.href : pathname.startsWith(i.href)));
  return <>{current?.label ?? "Menu"}</>;
}

/** Closes the drawer whenever the route changes. */
function CloseOnNavigate({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const pathname = usePathname();
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname, dialogRef]);
  return null;
}

export function DashboardMobileNav({ footer }: { footer: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory/95 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8">
        <Link href="/dashboard" aria-label="LuxeStay LA Resident Dashboard — overview">
          <Logo tone="dark" decorative className="h-9" />
        </Link>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 items-center gap-3 text-sm font-medium"
        >
          <span className="max-w-[9rem] truncate">
            <Suspense fallback="Menu">
              <CurrentSectionLabel />
            </Suspense>
          </span>
          <svg aria-hidden="true" width="20" height="12" viewBox="0 0 24 14" fill="none">
            <path d="M0 1h24M0 7h24M8 13h16" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="sr-only">Open dashboard menu</span>
        </button>
      </div>

      <Suspense fallback={null}>
        <CloseOnNavigate dialogRef={dialogRef} />
      </Suspense>
      <dialog
        ref={dialogRef}
        aria-label="Dashboard menu"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-paper p-0 text-charcoal backdrop:bg-charcoal/40 open:animate-[drawer-in_0.4s_var(--ease-out-soft)]"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-5">
            <p className="eyebrow text-olive-ink">Resident Dashboard</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
              aria-label="Close menu"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1l14 14M15 1 1 15" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-2 pt-2">
            <NavList onNavigate={() => dialogRef.current?.close()} />
          </nav>
          <div className="border-t border-line px-5 py-6">{footer}</div>
        </div>
      </dialog>
    </header>
  );
}
