import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/dashboard/actions";
import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard/nav";
import { getCurrentResident } from "@/lib/auth/dal";
import { isUsingFixtures } from "@/lib/resident/service";

/**
 * Authenticated dashboard shell. The shell itself is static (prerenderable);
 * anything that reads the session streams in behind <Suspense>. Route access
 * is enforced by src/proxy.ts and re-checked by requireResident() on each page.
 */
export default function PortalLayout({ children }: LayoutProps<"/dashboard">) {
  const footer = (
    <Suspense fallback={<div className="h-20 animate-pulse bg-stone-soft" aria-hidden="true" />}>
      <ResidentFooter />
    </Suspense>
  );

  return (
    <div className="min-h-dvh bg-ivory">
      <DashboardSidebar footer={footer} />
      <DashboardMobileNav footer={footer} />
      <div className="lg:pl-72">
        {isUsingFixtures() && (
          <aside
            aria-label="Development notice"
            className="border-b border-taupe/40 bg-stone-soft px-5 py-2.5 text-center text-xs text-taupe-ink sm:px-8"
          >
            <strong className="font-semibold">Development fixtures:</strong> the resident, residence, requests and
            documents shown are fictional test data, not real resident records.
          </aside>
        )}
        <main id="main" className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-14">
          {children}
        </main>
      </div>
    </div>
  );
}

async function ResidentFooter() {
  const resident = await getCurrentResident();
  return (
    <div className="space-y-4 text-sm">
      {resident && (
        <p className="leading-snug">
          <span className="block font-medium">
            {resident.firstName} {resident.lastName}
          </span>
          <span className="block truncate text-muted">{resident.email}</span>
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="text-muted underline-offset-4 hover:text-charcoal hover:underline">
          Back to website
        </Link>
        <form action={signOut}>
          <button type="submit" className="min-h-11 font-medium underline-offset-4 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
