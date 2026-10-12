import { ButtonLink } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="max-w-xl border border-line bg-paper p-8 sm:p-10">
      <p className="eyebrow text-taupe-ink">Not found</p>
      <h1 className="mt-4 font-serif text-title">We couldn&rsquo;t find that page or record.</h1>
      <p className="mt-4 leading-relaxed text-muted">It may have moved, or it isn&rsquo;t linked to your account.</p>
      <ButtonLink href="/dashboard" className="mt-8" arrow>
        Back to Overview
      </ButtonLink>
    </div>
  );
}
