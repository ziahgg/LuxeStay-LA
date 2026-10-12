"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { Neighborhood } from "@/lib/properties/types";
import { Button } from "@/components/ui/button";

/**
 * Hero search. A plain GET form to /residences, so it works before (or
 * without) JavaScript; the client layer only adds date-range validation.
 */
export function StayFinder({ neighborhoods, className = "" }: { neighborhoods: Neighborhood[]; className?: string }) {
  const id = useId();
  const router = useRouter();
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action="/residences"
      method="get"
      role="search"
      aria-label="Find your stay"
      noValidate
      onSubmit={(e) => {
        if (moveIn && moveOut && moveOut <= moveIn) {
          e.preventDefault();
          setError("Move-out must be after move-in.");
          return;
        }
        setError(null);
        // Navigate client-side with only the fields that were filled in.
        e.preventDefault();
        const params = new URLSearchParams();
        for (const [key, value] of new FormData(e.currentTarget)) {
          if (typeof value === "string" && value) params.set(key, value);
        }
        const qs = params.toString();
        router.push(qs ? `/residences?${qs}` : "/residences");
      }}
      className={`bg-paper p-5 shadow-[0_30px_80px_-40px_rgba(36,36,33,0.45)] sm:p-6 lg:p-7 ${className}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr_auto] lg:items-end lg:gap-5">
        <div>
          <label htmlFor={`${id}-n`} className="field-label">
            Location
          </label>
          <select id={`${id}-n`} name="neighborhood" className="field" defaultValue="">
            <option value="">All neighborhoods</option>
            {neighborhoods.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-in`} className="field-label">
            Move-in
          </label>
          <input
            id={`${id}-in`}
            type="date"
            name="moveIn"
            className="field"
            value={moveIn}
            onChange={(e) => setMoveIn(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${id}-out`} className="field-label">
            Move-out
          </label>
          <input
            id={`${id}-out`}
            type="date"
            name="moveOut"
            className="field"
            min={moveIn || undefined}
            value={moveOut}
            onChange={(e) => setMoveOut(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
          />
        </div>
        <div>
          <label htmlFor={`${id}-b`} className="field-label">
            Bedrooms
          </label>
          <select id={`${id}-b`} name="bedrooms" className="field" defaultValue="">
            <option value="">Any</option>
            <option value="0">Studio</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>
        <Button type="submit" size="lg" className="w-full sm:col-span-2 lg:col-span-1 lg:min-h-12! lg:w-auto">
          Search
        </Button>
      </div>
      <p id={`${id}-err`} role="alert" className="mt-3 text-sm text-error empty:hidden">
        {error}
      </p>
    </form>
  );
}
