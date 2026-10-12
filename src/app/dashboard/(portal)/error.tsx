"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="max-w-xl border border-line bg-paper p-8 sm:p-10">
      <p className="eyebrow text-taupe-ink">Something went wrong</p>
      <h1 className="mt-4 font-serif text-title">We couldn&rsquo;t load this page.</h1>
      <p className="mt-4 leading-relaxed text-muted">Please try again. If the problem continues, contact the team.</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Button onClick={() => retry()}>Try Again</Button>
        <Link href="/dashboard/support" className="text-sm underline underline-offset-4">
          Help &amp; Support
        </Link>
      </div>
    </div>
  );
}
