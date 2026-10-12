import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "outline-light" | "text";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-3 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50 rounded-[2px]";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-ivory hover:bg-olive-ink border border-charcoal hover:border-olive-ink",
  secondary: "border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
  light: "bg-ivory text-charcoal hover:bg-paper border border-ivory focus-light",
  "outline-light": "border border-ivory/70 text-ivory hover:bg-ivory hover:text-charcoal focus-light",
  text: "px-0! py-0! min-h-0! text-charcoal underline-offset-[6px] hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 py-3",
  lg: "min-h-14 px-8 py-4",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      className="transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1"
    >
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({
  variant,
  size,
  arrow,
  children,
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

/** External link (e.g. official leasing portal) — opens in a new tab with a hint. */
export function ExternalButtonLink({
  variant,
  size,
  children,
  className,
  href,
}: CommonProps & { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses(variant, size, className)}>
      {children}
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4 1h7v7M11 1 1 11" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Button({
  variant,
  size,
  arrow,
  children,
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
