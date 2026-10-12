import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow text-olive-ink ${className}`}>{children}</p>;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Heading = "h2",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <Eyebrow className={`mb-5 ${tone === "light" ? "text-stone!" : ""}`}>{eyebrow}</Eyebrow>
      )}
      <Heading
        className={`font-serif text-headline font-normal ${tone === "light" ? "text-ivory" : "text-charcoal"}`}
      >
        {title}
      </Heading>
      {intro && (
        <div
          className={`mt-6 text-[1.0625rem] leading-relaxed ${centered ? "mx-auto" : ""} max-w-[56ch] ${
            tone === "light" ? "text-stone" : "text-muted"
          }`}
        >
          {intro}
        </div>
      )}
    </div>
  );
}

/** Small, honest label shown wherever sample (non-live) data is displayed. */
export function SampleTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-taupe-ink/40 bg-paper/90 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-taupe-ink ${className}`}
    >
      Sample data
    </span>
  );
}

/** Marks content awaiting official copy from the client (policies, legal). */
export function PlaceholderNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={`border-l-2 border-taupe bg-stone-soft px-5 py-4 text-sm leading-relaxed text-muted ${className}`}
    >
      {children}
    </div>
  );
}
